export type CandidateRecord = {
  conditionName: string;
  conditionId: string;
  drugName: string;
  drugId: string;
  rank: number;
  evidenceCoverageScore: number;
  scoreMethod: string;
  evidenceType: string;
  clinicalStatus: string;
  rationale: string;
  sourceName: string;
  sourceUrl: string;
  sourceNote: string;
};

const columns = [
  'condition_name',
  'condition_id',
  'drug_name',
  'drug_id',
  'rank',
  'demo_evidence_score',
  'score_method',
  'evidence_type',
  'clinical_status',
  'candidate_rationale',
  'evidence_source_name',
  'evidence_source_url',
  'source_note',
] as const;

function parseRows(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];

    if (quoted) {
      if (character === '"' && input[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"' && field.length === 0) {
      quoted = true;
    } else if (character === ',') {
      row.push(field);
      field = '';
    } else if (character === '\n' || character === '\r') {
      row.push(field);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      field = '';
      if (character === '\r' && input[index + 1] === '\n') index += 1;
    } else {
      field += character;
    }
  }

  if (quoted) throw new Error('Candidate CSV contains an unclosed quoted field.');
  row.push(field);
  if (row.some((value) => value.trim())) rows.push(row);
  return rows;
}

export function parseCandidateCsv(input: string): CandidateRecord[] {
  const rows = parseRows(input);
  const headers = rows.shift()?.map((header) => header.trim());
  if (!headers) throw new Error('Candidate CSV is missing its header row.');

  const missingColumns = columns.filter((column) => !headers.includes(column));
  if (missingColumns.length) {
    throw new Error(
      `Candidate CSV is missing required columns: ${missingColumns.join(', ')}.`,
    );
  }

  const indexes = new Map(
    headers.map((header, index) => [header, index] as const),
  );
  const read = (values: string[], column: (typeof columns)[number]) =>
    values[indexes.get(column)!]?.trim() ?? '';

  return rows.map((values, index) => {
    const rowNumber = index + 2;
    if (values.length !== headers.length) {
      throw new Error(
        `Candidate CSV row ${rowNumber} has ${values.length} fields; expected ${headers.length}.`,
      );
    }

    const rank = Number(read(values, 'rank'));
    const evidenceCoverageScore = Number(
      read(values, 'demo_evidence_score'),
    );
    const sourceUrl = read(values, 'evidence_source_url');
    const missingValue = columns
      .filter((column) => column !== 'source_note')
      .find((column) => !read(values, column));

    if (missingValue) {
      throw new Error(
        `Candidate CSV row ${rowNumber} is missing ${missingValue}.`,
      );
    }
    if (!Number.isInteger(rank) || rank < 1) {
      throw new Error(`Candidate CSV row ${rowNumber} has an invalid rank.`);
    }
    if (
      !Number.isFinite(evidenceCoverageScore) ||
      evidenceCoverageScore < 0 ||
      evidenceCoverageScore > 1
    ) {
      throw new Error(
        `Candidate CSV row ${rowNumber} has an invalid evidence-coverage score.`,
      );
    }
    if (!/^https:\/\//i.test(sourceUrl)) {
      throw new Error(
        `Candidate CSV row ${rowNumber} must include an HTTPS evidence URL.`,
      );
    }

    return {
      conditionName: read(values, 'condition_name'),
      conditionId: read(values, 'condition_id'),
      drugName: read(values, 'drug_name'),
      drugId: read(values, 'drug_id'),
      rank,
      evidenceCoverageScore,
      scoreMethod: read(values, 'score_method').replace(/^demo\s+/i, ''),
      evidenceType: read(values, 'evidence_type'),
      clinicalStatus: read(values, 'clinical_status'),
      rationale: read(values, 'candidate_rationale'),
      sourceName: read(values, 'evidence_source_name'),
      sourceUrl,
      sourceNote: read(values, 'source_note'),
    };
  });
}

export function findCandidateForRoute(
  candidates: CandidateRecord[],
  routeId: string,
): CandidateRecord | undefined {
  const normalizedRoute = decodeURIComponent(routeId).toLocaleLowerCase();

  return candidates.find((candidate) => {
    const conditionSuffix = `_${candidate.conditionId}`.toLocaleLowerCase();
    if (!normalizedRoute.endsWith(conditionSuffix)) return false;

    const routeDrugId = normalizedRoute.slice(0, -conditionSuffix.length);
    const normalizedDrugId = candidate.drugId.toLocaleLowerCase();
    const legacyDrugId = `drug_${candidate.drugName
      .toLocaleLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')}`;

    return routeDrugId === normalizedDrugId || routeDrugId === legacyDrugId;
  });
}
