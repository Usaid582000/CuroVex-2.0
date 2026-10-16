'use client';

import React, { useMemo, useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import type cytoscape from 'cytoscape';

type GraphMode = 'path' | 'counterfactual';

type SelectedElement = {
  kind: 'Node' | 'Edge';
  label: string;
  fidelity?: number;
};

const layout = {
  name: 'cose',
  animate: false,
  padding: 40,
  nodeRepulsion: 8000,
  idealEdgeLength: 120,
  componentSpacing: 100,
};

const getNodeColor = (type: string) =>
  type === 'drug' ? '#0F766E' : type === 'disease' ? '#5276A7' : '#8B7CC8';

const getEdgeColor = (fidelity?: number, mode?: GraphMode) => {
  if (mode === 'counterfactual' && fidelity !== undefined) {
    if (fidelity >= 0.3) return '#B54747';
    if (fidelity >= 0.1) return '#A66A20';
    return '#D8E0E8';
  }

  return '#64748B';
};

export default function GraphViewer({
  data,
  mode,
}: {
  data: any;
  mode: GraphMode;
}) {
  const [selected, setSelected] = useState<SelectedElement | null>(null);
  const hasCounterfactualEdges = data.edges?.some((edge: any) =>
    Number.isFinite(edge.data?.fidelity),
  );
  const elements = useMemo(
    () => CytoscapeComponent.normalizeElements(data),
    [data],
  );
  const stylesheet = useMemo<cytoscape.StylesheetJsonBlock[]>(
    () => [
      {
        selector: 'node',
        style: {
          'background-color': (ele: any) => getNodeColor(ele.data('type')),
          label: 'data(label)',
          color: '#FFFFFF',
          'text-valign': 'center',
          'text-halign': 'center',
          'font-size': '12px',
          'text-wrap': 'wrap',
          'text-max-width': '110px',
          width: 'label',
          height: 'label',
          padding: '12px',
          shape: 'round-rectangle',
          'border-width': 2,
          'border-color': '#FFFFFF',
        },
      },
      {
        selector: 'node:selected',
        style: {
          'border-width': 4,
          'border-color': '#0F766E',
        },
      },
      {
        selector: 'edge',
        style: {
          width: (ele: any) => {
            const fidelity = ele.data('fidelity');
            return mode === 'counterfactual' &&
              typeof fidelity === 'number' &&
              Number.isFinite(fidelity)
              ? Math.max(2, fidelity * 10)
              : 2;
          },
          'line-color': (ele: any) =>
            getEdgeColor(ele.data('fidelity'), mode),
          'target-arrow-color': (ele: any) =>
            getEdgeColor(ele.data('fidelity'), mode),
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
          label: 'data(label)',
          'font-size': '10px',
          color: '#243247',
          'text-rotation': 'autorotate',
          'text-margin-y': -8,
          'text-wrap': 'wrap',
          'text-max-width': '90px',
          'text-background-color': '#FFFFFF',
          'text-background-opacity': 0.9,
          'text-background-padding': '2px',
        },
      },
      {
        selector: 'edge.illustrative',
        style: {
          'line-style': 'dashed',
          'line-color': '#A66A20',
          'target-arrow-color': '#A66A20',
        },
      },
    ],
    [mode],
  );

  return (
    <div className="relative h-[450px] w-full rounded-card border border-border bg-surface shadow-card">
      <CytoscapeComponent
        elements={elements}
        stylesheet={stylesheet}
        layout={layout}
        style={{ width: '100%', height: '100%' }}
        cy={(cy: any) => {
          if (cy.scratch('_graphViewerHandlersBound')) return;

          cy.scratch('_graphViewerHandlersBound', true);
          cy.on('tap', 'node, edge', (evt: any) => {
            const target = evt.target;
            setSelected({
              kind: target.isNode() ? 'Node' : 'Edge',
              label: target.data('label'),
              fidelity: target.data('fidelity'),
            });
          });
          cy.on('tap', (evt: any) => {
            if (evt.target === cy) setSelected(null);
          });
        }}
      />

      <div className="absolute left-4 top-4 rounded-lg border border-border bg-surface/90 p-3 text-xs shadow-sm backdrop-blur-sm">
        <h4 className="mb-2 font-semibold text-text-primary">Legend</h4>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#0F766E]" />
            <span className="text-text-secondary">Drug</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#5276A7]" />
            <span className="text-text-secondary">Disease</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#8B7CC8]" />
            <span className="text-text-secondary">Protein / Gene</span>
          </div>
          {mode === 'counterfactual' && hasCounterfactualEdges && (
            <>
              <div className="my-1 border-t border-border" />
              <div className="flex items-center gap-2">
                <div className="h-1 w-3 bg-[#B54747]" />
                <span className="text-text-secondary">High Impact</span>
              </div>
            </>
          )}
        </div>
      </div>

      {selected && (
        <div className="absolute bottom-4 right-4 max-w-xs rounded-lg border border-border bg-surface/95 p-4 shadow-card-hover backdrop-blur-sm">
          <h4 className="mb-1 text-sm font-semibold text-text-primary">
            {selected.kind}
          </h4>
          <p className="text-sm font-medium text-text-primary">
            {selected.label}
          </p>
          {selected.kind === 'Edge' &&
            mode === 'counterfactual' &&
            selected.fidelity !== undefined && (
              <p className="mt-1 text-xs font-medium text-[#0F766E]">
                Fidelity: {(selected.fidelity * 100).toFixed(1)}%
              </p>
            )}
        </div>
      )}
    </div>
  );
}
