'use client';

import {
  ArrowLeft,
  Bell,
  Building2,
  Check,
  LogOut,
  Save,
  UserRound,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import AuthGate from '@/components/AuthGate';
import {
  defaultPreviewProfile,
  endPreviewSession,
  readPreviewProfile,
  savePreviewProfile,
  type PreviewProfile,
} from '@/lib/preview-account';

function SettingsWorkspace() {
  const router = useRouter();
  const [profile, setProfile] = useState<PreviewProfile>(defaultPreviewProfile);
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const current = readPreviewProfile();
      if (current) setProfile(current);
      setLoaded(true);
    }, 250);

    return () => window.clearTimeout(timer);
  }, []);

  function updateProfile<Key extends keyof PreviewProfile>(
    key: Key,
    value: PreviewProfile[Key],
  ) {
    setProfile((current) => ({ ...current, [key]: value }));
    setSaved(false);
    setError('');
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      savePreviewProfile(profile);
      setSaved(true);
      setError('');
    } catch {
      setError('Could not save settings to this browser. Check storage access.');
    }
  }

  function signOut() {
    endPreviewSession();
    router.replace('/login');
  }

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-ink">
      <header className="border-b border-border/80 bg-white/80 px-5 py-4 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image src="/icon.svg" alt="CuroVex logo" width={36} height={36} />
            <span className="font-semibold">CuroVex</span>
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-secondary transition hover:bg-red-50 hover:text-error"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
        <Link
          href="/dashboard"
          className="mb-7 inline-flex items-center gap-2 text-sm text-secondary transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to workspace
        </Link>

        <div className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            Workspace preferences
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Account settings
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-secondary">
            Customize the local research workspace profile and notification
            preferences for this browser.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <section className="rounded-2xl border border-border/80 bg-white p-5 shadow-soft sm:p-7">
            <div className="mb-6 flex items-center gap-3 border-b border-border/70 pb-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UserRound className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-semibold">Research profile</h2>
                <p className="mt-0.5 text-xs text-secondary">
                  Profile details shown in your workspace
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">
                  Display name
                </span>
                <input
                  required
                  value={profile.name}
                  onChange={(event) =>
                    updateProfile('name', event.target.value)
                  }
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">
                  Email address
                </span>
                <input
                  required
                  type="email"
                  value={profile.email}
                  onChange={(event) =>
                    updateProfile('email', event.target.value)
                  }
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">
                  Institution or organization
                </span>
                <span className="relative block">
                  <Building2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
                  <input
                    value={profile.institution}
                    onChange={(event) =>
                      updateProfile('institution', event.target.value)
                    }
                    placeholder="Research center, hospital, university"
                    className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </span>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">
                  Professional role
                </span>
                <select
                  value={profile.role}
                  onChange={(event) =>
                    updateProfile('role', event.target.value)
                  }
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                >
                  <option>Researcher</option>
                  <option>Clinician</option>
                  <option>Research administrator</option>
                  <option>Data scientist</option>
                  <option>Student or trainee</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium">
                  Research focus
                </span>
                <input
                  value={profile.researchFocus}
                  onChange={(event) =>
                    updateProfile('researchFocus', event.target.value)
                  }
                  placeholder="For example, neurodegeneration or rare disease"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-border/80 bg-white p-5 shadow-soft sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Bell className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-semibold">Notifications</h2>
                <p className="mt-0.5 text-xs text-secondary">
                  Choose whether to show workspace update indicators
                </p>
              </div>
            </div>
            <label className="flex cursor-pointer items-center justify-between gap-5 rounded-xl border border-border bg-background p-4">
              <span>
                <span className="block text-sm font-medium">
                  Research updates
                </span>
                <span className="mt-1 block text-xs text-secondary">
                  Display update indicators in the workspace preview.
                </span>
              </span>
              <input
                type="checkbox"
                checked={profile.notifications}
                onChange={(event) =>
                  updateProfile('notifications', event.target.checked)
                }
                className="h-4 w-4 accent-primary"
              />
            </label>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div aria-live="polite">
              {saved && (
                <p className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Check className="h-4 w-4" />
                  Settings saved in this browser.
                </p>
              )}
              {error && (
                <p role="alert" className="text-sm text-error">
                  {error}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-primary-dark"
            >
              <Save className="h-4 w-4" />
              Save settings
            </button>
          </div>
        </form>

        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-xs leading-5 text-amber-950">
          <p className="font-semibold">Local preview profile</p>
          <p className="mt-1">
            Profile details are saved in this browser only. This interface has
            no authentication service, institutional access controls, or
            protected health information safeguards. Do not store sensitive
            research or patient data here.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function SettingsPage() {
  return (
    <AuthGate>
      <SettingsWorkspace />
    </AuthGate>
  );
}
