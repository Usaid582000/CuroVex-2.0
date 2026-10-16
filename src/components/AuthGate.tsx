'use client';

import { Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { hasPreviewSession } from '@/lib/preview-account';

export default function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!hasPreviewSession()) {
        router.replace('/login');
        return;
      }

      setReady(true);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [router]);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-glow">
            <Activity className="h-6 w-6" />
            <span className="absolute inset-0 animate-ping rounded-2xl border border-primary/30" />
          </div>
          <p className="text-sm font-medium text-secondary">
            Preparing your research workspace
          </p>
        </div>
      </main>
    );
  }

  return children;
}
