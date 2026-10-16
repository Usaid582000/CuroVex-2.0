'use client';

import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  GitBranch,
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import GraphViewer from '@/components/GraphViewer';
import type { CandidateRecord } from '@/lib/candidate-data';

type CounterfactualProfile = {
  fidelity: number;
  sparsity: number;
  edgeImpacts: [number, number, number];
};

const counterfactualProfiles: Record<string, CounterfactualProfile> = {
  'MONDO:0004975': {
    fidelity: 0.86,
    sparsity: 0.67,
    edgeImpacts: [0.82, 0.61, 0.43],
  },
  'MONDO:0005148': {
    fidelity: 0.81,
    sparsity: 0.72,
    edgeImpacts: [0.74, 0.58, 0.39],
  },
  'MONDO:0005339': {
    fidelity: 0.78,
    sparsity: 0.64,
    edgeImpacts: [0.68, 0.52, 0.44],
  },
  'MONDO:0005180': {
    fidelity: 0.89,
    sparsity: 0.69,
    edgeImpacts: [0.85, 0.63, 0.48],
  },
};

function createTemplateGraph(
  candidate: CandidateRecord,
  profile?: CounterfactualProfile,
) {
  return {
    nodes: [
      {
        data: {
          id: 'n1',
          label: candidate.drugName,
          type: 'drug',
        },
      },
      { data: { id: 'n2', label: 'PTGS2', type: 'protein' } },
      { data: { id: 'n3', label: 'APP', type: 'gene' } },
      {
        data: {
          id: 'n4',
          label: candidate.conditionName,
          type: 'disease',
        },
      },
    ],
    edges: [
      {
        data: {
          id: 'e1',
          source: 'n1',
          target: 'n2',
          label: 'TARGETS',
          template: true,
          fidelity: profile?.edgeImpacts[0],
        },
        classes: 'illustrative',
      },
      {
        data: {
          id: 'e2',
          source: 'n2',
          target: 'n3',
          label: 'INTERACT_WITH',
          template: true,
          fidelity: profile?.edgeImpacts[1],
        },
        classes: 'illustrative',
      },
      {
        data: {
          id: 'e3',
          source: 'n3',
          target: 'n4',
          label: 'ASSOCIATED_WITH',
          template: true,
          fidelity: profile?.edgeImpacts[2],
        },
        classes: 'illustrative',
      },
    ],
  };
}

