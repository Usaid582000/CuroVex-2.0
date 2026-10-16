export type Disease = {
  id: string;
  name: string;
  category: string;
  symptoms: string[];
};

export const diseases: Disease[] = [
  {
    id: 'MONDO:0004975',
    name: "Alzheimer's Disease",
    category: 'Neurodegenerative',
    symptoms: [
      'memory loss',
      'confusion',
      'difficulty concentrating',
      'language difficulty',
    ],
  },
  {
    id: 'parkinsons-disease',
    name: "Parkinson's Disease",
    category: 'Neurodegenerative',
    symptoms: ['tremor', 'muscle stiffness', 'slow movement', 'balance problems'],
  },
  {
    id: 'multiple-sclerosis',
    name: 'Multiple Sclerosis',
    category: 'Neurological',
    symptoms: ['numbness', 'muscle weakness', 'vision problems', 'balance problems'],
  },
  {
    id: 'migraine',
    name: 'Migraine',
    category: 'Neurological',
    symptoms: ['headache', 'light sensitivity', 'nausea', 'visual aura'],
  },
  {
    id: 'asthma',
    name: 'Asthma',
    category: 'Respiratory',
    symptoms: ['shortness of breath', 'wheezing', 'chest tightness', 'cough'],
  },
  {
    id: 'type-2-diabetes',
    name: 'Type 2 Diabetes',
    category: 'Metabolic',
    symptoms: [
      'increased thirst',
      'frequent urination',
      'fatigue',
      'blurred vision',
    ],
  },
  {
    id: 'rheumatoid-arthritis',
    name: 'Rheumatoid Arthritis',
    category: 'Autoimmune',
    symptoms: ['joint pain', 'joint stiffness', 'joint swelling', 'fatigue'],
  },
  {
    id: 'endometriosis',
    name: 'Endometriosis',
    category: "Women's Health",
    symptoms: ['pelvic pain', 'painful periods', 'fatigue', 'pain during sex'],
  },
  {
    id: 'long-covid',
    name: 'Post-COVID Condition',
    category: 'Post-infectious',
    symptoms: [
      'fatigue',
      'shortness of breath',
      'brain fog',
      'loss of smell',
    ],
  },
];

export const predictions: Record<string, any[]> = {
  'MONDO:0004975': [
    {
      rank: 1,
      drugId: 'drug_donepezil',
      drugName: 'Donepezil',
      score: 0.92,
      description: "Approved treatment for Alzheimer's symptoms.",
      evidence: 'approved',
    },
    {
      rank: 3,
      drugId: 'drug_aspirin',
      drugName: 'Aspirin',
      score: 0.75,
      description: 'NSAID with potential neuroprotective effects.',
      evidence: 'repurposing',
    },
  ],
};

export const explanationData: Record<string, any> = {
  'drug_aspirin_MONDO:0004975': {
    drugName: 'Aspirin',
    diseaseName: "Alzheimer's Disease",
    originalScore: 0.75,
    pathBased: {
      paths: [
        {
          pattern:
            'Drug → TARGETS → Protein → INTERACTS_WITH → Protein → ASSOCIATED_WITH → Disease',
          count: 1,
        },
      ],
      graph: {
        nodes: [
          { data: { id: 'n1', label: 'Aspirin', type: 'drug' } },
          { data: { id: 'n2', label: 'PTGS2', type: 'protein' } },
          { data: { id: 'n3', label: 'APP', type: 'protein' } },
          {
            data: {
              id: 'n4',
              label: "Alzheimer's Disease",
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
            },
          },
          {
            data: {
              id: 'e2',
              source: 'n2',
              target: 'n3',
              label: 'INTERACTS_WITH',
            },
          },
          {
            data: {
              id: 'e3',
              source: 'n3',
              target: 'n4',
              label: 'ASSOCIATED_WITH',
            },
          },
        ],
      },
    },
    counterfactual: {
      metrics: { overallFidelity: 0.3, sparsity: 0.66, threshold: 0.05 },
      edgeImpacts: [
        {
          edgeId: 'e2',
          source: 'PTGS2',
          target: 'APP',
          originalScore: 0.75,
          maskedScore: 0.45,
          fidelity: 0.4,
          impact: 'high',
        },
        {
          edgeId: 'e1',
          source: 'Aspirin',
          target: 'PTGS2',
          originalScore: 0.75,
          maskedScore: 0.6,
          fidelity: 0.2,
          impact: 'medium',
        },
        {
          edgeId: 'e3',
          source: 'APP',
          target: "Alzheimer's Disease",
          originalScore: 0.75,
          maskedScore: 0.72,
          fidelity: 0.04,
          impact: 'low',
        },
      ],
      graph: {
        nodes: [
          { data: { id: 'n1', label: 'Aspirin', type: 'drug' } },
          { data: { id: 'n2', label: 'PTGS2', type: 'protein' } },
          { data: { id: 'n3', label: 'APP', type: 'protein' } },
          {
            data: {
              id: 'n4',
              label: "Alzheimer's Disease",
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
              fidelity: 0.2,
            },
          },
          {
            data: {
              id: 'e2',
              source: 'n2',
              target: 'n3',
              label: 'INTERACTS_WITH',
              fidelity: 0.4,
            },
          },
          {
            data: {
              id: 'e3',
              source: 'n3',
              target: 'n4',
              label: 'ASSOCIATED_WITH',
              fidelity: 0.04,
            },
          },
        ],
      },
    },
  },
};

export const validationData: Record<string, any> = {
  'drug_aspirin_MONDO:0004975': {
    clinicalTrials: {
      status: 'success',
      count: 1,
      trials: [
        {
          id: 'NCT04567890',
          title: "Aspirin for Cognitive Decline in Early Alzheimer's",
          status: 'Recruiting',
          phase: 'Phase 2',
          url: 'https://clinicaltrials.gov/ct2/show/NCT04567890',
        },
      ],
    },
    pubmed: {
      status: 'success',
      count: 1,
      articles: [
        {
          pmid: '12345678',
          title: 'Aspirin and amyloid pathology',
          authors: 'Smith J, et al.',
          date: '2023-05-12',
          url: 'https://pubmed.ncbi.nlm.nih.gov/12345678/',
        },
      ],
    },
  },
};
