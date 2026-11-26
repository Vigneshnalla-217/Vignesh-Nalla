import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const TARGET_EMAIL = 'vigneshnalla28@gmail.com';

// Simple in-memory rate limiter per IP for /api/contact
const rateLimitWindowMs = 10 * 60 * 1000;
const maxRequestsPerWindow = 5;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter((t) => now - t < rateLimitWindowMs);
  if (timestamps.length >= maxRequestsPerWindow) {
    requestLog.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return false;
}

function sanitizeText(value: unknown, maxLen: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, maxLen);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254;
}

async function startServer() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '16kb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true, contactConfigured: Boolean(process.env.RESEND_API_KEY) });
  });

  app.post('/api/contact', async (req: Request, res: Response) => {
    const clientIp = req.ip || 'unknown';
    if (isRateLimited(clientIp)) {
      res.status(429).json({
        delivered: false,
        error: 'Too many requests. Please wait a few minutes or send an email directly.',
      });
      return;
    }

    const name = sanitizeText(req.body?.name, 100);
    const email = sanitizeText(req.body?.email, 254);
    const subject = sanitizeText(req.body?.subject, 160);
    const message = sanitizeText(req.body?.message, 4000);

    if (name.length < 2) {
      res.status(400).json({ delivered: false, error: 'Please enter your name (at least 2 characters).' });
      return;
    }
    if (!isValidEmail(email)) {
      res.status(400).json({ delivered: false, error: 'Please enter a valid email address.' });
      return;
    }
    if (subject.length < 2) {
      res.status(400).json({ delivered: false, error: 'Please enter a subject.' });
      return;
    }
    if (message.length < 10) {
      res.status(400).json({ delivered: false, error: 'Please write a message of at least 10 characters.' });
      return;
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      // Honest response: never simulate or fake email delivery
      res.status(503).json({
        delivered: false,
        configured: false,
        error:
          'Direct server email delivery is not configured on this deployment yet. Use the direct email app button below to send your message to Vignesh.',
      });
      return;
    }

    try {
      const fromAddress = process.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [TARGET_EMAIL],
          reply_to: email,
          subject: `[vigneshnalla.com] ${subject}`,
          text: `New portfolio contact message\n\nFrom: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
        }),
      });

      if (!response.ok) {
        res.status(502).json({
          delivered: false,
          configured: true,
          error: 'The email provider could not deliver the message right now. Please try your email client below.',
        });
        return;
      }

      res.status(200).json({
        delivered: true,
        message: 'Your message has been delivered to Vignesh Nalla.',
      });
    } catch {
      res.status(502).json({
        delivered: false,
        configured: true,
        error: 'Network error while contacting the email service. Please send directly via your email app.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
