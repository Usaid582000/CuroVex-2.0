'use client';

import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  FlaskConical,
  GitBranch,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AuthGate from '@/components/AuthGate';
import CandidatePathTemplate from '@/components/CandidatePathTemplate';
import GraphViewer from '@/components/GraphViewer';
import {
  explanationData,
  validationData,
} from '@/lib/data';
import {
  findCandidateForRoute,
  parseCandidateCsv,
  type CandidateRecord,
} from '@/lib/candidate-data';

function ExplanationContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [candidateRecords, setCandidateRecords] = useState<CandidateRecord[]>(
    [],
  );
  const [candidatesLoading, setCandidatesLoading] = useState(true);
  const [candidateLoadError, setCandidateLoadError] = useState('');
  const existingData = explanationData[id as keyof typeof explanationData];
  const seedCandidate = findCandidateForRoute(candidateRecords, id);
  const validation =
    validationData[id as keyof typeof validationData] ||
    validationData['drug_aspirin_MONDO:0004975'];
  const [mode, setMode] = useState<'path' | 'counterfactual'>('counterfactual');

  useEffect(() => {
    const controller = new AbortController();

    async function loadCandidateRecords() {
      try {
        const response = await fetch('/curovex_seed_candidates.csv', {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(
            `Candidate records could not be loaded (HTTP ${response.status}).`,
          );
        }

        setCandidateRecords(parseCandidateCsv(await response.text()));
      } catch (error) {
        if (controller.signal.aborted) return;
        setCandidateLoadError(
          error instanceof Error
            ? error.message
            : 'Candidate records could not be loaded.',
        );
      } finally {
        if (!controller.signal.aborted) setCandidatesLoading(false);
      }
    }

    void loadCandidateRecords();
    return () => controller.abort();
  }, []);

  if (!existingData && candidatesLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
      </main>
    );
  }

  if (!existingData && seedCandidate) {
    return <CandidatePathTemplate candidate={seedCandidate} />;
  }

  if (!existingData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="max-w-lg rounded-2xl border border-border bg-white p-7 shadow-soft">
          <AlertCircle className="h-7 w-7 text-accent" />
          <h1 className="mt-4 text-xl font-semibold text-ink">
            Candidate explanation not found
          </h1>
          <p className="mt-2 text-sm leading-6 text-secondary">
            {candidateLoadError ||
              'This route does not match a stored candidate or graph explanation.'}
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            Back to workspace
          </button>
        </div>
      </main>
    );
  }

  const data = existingData;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Explanation: {data.drugName} → {data.diseaseName}
            </h1>
            <div className="mt-1 flex items-center gap-2">
              <span className="rounded-full border border-accent/20 bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                Research dataset analysis
              </span>
              <span className="text-sm text-text-secondary">
                Original Score:{' '}
                <span className="font-semibold text-text-primary">
                  {data.originalScore.toFixed(2)}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-fit gap-2 rounded-lg bg-surface-secondary p-1">
          <button
            onClick={() => setMode('path')}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
              mode === 'path'
                ? 'bg-surface text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <GitBranch className="h-4 w-4" />
            Path-Based
          </button>
          <button
            onClick={() => setMode('counterfactual')}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
              mode === 'counterfactual'
                ? 'bg-surface text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Activity className="h-4 w-4" />
            Counterfactual
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <GraphViewer
              data={
                mode === 'path'
                  ? data.pathBased.graph
                  : data.counterfactual.graph
              }
              mode={mode}
            />

            <div className="rounded-card border border-border bg-surface p-5 shadow-card">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-text-primary">
                <FlaskConical className="h-4 w-4 text-accent" />
                Method Comparison
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border bg-surface-secondary p-4">
                  <p className="mb-1 text-xs uppercase tracking-wider text-text-secondary">
                    Path-Based
                  </p>
                  <p className="text-sm text-text-primary">
                    Identifies biologically plausible meta-paths. Does not prove
                    model reliance.
                  </p>
                  <div className="mt-3 text-sm">
                    <span className="text-text-secondary">Paths Found:</span>{' '}
                    <span className="font-medium text-text-primary">
                      {data.pathBased.paths.length}
                    </span>
                  </div>
                </div>
                <div className="rounded-lg border border-primary/20 bg-surface p-4 ring-1 ring-primary/10">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-primary">
                    Counterfactual (Novel)
                  </p>
                  <p className="text-sm text-text-primary">
                    Measures actual model reliance by masking edges and
                    observing score drop.
                  </p>
                  <div className="mt-3 flex gap-4 text-sm">
                    <div>
                      <span className="text-text-secondary">Fidelity:</span>{' '}
                      <span className="font-medium text-primary">
                        {(data.counterfactual.metrics.overallFidelity * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-text-secondary">Sparsity:</span>{' '}
                      <span className="font-medium text-primary">
                        {(data.counterfactual.metrics.sparsity * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {mode === 'counterfactual' && (
              <div className="rounded-card border border-border bg-surface p-5 shadow-card">
                <h3 className="mb-3 text-sm font-semibold text-text-primary">
                  Edge Impact Analysis
                </h3>
                <div className="space-y-3">
                  {data.counterfactual.edgeImpacts.map((edge: any) => (
                    <div
                      key={edge.edgeId}
                      className="rounded-lg border border-border bg-surface-secondary p-3"
                    >
                      <div className="mb-1 flex items-start justify-between">
                        <span className="text-sm font-medium text-text-primary">
                          {edge.source} → {edge.target}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            edge.impact === 'high'
                              ? 'bg-error/10 text-error'
                              : edge.impact === 'medium'
                                ? 'bg-warning/10 text-warning'
                                : 'bg-border text-text-secondary'
                          }`}
                        >
                          {edge.impact.toUpperCase()}
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-text-secondary">
                        <div>
                          Masked:{' '}
                          <span className="text-text-primary">
                            {edge.maskedScore.toFixed(2)}
                          </span>
                        </div>
                        <div>
                          Fidelity:{' '}
                          <span className="font-medium text-primary">
                            {(edge.fidelity * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mode === 'path' && (
              <div className="rounded-card border border-border bg-surface p-5 shadow-card">
                <h3 className="mb-3 text-sm font-semibold text-text-primary">
                  Identified Meta-Paths
                </h3>
                <div className="space-y-3">
                  {data.pathBased.paths.map((path: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-border bg-surface-secondary p-3"
                    >
                      <p className="mb-1 font-mono text-xs text-text-primary">
                        {path.pattern}
                      </p>
                      <p className="text-xs text-text-secondary">
                        Support count: {path.count}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-card border border-border bg-surface p-5 shadow-card">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-text-primary">
                <ExternalLink className="h-4 w-4 text-secondary" />
                External Validation
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase text-text-secondary">
                      ClinicalTrials.gov
                    </span>
                    <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">
                      {validation.clinicalTrials.count} found
                    </span>
                  </div>
                  {validation.clinicalTrials.trials.map((trial: any) => (
                    <a
                      key={trial.id}
                      href={trial.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mb-2 block rounded-lg border border-border bg-surface-secondary p-3 transition-colors hover:border-primary/30"
                    >
                      <p className="text-sm font-medium text-text-primary transition-colors group-hover:text-primary">
                        {trial.title}
                      </p>
                      <div className="mt-2 flex gap-2 text-xs text-text-secondary">
                        <span className="rounded border border-border bg-surface px-1.5 py-0.5">
                          {trial.id}
                        </span>
                        <span>{trial.phase}</span>
                        <span>•</span>
                        <span>{trial.status}</span>
                      </div>
                    </a>
                  ))}
                </div>

                <div className="border-t border-border pt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase text-text-secondary">
                      PubMed
                    </span>
                    <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">
                      {validation.pubmed.count} found
                    </span>
                  </div>
                  {validation.pubmed.articles.map((article: any) => (
                    <a
                      key={article.pmid}
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mb-2 block rounded-lg border border-border bg-surface-secondary p-3 transition-colors hover:border-primary/30"
                    >
                      <p className="text-sm font-medium text-text-primary transition-colors group-hover:text-primary">
                        {article.title}
                      </p>
                      <p className="mt-1 text-xs text-text-secondary">
                        {article.authors} • {article.date}
                      </p>
                      <p className="mt-1 text-xs text-primary">
                        PMID: {article.pmid}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex gap-2 rounded-lg border border-accent/20 bg-accent/5 p-3">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                <p className="text-xs text-text-secondary">
                  Presence of trials or literature does not guarantee clinical
                  efficacy. This is a computational hypothesis requiring
                  further validation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExplanationPage() {
  return (
    <AuthGate>
      <ExplanationContent />
    </AuthGate>
  );
}
