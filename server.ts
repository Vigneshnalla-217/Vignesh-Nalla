import 'dotenv/config';
import crypto from 'crypto';
import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const TARGET_EMAIL = 'vigneshnalla28@gmail.com';
const DATA_DIR = path.resolve(__dirname, 'data');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');
const OWNER_AUTH_FILE = path.join(DATA_DIR, 'owner-auth.json');

// Session signing secret: use env var or strong per-process random bytes
const SESSION_SECRET =
  process.env.ANALYTICS_SESSION_SECRET?.trim() || crypto.randomBytes(32).toString('hex');
// Ephemeral daily salt for privacy-preserving unique visitor counting (never stores raw IP)
const VISITOR_HASH_SALT = crypto.randomBytes(24).toString('hex');

// --- Rate limiters ---
const contactRateMap = new Map<string, number[]>();
const authRateMap = new Map<string, number[]>();
const trackRateMap = new Map<string, number[]>();

function isRateLimited(map: Map<string, number[]>, key: string, windowMs: number, maxHits: number): boolean {
  const now = Date.now();
  const hits = (map.get(key) || []).filter((t) => now - t < windowMs);
  if (hits.length >= maxHits) {
    map.set(key, hits);
    return true;
  }
  hits.push(now);
  map.set(key, hits);
  return false;
}

function sanitizeText(value: unknown, maxLen: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, maxLen);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254;
}

// --- Analytics Persistence (Zero Fake Data) ---
type TrafficSource = 'Direct' | 'Instagram' | 'GitHub' | 'Search' | 'Other';
type DeviceCategory = 'Desktop' | 'Mobile' | 'Tablet';

interface DailyBucket {
  date: string;
  visitors: number;
  pageViews: number;
  seenHashes: string[];
}

interface AnalyticsStore {
  totalVisitors: number;
  totalPageViews: number;
  instagramReferrals: number;
  githubReferrals: number;
  sources: Record<TrafficSource, number>;
  devices: Record<DeviceCategory, number>;
  daily: DailyBucket[];
}

