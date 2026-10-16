import {
  ArrowRight,
  Activity,
  Brain,
  Dna,
  GitBranch,
  ShieldCheck,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    icon: Brain,
    index: '01',
    title: 'Interpretable discovery',
    description:
      'Explore candidate relationships through connected biological entities and evidence pathways.',
  },
  {
    icon: GitBranch,
    index: '02',
    title: 'Counterfactual analysis',
    description:
      'Examine how altering graph relationships changes model scores and interpretation.',
  },
  {
    icon: ShieldCheck,
    index: '03',
    title: 'Evidence-aware research',
    description:
      'Keep computational hypotheses distinct from clinical evidence and treatment recommendations.',
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-ink">
      <nav className="relative z-20 border-b border-border/70 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/icon.svg" alt="CuroVex logo" width={40} height={40} />
            <span className="text-lg font-semibold tracking-tight">CuroVex</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-medium text-secondary transition hover:text-primary sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-primary-dark"
            >
              Create workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative">
        <div className="pointer-events-none absolute -right-48 -top-36 h-[620px] w-[620px] rounded-full border border-primary/[0.08]" />
        <div className="pointer-events-none absolute -right-12 top-[-30px] h-[350px] w-[350px] rounded-full border border-primary/[0.09]" />
        <div className="pointer-events-none absolute right-[12%] top-24 h-56 w-56 rounded-full bg-sage/30 blur-[90px]" />
        <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="relative z-10 animate-rise">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-3.5 py-2 text-xs font-semibold text-primary shadow-soft">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              Biomedical research intelligence
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.08] tracking-[-0.045em] text-ink sm:text-6xl xl:text-[68px]">
              A clearer view of{' '}
              <span className="text-primary">therapeutic discovery.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-secondary sm:text-lg sm:leading-8">
              Investigate drug-disease relationships through explainable
              machine learning, biological networks, and connected evidence.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-primary-dark"
              >
                Enter research workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="rounded-xl border border-border bg-white/70 px-5 py-3.5 text-sm font-semibold text-ink transition hover:border-primary/30 hover:text-primary"
              >
                Sign in
              </Link>
            </div>
            <p className="mt-5 max-w-lg text-xs leading-5 text-secondary">
              Research interface preview. Not for clinical decisions or
              protected health information.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[490px] animate-rise [animation-delay:120ms]">
            <div className="absolute -inset-7 rounded-[40px] bg-gradient-to-br from-sage/25 via-transparent to-accent/10 blur-2xl" />
            <div className="relative rounded-[30px] border border-white/80 bg-white/75 p-4 shadow-premium backdrop-blur-xl sm:p-6">
              <div className="rounded-[22px] bg-ink p-6 text-white sm:p-7">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sage">
                      Network overview
                    </p>
                    <h2 className="mt-2 text-xl font-semibold">
                      Connected evidence
                    </h2>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-sage">
                    <Dna className="h-5 w-5" />
                  </span>
                </div>

                <div className="relative my-8 flex h-[240px] items-center justify-center">
                  <div className="absolute h-[210px] w-[210px] animate-[spin_40s_linear_infinite] rounded-full border border-dashed border-white/15" />
                  <div className="absolute h-[150px] w-[150px] rounded-full border border-white/10" />
                  <div className="absolute h-[90px] w-[90px] rounded-full bg-primary/30 blur-xl" />
                  <div className="absolute left-[14%] top-[22%] h-3 w-3 animate-pulse rounded-full bg-sage shadow-[0_0_22px_rgba(169,199,176,0.9)]" />
                  <div className="absolute right-[18%] top-[30%] h-2.5 w-2.5 animate-pulse rounded-full bg-accent shadow-[0_0_20px_rgba(177,123,63,0.9)] [animation-delay:600ms]" />
                  <div className="absolute bottom-[18%] left-[30%] h-2.5 w-2.5 animate-pulse rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.8)] [animation-delay:900ms]" />
                  <div className="absolute left-[22%] top-[32%] h-px w-[190px] rotate-[24deg] bg-gradient-to-r from-sage/60 via-white/30 to-transparent" />
                  <div className="absolute left-[30%] top-[56%] h-px w-[160px] -rotate-[32deg] bg-gradient-to-r from-white/20 via-accent/50 to-transparent" />
                  <div className="relative z-10 flex h-[82px] w-[82px] animate-float items-center justify-center rounded-[25px] border border-sage/30 bg-primary shadow-[0_12px_40px_rgba(23,107,87,0.35)]">
                    <Activity className="h-8 w-8 text-white" />
                  </div>
                  <span className="absolute left-[3%] top-[16%] rounded-lg border border-white/10 bg-white/[0.07] px-2.5 py-1.5 text-[10px] text-white/75">
                    Disease
                  </span>
                  <span className="absolute right-[2%] top-[26%] rounded-lg border border-white/10 bg-white/[0.07] px-2.5 py-1.5 text-[10px] text-white/75">
                    Compound
                  </span>
                  <span className="absolute bottom-[11%] left-[21%] rounded-lg border border-white/10 bg-white/[0.07] px-2.5 py-1.5 text-[10px] text-white/75">
                    Protein target
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
                  {[
                    ['Network', 'Biological'],
                    ['Analysis', 'Explainable'],
                    ['Evidence', 'Traceable'],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-[9px] uppercase tracking-[0.14em] text-white/40">
                        {label}
                      </p>
                      <p className="mt-1 text-[11px] font-medium text-white/85">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/70 bg-white/65">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-7 md:grid-cols-4">
          {[
            ['Graph methods', 'Network science'],
            ['Interpretability', 'Counterfactual'],
            ['Evidence context', 'Literature + trials'],
            ['Primary audience', 'Research teams'],
          ].map(([label, value]) => (
            <div key={label} className="border-l-2 border-primary/20 pl-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-secondary">
                {label}
              </p>
              <p className="mt-1.5 text-sm font-semibold text-ink">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
              Research capabilities
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Tools for questions that cross disciplines.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-secondary">
            Designed to help research teams inspect computational connections
            while keeping evidence and limitations in view.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, index, title, description }, position) => (
            <article
              key={title}
              className="group animate-rise rounded-2xl border border-border/80 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-premium"
              style={{ animationDelay: `${position * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-xs text-secondary/60">
                  {index}
                </span>
              </div>
              <h3 className="mt-7 text-lg font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-secondary">
                {description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-2xl border border-primary/10 bg-primary/[0.045] p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="text-lg font-semibold text-ink">
              Explore the research environment
            </p>
            <p className="mt-1 text-sm text-secondary">
              Create a local preview profile to continue.
            </p>
          </div>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary"
          >
            Create workspace
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/70 bg-white/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-xs text-secondary sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Image src="/icon.svg" alt="" width={22} height={22} />
            <span className="font-semibold text-ink">CuroVex</span>
            <span>Research interface preview</span>
          </div>
          <p>Not for diagnosis or clinical treatment decisions.</p>
        </div>
      </footer>
    </main>
  );
}
