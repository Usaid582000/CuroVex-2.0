import {
  Activity,
  ArrowRight,
  Brain,
  GitBranch,
  ShieldCheck,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    icon: Brain,
    title: 'Graph-based research',
    description:
      'Explore relationships among drugs, diseases, proteins, and other biological entities.',
  },
  {
    icon: GitBranch,
    title: 'Counterfactual reasoning',
    description:
      'Inspect how masking graph edges changes a candidate score and which relationships contribute to it.',
  },
  {
    icon: ShieldCheck,
    title: 'External evidence',
    description:
      'Review links to clinical-trial records and biomedical literature alongside computational results.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Image
              src="/icon.svg"
              alt="CuroVex logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-xl font-bold text-text-primary">CuroVex</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/methodology"
              className="text-sm font-medium text-text-secondary transition-colors hover:text-primary"
            >
              Methodology
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-button bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              Explore conditions
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            <Activity className="h-3 w-3" />
            Drug discovery research
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight text-text-primary">
            Explainable AI for{' '}
            <span className="text-primary">Drug Discovery</span>
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-text-secondary">
            Explore how shared symptoms and biological relationships can help
            researchers investigate new therapeutic hypotheses.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-button bg-primary px-6 py-3 font-medium text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark"
          >
            Explore conditions and symptoms
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-card border border-border bg-surface p-6 shadow-card transition-all hover:shadow-card-hover"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h2 className="mb-2 font-semibold text-text-primary">{title}</h2>
              <p className="text-sm text-text-secondary">{description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