export default function CandidatePathTemplate({
  candidate,
}: {
  candidate: CandidateRecord;
}) {
  const [mode, setMode] = useState<'path' | 'counterfactual'>('path');
  const counterfactualProfile =
    counterfactualProfiles[candidate.conditionId];
  const graph = createTemplateGraph(candidate, counterfactualProfile);

  return (
    <main className="min-h-screen bg-background p-6 text-ink sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-secondary transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to research workspace
        </Link>

        <header className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Candidate explanation
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {candidate.drugName}
              <span className="mx-2 text-secondary/50">→</span>
              {candidate.conditionName}
            </h1>
            <p className="mt-2 text-sm text-secondary">
              Rank #{candidate.rank} · {candidate.drugId} ·{' '}
              {candidate.conditionId}
            </p>
          </div>
          <div className="rounded-2xl border border-primary/10 bg-white px-5 py-3 text-right shadow-soft">
            <p className="text-2xl font-semibold text-primary">
              {(candidate.evidenceCoverageScore * 100).toFixed(1)}%
            </p>
            <p className="text-xs font-medium text-secondary">
              Evidence-coverage score
            </p>
          </div>
        </header>

        <div
          className="flex w-fit gap-2 rounded-lg bg-surface-secondary p-1"
          role="tablist"
          aria-label="Explanation method"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'path'}
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
            type="button"
            role="tab"
            aria-selected={mode === 'counterfactual'}
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

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.8fr)]">
          <section className="rounded-2xl border border-border/80 bg-white p-4 shadow-soft sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              {mode === 'path' ? (
                <GitBranch className="h-4 w-4 text-primary" />
              ) : (
                <Activity className="h-4 w-4 text-primary" />
              )}
              <h2 className="text-sm font-semibold">
                {mode === 'path'
                  ? 'Drug-to-condition path structure'
                  : 'Counterfactual analysis'}
              </h2>
            </div>
            <GraphViewer data={graph} mode={mode} />
            <p className="mt-3 text-xs text-secondary">
              Dashed edges identify the reused path template.
            </p>
          </section>

          <aside className="space-y-5">
            {mode === 'path' ? (
              <section className="rounded-2xl border border-border/80 bg-white p-5 shadow-soft">
                <h2 className="font-semibold">Identified meta-path</h2>
                <p className="mt-3 rounded-lg bg-surface-secondary p-3 font-mono text-xs leading-6 text-secondary">
                  Drug → TARGETS → Protein → INTERACT_WITH → Gene →
                  ASSOCIATED_WITH → Condition
                </p>
                <p className="mt-3 text-xs leading-5 text-secondary">
                  This view shows the requested path structure. Its reused
                  protein and gene relationships are illustrative, not
                  candidate-specific evidence.
                </p>
              </section>
            ) : (
              <section className="rounded-2xl border border-primary/15 bg-white p-5 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">Counterfactual metrics</h2>
                    <p className="mt-1 text-xs text-secondary">
                      {candidate.conditionName}
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    Illustrative
                  </span>
                </div>
                {counterfactualProfile ? (
                  <>
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      {[
                        ['Fidelity', counterfactualProfile.fidelity],
                        ['Sparsity', counterfactualProfile.sparsity],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-xl bg-surface-secondary p-3"
                        >
                          <p className="text-xs font-medium text-secondary">
                            {label}
                          </p>
                          <p className="mt-1 text-2xl font-semibold text-primary">
                            {(Number(value) * 100).toFixed(1)}%
                          </p>
                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-primary/10">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${Number(value) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 space-y-3">
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-secondary">
                        Edge impact
                      </h3>
                      {[
                        ['Drug → Protein', counterfactualProfile.edgeImpacts[0]],
                        ['Protein → Gene', counterfactualProfile.edgeImpacts[1]],
                        ['Gene → Condition', counterfactualProfile.edgeImpacts[2]],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <div className="mb-1 flex justify-between text-xs">
                            <span className="text-secondary">{label}</span>
                            <span className="font-medium text-ink">
                              {(Number(value) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-primary/10">
                            <div
                              className="h-full rounded-full bg-accent"
                              style={{ width: `${Number(value) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 border-t border-border pt-3 text-xs leading-5 text-secondary">
                      Illustrative values for visual context only; they are not
                      calculated from model scores or edge masking.
                    </p>
                  </>
                ) : (
                  <p className="mt-4 text-sm leading-6 text-secondary">
                    Counterfactual metrics are not available for this
                    condition.
                  </p>
                )}
              </section>
            )}

            <section className="rounded-2xl border border-border/80 bg-white p-5 shadow-soft">
              <h2 className="font-semibold">Candidate record</h2>
              <p className="mt-3 text-sm leading-6 text-secondary">
                {candidate.rationale}
              </p>
              <div className="mt-4 space-y-3 border-t border-border pt-4 text-xs">
                <div>
                  <p className="text-secondary">Clinical status</p>
                  <p className="mt-1 font-medium text-ink">
                    {candidate.clinicalStatus}
                  </p>
                </div>
                <div>
                  <p className="text-secondary">Score method</p>
                  <p className="mt-1 font-medium text-ink">
                    {candidate.scoreMethod}
                  </p>
                </div>
              </div>
              <a
                href={candidate.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                {candidate.sourceName}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              {candidate.sourceNote && (
                <p className="mt-3 text-xs leading-5 text-secondary">
                  {candidate.sourceNote}
                </p>
              )}
            </section>
          </aside>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="text-xs leading-5">
            The protein and gene nodes and the TARGETS → INTERACT_WITH →
            ASSOCIATED_WITH edges are reused from the Aspirin/Alzheimer
            visualization as a path template. The candidate CSV does not supply
            disease-specific target or gene evidence, so this graph does not
            assert that these particular biological relationships apply to
            {` ${candidate.drugName} `}or {candidate.conditionName}. Dashed
            edges are illustrative only. The score is an evidence-coverage
            rubric, not a model probability or clinical recommendation.
          </p>
        </div>
      </div>
    </main>
  );
}
