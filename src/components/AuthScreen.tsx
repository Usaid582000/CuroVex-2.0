'use client';

import {
  ArrowRight,
  Activity,
  Building2,
  LockKeyhole,
  Mail,
  Microscope,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import {
  defaultPreviewProfile,
  readPreviewProfile,
  savePreviewProfile,
} from '@/lib/preview-account';

export default function AuthScreen({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter();
  const isSignup = mode === 'signup';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [role, setRole] = useState('Researcher');

  useEffect(() => {
    if (!loading) return;

    const timer = window.setTimeout(() => {
      try {
        const previous = readPreviewProfile();
        const profile = {
          ...(previous?.email.toLowerCase() === email.toLowerCase()
            ? previous
            : defaultPreviewProfile),
          name:
            name.trim() ||
            previous?.name ||
            email.split('@')[0].replace(/[._-]/g, ' '),
          email: email.trim(),
          institution: institution.trim() || previous?.institution || '',
          role: isSignup ? role : previous?.role || 'Researcher',
        };

        savePreviewProfile(profile);
        router.replace('/dashboard');
      } catch {
        setError(
          'The browser could not save this local preview profile. Check browser storage settings and try again.',
        );
        setLoading(false);
      }
    }, 900);

    return () => window.clearTimeout(timer);
  }, [email, institution, isSignup, loading, name, role, router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
  }

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-ink px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_18%,rgba(73,147,119,0.32),transparent_42%),radial-gradient(ellipse_at_88%_84%,rgba(193,153,99,0.18),transparent_40%)]" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:64px_64px]" />
        <Link href="/" className="relative z-10 flex w-fit items-center gap-3">
          <Image src="/icon.svg" alt="CuroVex logo" width={40} height={40} />
          <span className="text-lg font-semibold tracking-tight">CuroVex</span>
        </Link>

        <div className="relative z-10 max-w-xl animate-rise">
          <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-sage">
            <Microscope className="h-6 w-6" />
          </div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-sage">
            Collaborative biomedical research
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            Turn complex biology into clearer research questions.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-white/65">
            Explore condition relationships, inspect candidate evidence, and
            organize your research workspace in one considered environment.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-xs text-white/50">
          <ShieldCheck className="h-4 w-4 text-sage" />
          Preview interface only. Do not enter real credentials or patient data.
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md animate-rise">
          <Link href="/" className="mb-10 flex items-center gap-3 lg:hidden">
            <Image src="/icon.svg" alt="CuroVex logo" width={36} height={36} />
            <span className="text-lg font-semibold text-ink">CuroVex</span>
          </Link>

          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Research workspace
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-ink">
              {isSignup ? 'Create your workspace' : 'Welcome back'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-secondary">
              {isSignup
                ? 'Set up a local profile to personalize this interface.'
                : 'Sign in to continue to your research workspace.'}
            </p>
          </div>

          <div className="mb-6 flex gap-1 rounded-xl border border-border bg-white p-1">
            <Link
              href="/login"
              className={`flex-1 rounded-lg px-4 py-2.5 text-center text-sm font-medium transition-colors ${
                !isSignup
                  ? 'bg-ink text-white shadow-sm'
                  : 'text-secondary hover:text-ink'
              }`}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className={`flex-1 rounded-lg px-4 py-2.5 text-center text-sm font-medium transition-colors ${
                isSignup
                  ? 'bg-ink text-white shadow-sm'
                  : 'text-secondary hover:text-ink'
              }`}
            >
              Create account
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink">
                    Full name
                  </span>
                  <span className="relative block">
                    <UserRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
                    <input
                      required
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-xl border border-border bg-white py-3 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                  </span>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink">
                    Institution or organization
                  </span>
                  <span className="relative block">
                    <Building2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
                    <input
                      value={institution}
                      onChange={(event) => setInstitution(event.target.value)}
                      placeholder="Research center, hospital, university"
                      className="w-full rounded-xl border border-border bg-white py-3 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                  </span>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink">
                    Professional role
                  </span>
                  <select
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                    className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                  >
                    <option>Researcher</option>
                    <option>Clinician</option>
                    <option>Research administrator</option>
                    <option>Data scientist</option>
                    <option>Student or trainee</option>
                    <option>Other</option>
                  </select>
                </label>
              </>
            )}

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink">
                Institutional email
              </span>
              <span className="relative block">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@institution.org"
                  className="w-full rounded-xl border border-border bg-white py-3 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink">
                Password
              </span>
              <span className="relative block">
                <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
                <input
                  required
                  type="password"
                  minLength={8}
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-border bg-white py-3 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </span>
            </label>

            {error && (
              <p role="alert" className="text-sm text-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:bg-primary-dark disabled:cursor-wait disabled:opacity-80"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Preparing workspace
                </>
              ) : (
                <>
                  {isSignup ? 'Create local profile' : 'Continue to workspace'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-950">
            <p className="font-semibold">Interface preview only</p>
            <p className="mt-1">
              This project has no authentication server. Passwords are not
              saved or verified; only a local profile is stored in this
              browser. Do not enter real credentials, protected health
              information, or confidential research data.
            </p>
          </div>

          <Link
            href="/"
            className="mt-6 block text-center text-sm text-secondary transition hover:text-primary"
          >
            Return to CuroVex
          </Link>
        </div>
      </section>
    </main>
  );
}
