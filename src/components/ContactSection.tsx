import { FormEvent, useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Github,
  Instagram,
  Mail,
  Send,
} from 'lucide-react';
import { portfolioConfig } from '../data/portfolioConfig';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';
import { SectionHeader } from './SectionHeader';

type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'delivered'; message: string }
  | { status: 'fallback'; message: string }
  | { status: 'error'; message: string };

export function ContactSection() {
  const { reducedMotion } = useDeviceCapabilities();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>({ status: 'idle' });
  const [copied, setCopied] = useState(false);

  const buildMailtoHref = () => {
    const mailSubject = subject.trim() || `Portfolio Inquiry from ${name.trim() || 'Visitor'}`;
    const mailBody = [
      name.trim() ? `Name: ${name.trim()}` : '',
      email.trim() ? `Reply Email: ${email.trim()}` : '',
      '',
      message.trim(),
    ]
      .filter(Boolean)
      .join('\n');

    return `mailto:${portfolioConfig.social.email}?subject=${encodeURIComponent(
      mailSubject
    )}&body=${encodeURIComponent(mailBody)}`;
  };

  const handleCopyDetails = async () => {
    const text = `To: ${portfolioConfig.social.email}\nFrom: ${name} <${email}>\nSubject: ${subject}\n\n${message}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (name.trim().length < 2) {
      setSubmitState({ status: 'error', message: 'Please enter your name (at least 2 characters).' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setSubmitState({ status: 'error', message: 'Please enter a valid email address.' });
      return;
    }
    if (subject.trim().length < 2) {
      setSubmitState({ status: 'error', message: 'Please enter a subject.' });
      return;
    }
    if (message.trim().length < 10) {
      setSubmitState({
        status: 'error',
        message: 'Please write a message of at least 10 characters.',
      });
      return;
    }

    setSubmitState({ status: 'submitting' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.delivered === true) {
        setSubmitState({
          status: 'delivered',
          message: data.message || 'Your message has been delivered to Vignesh Nalla.',
        });
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        return;
      }

      if (response.status === 503 || data?.configured === false) {
        setSubmitState({
          status: 'fallback',
          message:
            data?.error ||
            'Direct server email delivery is not configured yet. Use your email app below to send this message directly.',
        });
        return;
      }

      if (response.status >= 400 && response.status < 500 && data?.error) {
        setSubmitState({ status: 'error', message: data.error });
        return;
      }

      setSubmitState({
        status: 'fallback',
        message:
          'Direct server email delivery is unavailable right now. Use your email app below to send this message directly.',
      });
    } catch {
      setSubmitState({
        status: 'fallback',
        message:
          'Unable to reach the server email endpoint. Use your email app below to send this message directly.',
      });
    }
  };

  return (
    <section id="contact" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          index="07"
          eyebrow="Contact"
          title={portfolioConfig.contact.heading}
          description={portfolioConfig.contact.subheading}
        />

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Direct Channels Column */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4 lg:col-span-5"
          >
            {/* Email Card */}
            <div className="rounded-2xl border border-white/[0.1] bg-[#100C16]/90 p-6">
              <div className="flex items-center gap-3 text-sm font-medium text-[#A69EAC]">
                <Mail className="h-4 w-4 text-[#FF557F]" />
                <span>Email</span>
              </div>
              <p className="mt-2 font-display text-lg font-semibold text-[#F5F1F7] break-all">
                {portfolioConfig.social.email}
              </p>
              <a
                href={`mailto:${portfolioConfig.social.email}`}
                className="mt-4 inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF557F] to-[#C44D9E] px-5 py-2.5 text-xs font-semibold text-[#09070D] transition-all hover:brightness-110 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#FF557F]"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Send Email</span>
              </a>
            </div>

            {/* GitHub Card */}
            <div className="rounded-2xl border border-white/[0.1] bg-[#100C16]/90 p-6">
              <div className="flex items-center gap-3 text-sm font-medium text-[#A69EAC]">
                <Github className="h-4 w-4 text-[#9272FF]" />
                <span>GitHub</span>
              </div>
              <p className="mt-2 font-display text-lg font-semibold text-[#F5F1F7]">
                @{portfolioConfig.social.githubHandle}
              </p>
              <a
                href={portfolioConfig.social.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-[#9272FF]/45 bg-[#9272FF]/12 px-5 py-2.5 text-xs font-semibold text-[#F5F1F7] transition-colors hover:bg-[#9272FF]/25 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#9272FF]"
              >
                <Github className="h-3.5 w-3.5" />
                <span>Visit GitHub</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Instagram Card */}
            <div className="rounded-2xl border border-white/[0.1] bg-[#100C16]/90 p-6">
              <div className="flex items-center gap-3 text-sm font-medium text-[#A69EAC]">
                <Instagram className="h-4 w-4 text-[#C44D9E]" />
                <span>Instagram</span>
              </div>
              <p className="mt-2 font-display text-lg font-semibold text-[#F5F1F7]">
                {portfolioConfig.social.instagramHandle}
              </p>
              <a
                href={portfolioConfig.social.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-white/15 bg-[#09070D] px-5 py-2.5 text-xs font-semibold text-[#F5F1F7] transition-colors hover:border-[#C44D9E]/60 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#C44D9E]"
              >
                <Instagram className="h-3.5 w-3.5 text-[#C44D9E]" />
                <span>Follow Instagram</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </motion.div>

          {/* Contact Form Column */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-2xl border border-white/[0.1] bg-[#100C16]/90 p-6 sm:p-8"
            >
              <h3 className="font-display text-xl font-semibold text-[#F5F1F7]">
                Send a Message
              </h3>
              <p className="mt-1 text-sm text-[#A69EAC]">
                Fill out the form below to send a message directly or open it in your email app.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-medium text-[#A69EAC]">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="mt-1.5 w-full rounded-xl border border-white/12 bg-[#09070D] px-4 py-3 text-sm text-[#F5F1F7] placeholder:text-[#A69EAC]/50 focus:border-[#FF557F] focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-medium text-[#A69EAC]">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1.5 w-full rounded-xl border border-white/12 bg-[#09070D] px-4 py-3 text-sm text-[#F5F1F7] placeholder:text-[#A69EAC]/50 focus:border-[#9272FF] focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="contact-subject" className="block text-xs font-medium text-[#A69EAC]">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Project idea, collaboration, or hello"
                  className="mt-1.5 w-full rounded-xl border border-white/12 bg-[#09070D] px-4 py-3 text-sm text-[#F5F1F7] placeholder:text-[#A69EAC]/50 focus:border-[#FF557F] focus:outline-none"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="contact-message" className="block text-xs font-medium text-[#A69EAC]">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message..."
                  className="mt-1.5 w-full resize-y rounded-xl border border-white/12 bg-[#09070D] px-4 py-3 text-sm text-[#F5F1F7] placeholder:text-[#A69EAC]/50 focus:border-[#9272FF] focus:outline-none"
                />
              </div>

              {/* Honest Submission Feedback States */}
              {submitState.status === 'delivered' && (
                <div
                  role="status"
                  className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-500/35 bg-emerald-500/10 p-4 text-sm text-emerald-200"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{submitState.message}</span>
                </div>
              )}

              {submitState.status === 'error' && (
                <div
                  role="alert"
                  className="mt-4 flex items-start gap-3 rounded-xl border border-[#FF557F]/45 bg-[#FF557F]/10 p-4 text-sm text-[#F5F1F7]"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#FF557F]" />
                  <span>{submitState.message}</span>
                </div>
              )}

              {submitState.status === 'fallback' && (
                <div
                  role="status"
                  className="mt-4 rounded-xl border border-[#9272FF]/45 bg-[#9272FF]/10 p-4 text-sm text-[#F5F1F7]"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#9272FF]" />
                    <div>
                      <p>{submitState.message}</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <a
                          href={buildMailtoHref()}
                          className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-[#FF557F] px-4 py-2 text-xs font-semibold text-[#09070D] hover:brightness-110 whitespace-nowrap shrink-0"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          <span>Open in Email App</span>
                        </a>
                        <button
                          type="button"
                          onClick={handleCopyDetails}
                          className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-white/15 bg-[#09070D] px-4 py-2 text-xs font-medium text-[#F5F1F7] hover:border-white/30 whitespace-nowrap shrink-0"
                        >
                          {copied ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>Copy Message</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={submitState.status === 'submitting'}
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF557F] to-[#9272FF] px-6 py-3 text-sm font-semibold text-[#09070D] transition-all hover:brightness-110 disabled:opacity-60 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#FF557F]"
                >
                  <Send className="h-4 w-4" />
                  <span>{submitState.status === 'submitting' ? 'Sending...' : 'Submit'}</span>
                </button>

                <span className="text-xs text-[#A69EAC]">
                  Direct to {portfolioConfig.social.email}
                </span>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
