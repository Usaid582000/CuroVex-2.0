'use client';

import { Activity, ArrowRight, Plus, Search, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState, type FormEvent, type KeyboardEvent } from 'react';
import {
  diseases,
  explanationData,
  predictions,
  type Disease,
} from '@/lib/data';

type SearchMode = 'disease' | 'symptoms';

function normalize(value: string) {
  return value.trim().toLocaleLowerCase();
}

export default function Dashboard() {
  const [searchMode, setSearchMode] = useState<SearchMode>('disease');
  const [query, setQuery] = useState('');
  const [symptomInput, setSymptomInput] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);

  const filteredDiseases = useMemo<
    { disease: Disease; matchingSymptoms: string[] }[]
  >(() => {
    if (searchMode === 'disease') {
      const search = normalize(query);
      return diseases
        .filter(
          (disease) =>
            disease.name.toLocaleLowerCase().includes(search) ||
            disease.id.toLocaleLowerCase().includes(search) ||
            disease.category.toLocaleLowerCase().includes(search),
        )
        .map((disease) => ({ disease, matchingSymptoms: [] }));
    }

    if (symptoms.length === 0) {
      return diseases.map((disease) => ({ disease, matchingSymptoms: [] }));
    }

    return diseases
      .map((disease) => ({
        disease,
        matchingSymptoms: disease.symptoms.filter((symptom) =>
          symptoms.some(
            (entered) =>
              normalize(symptom).includes(normalize(entered)) ||
              normalize(entered).includes(normalize(symptom)),
          ),
        ),
      }))
      .filter(({ matchingSymptoms }) => matchingSymptoms.length > 0)
      .sort(
        (first, second) =>
          second.matchingSymptoms.length - first.matchingSymptoms.length ||
          first.disease.name.localeCompare(second.disease.name),
      );
  }, [query, searchMode, symptoms]);

  const selectedCondition = diseases.find(
    (disease) => disease.id === selectedDisease,
  );
  const currentPredictions = selectedDisease
    ? predictions[selectedDisease] || []
    : [];

  function addSymptoms(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newSymptoms = symptomInput
      .split(',')
      .map((symptom) => symptom.trim())
      .filter(Boolean);

    setSymptoms((current) => {
      const known = new Set(current.map(normalize));
      return [
        ...current,
        ...newSymptoms.filter((symptom) => {
          const key = normalize(symptom);
          if (known.has(key)) return false;
          known.add(key);
          return true;
        }),
      ];
    });
    setSymptomInput('');
    setSelectedDisease(null);
  }

  function handleSymptomKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === ',') {
      event.preventDefault();
      const symptom = symptomInput.trim();
      if (symptom) {
        setSymptoms((current) =>
          current.some((item) => normalize(item) === normalize(symptom))
            ? current
            : [...current, symptom],
        );
        setSymptomInput('');
        setSelectedDisease(null);
      }
    }
  }

  function changeMode(mode: SearchMode) {
    setSearchMode(mode);
    setQuery('');
    setSymptoms([]);
    setSymptomInput('');
    setSelectedDisease(null);
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 flex-col border-r border-border bg-surface md:flex">
        <div className="border-b border-border p-6">
          <div className="flex items-center gap-3">
            <Image
              src="/icon.svg"
              alt="CuroVex logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-lg font-bold text-text-primary">CuroVex</span>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
          >
            <Activity className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/methodology"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary"
          >
            Methodology
          </Link>
        </nav>
        <div className="border-t border-border p-4">
          <div className="rounded-lg border border-border bg-surface-secondary p-3 text-xs text-text-secondary">
            <p className="mb-1 font-semibold text-text-primary">
              Research catalog
            </p>
            <p>{diseases.length} conditions with symptom associations.</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <div>
            <h1 className="mb-2 text-2xl font-bold text-text-primary">
              Explore conditions and treatments
            </h1>
            <p className="text-sm text-text-secondary">
              Search a known condition or compare symptoms with conditions in
              the research catalog. Similar symptoms can have different causes
              and are not a diagnosis.
            </p>
          </div>

          <div className="flex w-fit gap-2 rounded-lg bg-surface-secondary p-1">
            <button
              type="button"
              onClick={() => changeMode('disease')}
              aria-pressed={searchMode === 'disease'}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                searchMode === 'disease'
                  ? 'bg-surface text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Search conditions
            </button>
            <button
              type="button"
              onClick={() => changeMode('symptoms')}
              aria-pressed={searchMode === 'symptoms'}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                searchMode === 'symptoms'
                  ? 'bg-surface text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Explore by symptoms
            </button>
          </div>

          {searchMode === 'disease' ? (
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
              <input
                type="search"
                aria-label="Search conditions"
                placeholder="e.g., migraine or Alzheimer's Disease"
                className="w-full rounded-card border border-border bg-surface py-3 pl-12 pr-4 text-text-primary placeholder:text-text-secondary transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelectedDisease(null);
                }}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <form onSubmit={addSymptoms} className="flex gap-2">
                <div className="relative flex-1">
                  <Plus className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
                  <input
                    type="text"
                    aria-label="Add symptoms"
                    placeholder="Add a symptom, such as fatigue or joint pain"
                    className="w-full rounded-card border border-border bg-surface py-3 pl-12 pr-4 text-text-primary placeholder:text-text-secondary transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={symptomInput}
                    onChange={(event) => setSymptomInput(event.target.value)}
                    onKeyDown={handleSymptomKeyDown}
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-button bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
                >
                  Add
                </button>
              </form>
              <p className="text-xs text-text-secondary">
                Add one or more symptoms. Separate multiple symptoms with
                commas.
              </p>
              {symptoms.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {symptoms.map((symptom) => (
                    <span
                      key={normalize(symptom)}
                      className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-text-primary"
                    >
                      {symptom}
                      <button
                        type="button"
                        aria-label={`Remove ${symptom}`}
                        onClick={() => {
                          setSymptoms((current) =>
                            current.filter(
                              (item) => normalize(item) !== normalize(symptom),
                            ),
                          );
                          setSelectedDisease(null);
                        }}
                        className="rounded-full p-0.5 text-text-secondary hover:text-text-primary"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setSymptoms([]);
                      setSelectedDisease(null);
                    }}
                    className="px-2 text-sm text-text-secondary underline hover:text-text-primary"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          )}

          {!selectedDisease && (
            <section className="space-y-3">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
                  {searchMode === 'symptoms' && symptoms.length > 0
                    ? 'Conditions with matching symptoms'
                    : searchMode === 'symptoms'
                      ? 'Conditions in the catalog'
                      : 'Available conditions'}
                </h2>
                {searchMode === 'symptoms' && symptoms.length > 0 && (
                  <p className="mt-1 text-xs text-text-secondary">
                    Matches are ordered by the number of symptoms in common.
                  </p>
                )}
              </div>
              {filteredDiseases.length > 0 ? (
                filteredDiseases.map(({ disease, matchingSymptoms }) => (
                  <button
                    key={disease.id}
                    type="button"
                    onClick={() => setSelectedDisease(disease.id)}
                    className="group flex w-full items-center justify-between rounded-card border border-border bg-surface p-4 text-left transition-all hover:border-primary/30 hover:shadow-card-hover"
                  >
                    <div>
                      <p className="font-semibold text-text-primary transition-colors group-hover:text-primary">
                        {disease.name}
                      </p>
                      <p className="mt-1 text-xs text-text-secondary">
                        {disease.category}
                      </p>
                      {matchingSymptoms.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {matchingSymptoms.map((symptom) => (
                            <span
                              key={symptom}
                              className="rounded-full bg-primary/5 px-2 py-0.5 text-xs text-primary"
                            >
                              {symptom}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <ArrowRight className="h-5 w-5 text-text-secondary transition-colors group-hover:text-primary" />
                  </button>
                ))
              ) : (
                <p className="rounded-card border border-border bg-surface p-5 text-sm text-text-secondary">
                  No catalog conditions match these symptoms yet. Try another
                  symptom or review the full condition list.
                </p>
              )}
            </section>
          )}

          {selectedDisease && selectedCondition && (
            <section className="space-y-4">
              <button
                type="button"
                onClick={() => setSelectedDisease(null)}
                className="flex items-center gap-1 text-sm text-text-secondary hover:text-primary"
              >
                ← Back to {searchMode === 'symptoms' ? 'matches' : 'conditions'}
              </button>
              <div>
                <h2 className="text-xl font-bold text-text-primary">
                  {selectedCondition.name}
                </h2>
                <p className="mt-1 text-sm text-text-secondary">
                  {selectedCondition.category}
                </p>
              </div>

              {currentPredictions.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
                    Ranked treatment candidates
                  </h3>
                  {currentPredictions.map((candidate: any) => {
                    const explanationId = `${candidate.drugId}_${selectedDisease}`;
                    const hasExplanation =
                      explanationId in explanationData;
                    const content = (
                      <>
                        <div className="mb-2 flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-secondary text-sm font-bold text-text-primary">
                              #{candidate.rank}
                            </span>
                            <div>
                              <h4 className="font-semibold text-text-primary">
                                {candidate.drugName}
                              </h4>
                              <p className="text-sm text-text-secondary">
                                {candidate.description}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="block text-2xl font-bold text-primary">
                              {candidate.score.toFixed(2)}
                            </span>
                            <span className="text-xs text-text-secondary">
                              Prediction score
                            </span>
                            <span
                              className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                                candidate.evidence === 'approved'
                                  ? 'bg-success/10 text-success'
                                  : 'bg-accent/10 text-accent'
                              }`}
                            >
                              {candidate.evidence === 'approved'
                                ? 'Approved treatment'
                                : 'Research candidate'}
                            </span>
                          </div>
                        </div>
                        {!hasExplanation && (
                          <p className="ml-11 text-xs text-text-secondary">
                            A detailed graph explanation is not available for
                            this candidate.
                          </p>
                        )}
                      </>
                    );

                    return hasExplanation ? (
                      <Link
                        key={candidate.drugId}
                        href={`/explanation/${explanationId}`}
                        className="block rounded-card border border-border bg-surface p-5 transition-all hover:border-primary/30 hover:shadow-card-hover"
                      >
                        {content}
                      </Link>
                    ) : (
                      <div
                        key={candidate.drugId}
                        className="rounded-card border border-border bg-surface p-5"
                      >
                        {content}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-card border border-border bg-surface p-5">
                  <h3 className="font-semibold text-text-primary">
                    No ranked candidates available
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary">
                    This condition is indexed by symptoms, but the research
                    catalog does not yet contain ranked drug candidates for it.
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
