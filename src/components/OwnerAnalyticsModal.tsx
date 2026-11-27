import { FormEvent, useEffect, useState } from 'react';
import {
  BarChart3,
  Eye,
  Github,
  Instagram,
  Lock,
  LogOut,
  Monitor,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Tablet,
  Users,
  X,
} from 'lucide-react';

interface AnalyticsSummary {
  totalVisitors: number;
  totalPageViews: number;
  instagramReferrals: number;
  githubReferrals: number;
  sources: Record<string, number>;
  devices: Record<string, number>;
  dailyHistory: Array<{ date: string; visitors: number; pageViews: number }>;
}

interface OwnerAnalyticsModalProps {
  open: boolean;
  onClose: () => void;
}

export function OwnerAnalyticsModal({ open, onClose }: OwnerAnalyticsModalProps) {
  // Token kept strictly in React memory (never persisted in localStorage/sessionStorage)
  const [token, setToken] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'loading' | 'unclaimed' | 'configured'>('loading');
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || token) return;
    let cancelled = false;
    setAuthMode('loading');
    setAuthError(null);

    fetch('/api/analytics/auth-status')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setAuthMode(data?.configured ? 'configured' : 'unclaimed');
      })
      .catch(() => {
        if (!cancelled) {
          setAuthMode('configured');
          setAuthError('Unable to check owner authentication status.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open, token]);

  const fetchSummary = async (bearerToken: string) => {
    setLoadingSummary(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/analytics/summary', {
        headers: { Authorization: `Bearer ${bearerToken}` },
      });
      if (res.status === 401) {
        setToken(null);
        setSummary(null);
        setAuthError('Session expired. Please sign in again.');
        return;
      }
      if (!res.ok) {
        setAuthError('Could not load analytics data.');
        return;
      }
      const data = (await res.json()) as AnalyticsSummary;
      setSummary(data);
    } catch {
      setAuthError('Network error while loading analytics.');
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    if (open && token) {
      fetchSummary(token);
    }
  }, [open, token]);

  const handleClaim = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (passcode.trim().length < 8) {
      setAuthError('Passcode must be at least 8 characters.');
      return;
    }
    if (passcode !== confirmPasscode) {
      setAuthError('Passcodes do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/analytics/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcode.trim() }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.token) {
        setAuthError(data?.error || 'Could not claim owner passcode.');
        if (res.status === 409) setAuthMode('configured');
        return;
      }
      setPasscode('');
      setConfirmPasscode('');
      setAuthMode('configured');
      setToken(data.token);
    } catch {
      setAuthError('Network error while setting owner passcode.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!passcode.trim()) {
      setAuthError('Please enter your owner passcode.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/analytics/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcode.trim() }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.token) {
        setAuthError(data?.error || 'Invalid owner passcode.');
        return;
      }
      setPasscode('');
      setToken(data.token);
    } catch {
      setAuthError('Network error while signing in.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const sourceEntries = summary
    ? Object.entries(summary.sources).sort((a, b) => b[1] - a[1])
    : [];
  const maxSourceVal = Math.max(1, ...sourceEntries.map(([, count]) => count));

  const deviceEntries = summary ? Object.entries(summary.devices) : [];
  const totalDevices = Math.max(
    1,
    deviceEntries.reduce((acc, [, count]) => acc + count, 0)
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="owner-analytics-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/15 bg-[#100C16] p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.9)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#FF557F]">
              <Lock className="h-3.5 w-3.5" />
              <span>Owner-Only Access</span>
            </div>
            <h2
              id="owner-analytics-title"
              className="mt-1.5 font-display text-2xl font-bold text-[#F5F1F7]"
            >
              Website Analytics Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {token && (
              <>
                <button
                  type="button"
                  onClick={() => fetchSummary(token)}
                  disabled={loadingSummary}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/12 bg-[#09070D] px-3 text-xs font-medium text-[#A69EAC] hover:text-[#F5F1F7]"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loadingSummary ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setToken(null);
                    setSummary(null);
                  }}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/12 bg-[#09070D] px-3 text-xs font-medium text-[#A69EAC] hover:text-[#FF557F]"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close analytics dashboard"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/12 text-[#A69EAC] hover:border-white/30 hover:text-[#F5F1F7]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Auth Gate */}
        {!token ? (
          <div className="mt-6">
            {authMode === 'loading' ? (
              <p className="text-sm text-[#A69EAC]">Checking owner verification status...</p>
            ) : authMode === 'unclaimed' ? (
              <form onSubmit={handleClaim} className="space-y-4 max-w-md">
                <div className="rounded-xl border border-[#9272FF]/35 bg-[#9272FF]/10 p-4 text-xs leading-relaxed text-[#F5F1F7]">
                  <p className="font-semibold">First-Time Owner Setup</p>
                  <p className="mt-1 text-[#A69EAC]">
                    No owner passcode has been set yet. Create your private passcode (minimum 8
                    characters) to lock this analytics dashboard, or configure{' '}
                    <code className="font-mono text-[#F5F1F7]">OWNER_ANALYTICS_PASSCODE</code> in
                    your hosting environment variables.
                  </p>
                </div>

                <div>
                  <label htmlFor="claim-passcode" className="block text-xs font-medium text-[#A69EAC]">
                    Create Owner Passcode
                  </label>
                  <input
                    id="claim-passcode"
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="At least 8 characters"
                    className="mt-1.5 w-full rounded-xl border border-white/12 bg-[#09070D] px-4 py-2.5 text-sm text-[#F5F1F7] focus:border-[#FF557F] focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="confirm-passcode" className="block text-xs font-medium text-[#A69EAC]">
                    Confirm Passcode
                  </label>
                  <input
                    id="confirm-passcode"
                    type="password"
                    value={confirmPasscode}
                    onChange={(e) => setConfirmPasscode(e.target.value)}
                    placeholder="Re-enter passcode"
                    className="mt-1.5 w-full rounded-xl border border-white/12 bg-[#09070D] px-4 py-2.5 text-sm text-[#F5F1F7] focus:border-[#9272FF] focus:outline-none"
                  />
                </div>

                {authError && <p className="text-xs text-[#FF557F]">{authError}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF557F] to-[#9272FF] px-5 py-2 text-xs font-semibold text-[#09070D]"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{submitting ? 'Securing...' : 'Set Owner Passcode'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4 max-w-md">
                <p className="text-sm text-[#A69EAC]">
                  Enter your owner passcode to view real visitor metrics, referral sources, and
                  device statistics.
                </p>

                <div>
                  <label htmlFor="owner-passcode" className="block text-xs font-medium text-[#A69EAC]">
                    Owner Passcode
                  </label>
                  <input
                    id="owner-passcode"
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter your owner passcode"
                    className="mt-1.5 w-full rounded-xl border border-white/12 bg-[#09070D] px-4 py-2.5 text-sm text-[#F5F1F7] focus:border-[#FF557F] focus:outline-none"
                  />
                </div>

                {authError && <p className="text-xs text-[#FF557F]">{authError}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF557F] to-[#9272FF] px-5 py-2 text-xs font-semibold text-[#09070D]"
                >
                  <Lock className="h-4 w-4" />
                  <span>{submitting ? 'Verifying...' : 'Unlock Analytics'}</span>
                </button>
              </form>
            )}
          </div>
        ) : (
          /* Authenticated Real Analytics View */
          <div className="mt-6 space-y-6">
            {authError && <p className="text-xs text-[#FF557F]">{authError}</p>}

            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-white/[0.08] bg-[#09070D] p-4">
                <div className="flex items-center justify-between text-xs text-[#A69EAC]">
                  <span>Total Visitors</span>
                  <Users className="h-4 w-4 text-[#FF557F]" />
                </div>
                <p className="mt-2 font-display text-2xl font-bold tabular-nums text-[#F5F1F7]">
                  {summary?.totalVisitors ?? 0}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.08] bg-[#09070D] p-4">
                <div className="flex items-center justify-between text-xs text-[#A69EAC]">
                  <span>Page Views</span>
                  <Eye className="h-4 w-4 text-[#9272FF]" />
                </div>
                <p className="mt-2 font-display text-2xl font-bold tabular-nums text-[#F5F1F7]">
                  {summary?.totalPageViews ?? 0}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.08] bg-[#09070D] p-4">
                <div className="flex items-center justify-between text-xs text-[#A69EAC]">
                  <span>Instagram</span>
                  <Instagram className="h-4 w-4 text-[#C44D9E]" />
                </div>
                <p className="mt-2 font-display text-2xl font-bold tabular-nums text-[#F5F1F7]">
                  {summary?.instagramReferrals ?? 0}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.08] bg-[#09070D] p-4">
                <div className="flex items-center justify-between text-xs text-[#A69EAC]">
                  <span>GitHub</span>
                  <Github className="h-4 w-4 text-[#F5F1F7]" />
                </div>
                <p className="mt-2 font-display text-2xl font-bold tabular-nums text-[#F5F1F7]">
                  {summary?.githubReferrals ?? 0}
                </p>
              </div>
            </div>

            {/* Traffic Sources & Devices */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-white/[0.08] bg-[#09070D] p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#F5F1F7]">
                  <BarChart3 className="h-4 w-4 text-[#FF557F]" />
                  <span>Traffic Sources</span>
                </div>
                <div className="mt-4 space-y-3">
                  {sourceEntries.map(([source, count]) => {
                    const widthPct = Math.round((count / maxSourceVal) * 100);
                    return (
                      <div key={source}>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#F5F1F7]">{source}</span>
                          <span className="font-mono tabular-nums text-[#A69EAC]">{count}</span>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#FF557F] to-[#9272FF]"
                            style={{ width: `${count === 0 ? 0 : Math.max(4, widthPct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.08] bg-[#09070D] p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#F5F1F7]">
                  <Monitor className="h-4 w-4 text-[#9272FF]" />
                  <span>Device Categories</span>
                </div>
                <div className="mt-4 space-y-3">
                  {deviceEntries.map(([device, count]) => {
                    const pct = summary && summary.totalPageViews > 0
                      ? Math.round((count / totalDevices) * 100)
                      : 0;
                    const Icon =
                      device === 'Mobile'
                        ? Smartphone
                        : device === 'Tablet'
                          ? Tablet
                          : Monitor;

                    return (
                      <div
                        key={device}
                        className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-[#100C16] px-3.5 py-2.5"
                      >
                        <div className="flex items-center gap-2.5 text-xs text-[#F5F1F7]">
                          <Icon className="h-4 w-4 text-[#9272FF]" />
                          <span>{device}</span>
                        </div>
                        <span className="font-mono text-xs tabular-nums text-[#A69EAC]">
                          {count} ({pct}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Daily History */}
            <div className="rounded-xl border border-white/[0.08] bg-[#09070D] p-5">
              <h3 className="text-sm font-semibold text-[#F5F1F7]">Recent Daily Activity</h3>
              {summary && summary.dailyHistory.length > 0 ? (
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/[0.08] text-[#A69EAC]">
                        <th className="py-2 font-medium">Date (UTC)</th>
                        <th className="py-2 font-medium">Visitors</th>
                        <th className="py-2 font-medium">Page Views</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.dailyHistory
                        .slice()
                        .reverse()
                        .slice(0, 7)
                        .map((row) => (
                          <tr key={row.date} className="border-b border-white/[0.05] text-[#F5F1F7]">
                            <td className="py-2 font-mono tabular-nums">{row.date}</td>
                            <td className="py-2 font-mono tabular-nums">{row.visitors}</td>
                            <td className="py-2 font-mono tabular-nums">{row.pageViews}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-2 text-xs text-[#A69EAC]">
                  No visits recorded yet. Real counts appear automatically as visitors load the site.
                </p>
              )}
            </div>

            <p className="text-[11px] leading-relaxed text-[#A69EAC]">
              Privacy guarantee: Only aggregated counts, coarse device categories, and domain-level
              referrer categories (such as Instagram or GitHub) are recorded. No IP addresses,
              Instagram usernames, or private visitor identities are ever extracted or stored.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