function createEmptyAnalytics(): AnalyticsStore {
  return {
    totalVisitors: 0,
    totalPageViews: 0,
    instagramReferrals: 0,
    githubReferrals: 0,
    sources: {
      Direct: 0,
      Instagram: 0,
      GitHub: 0,
      Search: 0,
      Other: 0,
    },
    devices: {
      Desktop: 0,
      Mobile: 0,
      Tablet: 0,
    },
    daily: [],
  };
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readAnalytics(): AnalyticsStore {
  try {
    if (!fs.existsSync(ANALYTICS_FILE)) {
      return createEmptyAnalytics();
    }
    const raw = fs.readFileSync(ANALYTICS_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<AnalyticsStore>;
    const empty = createEmptyAnalytics();
    return {
      totalVisitors: typeof parsed.totalVisitors === 'number' ? parsed.totalVisitors : 0,
      totalPageViews: typeof parsed.totalPageViews === 'number' ? parsed.totalPageViews : 0,
      instagramReferrals: typeof parsed.instagramReferrals === 'number' ? parsed.instagramReferrals : 0,
      githubReferrals: typeof parsed.githubReferrals === 'number' ? parsed.githubReferrals : 0,
      sources: { ...empty.sources, ...(parsed.sources || {}) },
      devices: { ...empty.devices, ...(parsed.devices || {}) },
      daily: Array.isArray(parsed.daily) ? parsed.daily : [],
    };
  } catch {
    return createEmptyAnalytics();
  }
}

function writeAnalytics(store: AnalyticsStore) {
  ensureDataDir();
  const tempPath = `${ANALYTICS_FILE}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(store, null, 2), 'utf-8');
  fs.renameSync(tempPath, ANALYTICS_FILE);
}

function classifySource(referrerRaw: string, utmSourceRaw: string): TrafficSource {
  const utm = utmSourceRaw.toLowerCase();
  if (utm.includes('instagram') || utm === 'ig') return 'Instagram';
  if (utm.includes('github') || utm === 'gh') return 'GitHub';
  if (utm.includes('google') || utm.includes('bing') || utm.includes('duckduckgo')) return 'Search';

  if (!referrerRaw) return 'Direct';
  try {
    const host = new URL(referrerRaw).hostname.toLowerCase();
    if (host.includes('instagram.com') || host === 'l.instagram.com' || host === 'instagr.am') {
      return 'Instagram';
    }
    if (host.includes('github.com') || host === 'gist.github.com') {
      return 'GitHub';
    }
    if (
      host.includes('google.') ||
      host.includes('bing.com') ||
      host.includes('duckduckgo.com') ||
      host.includes('search.yahoo.com')
    ) {
      return 'Search';
    }
    if (host === 'vigneshnalla.com' || host === 'www.vigneshnalla.com' || host === 'localhost') {
      return 'Direct';
    }
    return 'Other';
  } catch {
    return 'Direct';
  }
}

function classifyDevice(userAgent: string, hint: string): DeviceCategory {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|playbook|silk|(android(?!.*mobi))/i.test(ua)) return 'Tablet';
  if (/mobi|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'Mobile';
  if (hint === 'Tablet' || hint === 'Mobile' || hint === 'Desktop') return hint;
  return 'Desktop';
}

// --- Owner Authentication Helpers ---
interface OwnerAuthRecord {
  salt: string;
  hash: string;
  claimedAt: string;
}

function readClaimedOwnerAuth(): OwnerAuthRecord | null {
  try {
    if (!fs.existsSync(OWNER_AUTH_FILE)) return null;
    const raw = fs.readFileSync(OWNER_AUTH_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<OwnerAuthRecord>;
    if (typeof parsed.salt === 'string' && typeof parsed.hash === 'string') {
      return {
        salt: parsed.salt,
        hash: parsed.hash,
        claimedAt: typeof parsed.claimedAt === 'string' ? parsed.claimedAt : new Date().toISOString(),
      };
    }
    return null;
  } catch {
    return null;
  }
}

function hashPasscode(passcode: string): OwnerAuthRecord {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(passcode, salt, 64).toString('hex');
  return { salt, hash, claimedAt: new Date().toISOString() };
}

function verifyPasscodeHash(passcode: string, record: OwnerAuthRecord): boolean {
  const derived = crypto.scryptSync(passcode, record.salt, 64);
  const stored = Buffer.from(record.hash, 'hex');
  if (derived.length !== stored.length) return false;
  return crypto.timingSafeEqual(derived, stored);
}

function timingSafeCompareText(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, 'utf-8');
  const bBuf = Buffer.from(b, 'utf-8');
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function signSessionToken(): string {
  const payload = {
    role: 'owner',
    exp: Date.now() + 4 * 60 * 60 * 1000,
    jti: crypto.randomBytes(12).toString('hex'),
  };
  const encoded = Buffer.from(JSON.stringify(payload), 'utf-8').toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
}

function verifySessionToken(token: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [encoded, sig] = parts;
  const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(encoded).digest('base64url');
  const sigBuf = Buffer.from(sig, 'utf-8');
  const expectedBuf = Buffer.from(expectedSig, 'utf-8');
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return false;
  }
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf-8')) as {
      role?: string;
      exp?: number;
    };
    return payload.role === 'owner' && typeof payload.exp === 'number' && payload.exp > Date.now();
  } catch {
    return false;
  }
}

function requireOwnerAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Owner authentication required.' });
    return;
  }
  const token = authHeader.slice('Bearer '.length).trim();
  if (!verifySessionToken(token)) {
    res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
    return;
  }
  next();
}

function isEmailDeliveryConfigured(): boolean {
  const hasGmail = Boolean(process.env.GMAIL_USER?.trim() && process.env.GMAIL_APP_PASSWORD?.trim());
  const hasResend = Boolean(process.env.RESEND_API_KEY?.trim());
  return hasGmail || hasResend;
}

async function startServer() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '16kb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      ok: true,
      contactConfigured: isEmailDeliveryConfigured(),
    });
  });

  // --- Privacy-Conscious Website Analytics Tracking ---
  app.post('/api/analytics/track', (req: Request, res: Response) => {
    if (req.headers.dnt === '1') {
      res.status(204).end();
      return;
    }

    const clientIp = req.ip || 'unknown';
    if (isRateLimited(trackRateMap, clientIp, 60 * 1000, 30)) {
      res.status(204).end();
      return;
    }

    const referrer = sanitizeText(req.body?.referrer, 300);
    const utmSource = sanitizeText(req.body?.utmSource, 60);
    const deviceHint = sanitizeText(req.body?.deviceHint, 20);
    const userAgent = sanitizeText(req.headers['user-agent'], 300);

    const source = classifySource(referrer, utmSource);
    const device = classifyDevice(userAgent, deviceHint);
    const today = new Date().toISOString().slice(0, 10);

    // Ephemeral daily anonymous hash (no raw IP or username stored)
    const anonymousVisitorHash = crypto
      .createHmac('sha256', VISITOR_HASH_SALT)
      .update(`${today}|${clientIp}|${userAgent}`)
      .digest('hex')
      .slice(0, 16);

    const store = readAnalytics();
    store.totalPageViews += 1;
    store.sources[source] = (store.sources[source] || 0) + 1;
    store.devices[device] = (store.devices[device] || 0) + 1;

    if (source === 'Instagram') store.instagramReferrals += 1;
    if (source === 'GitHub') store.githubReferrals += 1;

    let bucket = store.daily.find((d) => d.date === today);
    if (!bucket) {
      bucket = { date: today, visitors: 0, pageViews: 0, seenHashes: [] };
      store.daily.push(bucket);
      // Retain up to 30 recent days
      if (store.daily.length > 30) {
        store.daily = store.daily.slice(-30);
      }
    }

    bucket.pageViews += 1;
    if (!bucket.seenHashes.includes(anonymousVisitorHash)) {
      bucket.seenHashes.push(anonymousVisitorHash);
      bucket.visitors += 1;
      store.totalVisitors += 1;
    }

    writeAnalytics(store);
    res.status(204).end();
  });

  // --- Owner-Only Analytics Auth & Summary ---
  app.get('/api/analytics/auth-status', (_req: Request, res: Response) => {
    const envPasscode = process.env.OWNER_ANALYTICS_PASSCODE?.trim();
    if (envPasscode) {
      res.json({ configured: true, mode: 'env' });
      return;
    }
    const claimed = readClaimedOwnerAuth();
    if (claimed) {
      res.json({ configured: true, mode: 'claimed' });
      return;
    }
    res.json({ configured: false, mode: 'unclaimed' });
  });

  app.post('/api/analytics/claim', (req: Request, res: Response) => {
    const envPasscode = process.env.OWNER_ANALYTICS_PASSCODE?.trim();
    if (envPasscode || readClaimedOwnerAuth()) {
      res.status(409).json({ error: 'Owner passcode has already been configured.' });
      return;
    }

    const passcode = typeof req.body?.passcode === 'string' ? req.body.passcode.trim() : '';
    if (passcode.length < 8 || passcode.length > 128) {
      res.status(400).json({ error: 'Passcode must be between 8 and 128 characters.' });
      return;
    }

    ensureDataDir();
    const record = hashPasscode(passcode);
    try {
      // Atomic exclusive write prevents concurrent first-run claim races
      fs.writeFileSync(OWNER_AUTH_FILE, JSON.stringify(record, null, 2), {
        encoding: 'utf-8',
        flag: 'wx',
      });
    } catch {
      res.status(409).json({ error: 'Owner passcode has already been claimed.' });
      return;
    }

    const token = signSessionToken();
    res.status(201).json({ token });
  });

  app.post('/api/analytics/login', (req: Request, res: Response) => {
    const clientIp = req.ip || 'unknown';
    if (isRateLimited(authRateMap, clientIp, 15 * 60 * 1000, 8)) {
      res.status(429).json({ error: 'Too many login attempts. Please wait 15 minutes.' });
      return;
    }

    const passcode = typeof req.body?.passcode === 'string' ? req.body.passcode.trim() : '';
    if (!passcode) {
      res.status(400).json({ error: 'Please enter your owner passcode.' });
      return;
    }

    const envPasscode = process.env.OWNER_ANALYTICS_PASSCODE?.trim();
    if (envPasscode) {
      if (!timingSafeCompareText(passcode, envPasscode)) {
        res.status(401).json({ error: 'Invalid owner passcode.' });
        return;
      }
      res.json({ token: signSessionToken() });
      return;
    }

    const claimed = readClaimedOwnerAuth();
    if (!claimed) {
      res.status(400).json({ error: 'Owner passcode is not set yet. Claim your passcode first.' });
      return;
    }

    if (!verifyPasscodeHash(passcode, claimed)) {
      res.status(401).json({ error: 'Invalid owner passcode.' });
      return;
    }

    res.json({ token: signSessionToken() });
  });

  app.get('/api/analytics/summary', requireOwnerAuth, (_req: Request, res: Response) => {
    const store = readAnalytics();
    res.json({
      totalVisitors: store.totalVisitors,
      totalPageViews: store.totalPageViews,
      instagramReferrals: store.instagramReferrals,
      githubReferrals: store.githubReferrals,
      sources: store.sources,
      devices: store.devices,
      dailyHistory: store.daily.map(({ date, visitors, pageViews }) => ({
        date,
        visitors,
        pageViews,
      })),
    });
  });

  // --- Contact Form Notification (Gmail SMTP or Resend API) ---
  app.post('/api/contact', async (req: Request, res: Response) => {
    const clientIp = req.ip || 'unknown';
    if (isRateLimited(contactRateMap, clientIp, 10 * 60 * 1000, 5)) {
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

    const gmailUser = process.env.GMAIL_USER?.trim();
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD?.trim();
    const resendApiKey = process.env.RESEND_API_KEY?.trim();

    if (!gmailUser && !resendApiKey) {
      res.status(503).json({
        delivered: false,
        configured: false,
        error:
          'Direct Gmail notification credentials are not configured on this server yet. Use your email app below to send this message directly to Vignesh.',
      });
      return;
    }

    // Option 1: Direct Gmail SMTP notification via Nodemailer
    if (gmailUser && gmailAppPassword) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: gmailUser,
            pass: gmailAppPassword,
          },
        });

        await transporter.sendMail({
          from: `"Portfolio Contact" <${gmailUser}>`,
          to: TARGET_EMAIL,
          replyTo: email,
          subject: `[vigneshnalla.com] ${subject}`,
          text: `New portfolio contact submission\n\nVisitor Name: ${name}\nVisitor Email: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
        });

        res.status(200).json({
          delivered: true,
          message: `Your message has been delivered to ${TARGET_EMAIL}.`,
        });
        return;
      } catch {
        // Fall through to Resend if configured, otherwise report honest failure
        if (!resendApiKey) {
          res.status(502).json({
            delivered: false,
            configured: true,
            error: 'Gmail notification delivery failed. Please use your email app below.',
          });
          return;
        }
      }
    }

    // Option 2: Resend REST API
    if (resendApiKey) {
      try {
        const fromAddress =
          process.env.CONTACT_FROM_EMAIL?.trim() || 'Portfolio Contact <onboarding@resend.dev>';
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
            text: `New portfolio contact submission\n\nVisitor Name: ${name}\nVisitor Email: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
          }),
        });

        if (!response.ok) {
          res.status(502).json({
            delivered: false,
            configured: true,
            error: 'The email provider could not deliver the message right now. Please try your email app below.',
          });
          return;
        }

        res.status(200).json({
          delivered: true,
          message: `Your message has been delivered to ${TARGET_EMAIL}.`,
        });
        return;
      } catch {
        res.status(502).json({
          delivered: false,
          configured: true,
          error: 'Network error while sending notification. Please try your email app below.',
        });
        return;
      }
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
