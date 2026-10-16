'use client';

import {
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  GitBranch,
} from 'lucide-react';
import Link from 'next/link';
import GraphViewer from '@/components/GraphViewer';
import type { CandidateRecord } from '@/lib/candidate-data';

function createTemplateGraph(candidate: CandidateRecord) {
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
  const graph = createTemplateGraph(candidate);

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
              Candidate path
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
              {candidate.evidenceCoverageScore.toFixed(2)}
            </p>
            <p className="text-xs font-medium text-secondary">
              Evidence-coverage score
            </p>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.8fr)]">
          <section className="rounded-2xl border border-border/80 bg-white p-4 shadow-soft sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold">
                Drug-to-condition path structure
              </h2>
            </div>
            <GraphViewer data={graph} mode="path" />
            <p className="mt-3 text-xs text-secondary">
              Dashed edges identify the reused path template.
            </p>
          </section>

          <aside className="space-y-5">
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
