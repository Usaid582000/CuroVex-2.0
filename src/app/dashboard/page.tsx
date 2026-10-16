'use client';

import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  Bell,
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  Dna,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import AuthGate from '@/components/AuthGate';
import {
  endPreviewSession,
  readPreviewProfile,
  type PreviewProfile,
} from '@/lib/preview-account';
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

function DashboardWorkspace() {
  const router = useRouter();
  const [searchMode, setSearchMode] = useState<SearchMode>('disease');
  const [query, setQuery] = useState('');
  const [symptomInput, setSymptomInput] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);
  const [loadingResults, setLoadingResults] = useState(true);
  const [profile, setProfile] = useState<PreviewProfile | null>(null);

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

  useEffect(() => {
    setLoadingResults(true);
    const timer = window.setTimeout(() => setLoadingResults(false), 550);
    return () => window.clearTimeout(timer);
  }, [query, searchMode, symptoms]);

  useEffect(() => {
    const timer = window.setTimeout(() => setProfile(readPreviewProfile()), 250);
    return () => window.clearTimeout(timer);
  }, []);

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
    setLoadingResults(true);
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
    setLoadingResults(true);
  }

  function signOut() {
    endPreviewSession();
    router.replace('/login');
  }

  const initials = (profile?.name || 'Researcher')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  const greetingName =
    (profile?.name || 'Researcher').replace(
      /^(dr\.?|professor|prof\.?|mr\.?|ms\.?|mrs\.?)\s+/i,
      '',
    ).split(/\s+/)[0] || 'Researcher';

  return (
    <div className="min-h-screen bg-background text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[250px] flex-col border-r border-border/80 bg-white/90 px-4 py-5 backdrop-blur-xl lg:flex">
        <Link href="/" className="mb-9 flex items-center gap-3 px-2">
          <Image src="/icon.svg" alt="CuroVex logo" width={38} height={38} />
          <span className="text-lg font-semibold tracking-tight">CuroVex</span>
        </Link>

        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary/70">
          Workspace
        </p>
        <nav className="space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary"
          >
            <LayoutDashboard className="h-[18px] w-[18px]" />
            Overview
          </Link>
          <a
            href="#condition-explorer"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-secondary transition hover:bg-surface-secondary hover:text-ink"
          >
            <Dna className="h-[18px] w-[18px]" />
            Condition explorer
          </a>
          <a
            href="#research-notes"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-secondary transition hover:bg-surface-secondary hover:text-ink"
          >
            <BookOpen className="h-[18px] w-[18px]" />
            Research notes
          </a>
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-secondary transition hover:bg-surface-secondary hover:text-ink"
          >
            <Settings2 className="h-[18px] w-[18px]" />
            Account settings
          </Link>
        </nav>

        <div className="mt-auto space-y-4">
          <div className="overflow-hidden rounded-2xl bg-ink p-4 text-white">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-sage">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold">Research environment</p>
            <p className="mt-1 text-xs leading-5 text-white/55">
              Local interface preview. No institutional data is connected.
            </p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-secondary transition hover:bg-red-50 hover:text-error"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Sign out
          </button>
          <div className="flex items-center gap-3 border-t border-border pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage/20 text-xs font-bold text-primary">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {profile?.name || 'Researcher'}
              </p>
              <p className="truncate text-xs text-secondary">
                {profile?.institution || profile?.role || 'Local profile'}
              </p>
            </div>
            <Link
              href="/settings"
              aria-label="Open account settings"
              className="rounded-lg p-2 text-secondary transition hover:bg-surface-secondary hover:text-primary"
            >
              <ChevronDown className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>

      <main className="min-h-screen lg:pl-[250px]">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border/70 bg-background/85 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <Image src="/icon.svg" alt="CuroVex logo" width={34} height={34} />
            <span className="font-semibold">CuroVex</span>
          </div>
          <div className="hidden items-center gap-2 text-xs text-secondary md:flex">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            Research workspace
            <span className="text-border">/</span>
            Overview
          </div>
          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <span className="hidden rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-medium text-amber-900 sm:inline-flex">
              Preview environment
            </span>
            <button
              type="button"
              aria-label="Notifications"
              title="No new notifications"
              className="relative rounded-xl border border-border bg-white p-2.5 text-secondary transition hover:border-primary/30 hover:text-primary"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
            </button>
            <Link
              href="/settings"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-white ring-4 ring-primary/10"
              aria-label="Account settings"
            >
              {initials}
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] space-y-7 px-5 py-7 sm:px-8 sm:py-9">
          <section className="relative overflow-hidden rounded-[28px] bg-ink px-6 py-8 text-white shadow-premium sm:px-9 sm:py-10">
            <div className="absolute -right-16 -top-36 h-[390px] w-[390px] rounded-full border border-white/[0.08]" />
            <div className="absolute -right-1 top-[-82px] h-[280px] w-[280px] rounded-full border border-white/[0.09]" />
            <div className="absolute right-[13%] top-[18%] h-36 w-36 rounded-full bg-primary/40 blur-3xl" />
            <div className="absolute bottom-[-60px] right-[30%] h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
            <div className="relative z-10 max-w-2xl animate-rise">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[11px] font-medium tracking-wide text-white/75">
                <Activity className="h-3.5 w-3.5 text-sage" />
                Biomedical discovery workspace
              </div>
              <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Good to see you,{' '}
                <span className="text-sage">{greetingName}.</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/60 sm:text-base">
                Explore biological connections, compare symptom patterns, and
                review candidate evidence across the research catalog.
              </p>
              <a
                href="#condition-explorer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sage px-4 py-3 text-sm font-semibold text-ink transition hover:bg-white"
              >
                Open condition explorer
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="absolute bottom-8 right-10 hidden h-44 w-44 animate-float items-center justify-center rounded-full border border-white/10 bg-white/[0.035] lg:flex">
              <div className="absolute h-32 w-32 rounded-full border border-sage/25" />
              <div className="absolute h-20 w-20 rounded-full border border-white/20" />
              <div className="absolute left-7 top-9 h-3 w-3 rounded-full bg-sage shadow-[0_0_22px_rgba(160,193,161,0.8)]" />
              <div className="absolute bottom-8 right-8 h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_18px_rgba(201,162,109,0.8)]" />
              <Dna className="h-9 w-9 text-white/80" />
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: 'Conditions indexed',
                value: diseases.length.toString().padStart(2, '0'),
                detail: 'Across research categories',
                icon: Dna,
                tone: 'bg-primary/10 text-primary',
              },
              {
                label: 'Candidate records',
                value: Object.values(predictions)
                  .reduce((total, items) => total + items.length, 0)
                  .toString()
                  .padStart(2, '0'),
                detail: 'Available in this workspace',
                icon: FlaskConical,
                tone: 'bg-accent/10 text-accent',
              },
              {
                label: 'Research pathways',
                value: Object.keys(explanationData).length
                  .toString()
                  .padStart(2, '0'),
                detail: 'With graph explanations',
                icon: Activity,
                tone: 'bg-sage/30 text-primary',
              },
              {
                label: 'Evidence sources',
                value: '02',
                detail: 'Literature and trial links',
                icon: ShieldCheck,
                tone: 'bg-secondary/10 text-secondary',
              },
            ].map(({ label, value, detail, icon: Icon, tone }, index) => (
              <article
                key={label}
                className="animate-rise rounded-2xl border border-border/80 bg-white p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-premium"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-secondary">{label}</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
                      {value}
                    </p>
                  </div>
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-1.5 border-t border-border/70 pt-3 text-[11px] text-secondary">
                  <ArrowDownRight className="h-3.5 w-3.5 text-primary" />
                  {detail}
                </div>
              </article>
            ))}
          </section>

          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <section
              id="condition-explorer"
              className="scroll-mt-24 rounded-2xl border border-border/80 bg-white p-5 shadow-soft sm:p-7"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                    Discovery
                  </p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">
                    Condition explorer
                  </h2>
                  <p className="mt-1 text-sm text-secondary">
                    Search conditions or look for shared symptom patterns.
                  </p>
                </div>
                <span className="rounded-full bg-surface-secondary px-3 py-1.5 text-xs font-medium text-secondary">
                  {diseases.length} indexed conditions
                </span>
              </div>

              <div className="mt-6 flex w-fit gap-1 rounded-xl bg-surface-secondary p-1">
                <button
                  type="button"
                  onClick={() => changeMode('disease')}
                  aria-pressed={searchMode === 'disease'}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                    searchMode === 'disease'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-secondary hover:text-ink'
                  }`}
                >
                  Condition
                </button>
                <button
                  type="button"
                  onClick={() => changeMode('symptoms')}
                  aria-pressed={searchMode === 'symptoms'}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                    searchMode === 'symptoms'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-secondary hover:text-ink'
                  }`}
                >
                  Symptom pattern
                </button>
              </div>

              {searchMode === 'disease' ? (
                <div className="relative mt-4">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
                  <input
                    type="search"
                    aria-label="Search conditions"
                    placeholder="Search by condition name, category, or identifier"
                    className="w-full rounded-xl border border-border bg-background py-3.5 pl-11 pr-4 text-sm text-ink outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setSelectedDisease(null);
                      setLoadingResults(true);
                    }}
                  />
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  <form onSubmit={addSymptoms} className="flex gap-2">
                    <div className="relative flex-1">
                      <Plus className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
                      <input
                        type="text"
                        aria-label="Add symptoms"
                        placeholder="Add a symptom, for example fatigue"
                        className="w-full rounded-xl border border-border bg-background py-3.5 pl-11 pr-4 text-sm text-ink outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                        value={symptomInput}
                        onChange={(event) =>
                          setSymptomInput(event.target.value)
                        }
                        onKeyDown={handleSymptomKeyDown}
                      />
                    </div>
                    <button
                      type="submit"
                      className="rounded-xl bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark"
                    >
                      Add
                    </button>
                  </form>
                  {symptoms.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {symptoms.map((symptom) => (
                        <span
                          key={normalize(symptom)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary"
                        >
                          {symptom}
                          <button
                            type="button"
                            aria-label={`Remove ${symptom}`}
                            onClick={() => {
                              setSymptoms((current) =>
                                current.filter(
                                  (item) =>
                                    normalize(item) !== normalize(symptom),
                                ),
                              );
                              setSelectedDisease(null);
                              setLoadingResults(true);
                            }}
                            className="rounded-full text-primary/60 hover:text-primary"
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
                          setLoadingResults(true);
                        }}
                        className="px-2 text-xs text-secondary underline hover:text-primary"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                  <p className="text-xs leading-5 text-secondary">
                    Similar symptoms do not confirm a diagnosis or a shared
                    cause.
                  </p>
                </div>
              )}

              <div className="mb-3 mt-7 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
                  {selectedDisease
                    ? selectedCondition?.name
                    : searchMode === 'symptoms' && symptoms.length > 0
                      ? 'Matching conditions'
                      : 'Catalog'}
                </h3>
                {searchMode === 'symptoms' && symptoms.length > 0 && (
                  <span className="text-[11px] text-secondary">
                    Ordered by shared symptoms
                  </span>
                )}
              </div>

              {selectedDisease && selectedCondition ? (
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setSelectedDisease(null)}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Back to conditions
                  </button>
                  <div className="rounded-xl border border-border bg-background p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-ink">
                          {selectedCondition.name}
                        </p>
                        <p className="mt-1 text-xs text-secondary">
                          {selectedCondition.category}
                        </p>
                      </div>
                      <Stethoscope className="h-5 w-5 text-primary" />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {selectedCondition.symptoms.map((symptom) => (
                        <span
                          key={symptom}
                          className="rounded-full bg-white px-2.5 py-1 text-[11px] text-secondary"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                  {currentPredictions.length ? (
                    currentPredictions.map((candidate: any) => (
                      <Link
                        key={candidate.drugId}
                        href={`/explanation/${candidate.drugId}_${selectedDisease}`}
                        className="group block rounded-xl border border-border bg-white p-4 transition hover:border-primary/30 hover:shadow-soft"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-ink">
                              {candidate.drugName}
                            </p>
                            <p className="mt-1 text-xs text-secondary">
                              {candidate.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary">
                              {candidate.score.toFixed(2)}
                            </p>
                            <p className="text-[10px] text-secondary">
                              Research score
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-border p-4">
                      <p className="text-sm font-semibold text-ink">
                        No ranked candidates available
                      </p>
                      <p className="mt-1 text-xs leading-5 text-secondary">
                        Candidate records for this condition are not yet
                        available in the current research catalog.
                      </p>
                    </div>
                  )}
                </div>
              ) : loadingResults ? (
                <div className="space-y-2.5" aria-label="Loading conditions">
                  {[0, 1, 2].map((item) => (
                    <div
                      key={item}
                      className="h-[74px] animate-shimmer rounded-xl border border-border bg-gradient-to-r from-background via-surface-secondary to-background bg-[length:200%_100%]"
                    />
                  ))}
                </div>
              ) : filteredDiseases.length > 0 ? (
                <div className="space-y-2.5">
                  {filteredDiseases.map(({ disease, matchingSymptoms }) => (
                    <button
                      key={disease.id}
                      type="button"
                      onClick={() => setSelectedDisease(disease.id)}
                      className="group flex w-full items-center justify-between rounded-xl border border-border/80 bg-white p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft"
                    >
                      <div>
                        <p className="text-sm font-semibold text-ink transition-colors group-hover:text-primary">
                          {disease.name}
                        </p>
                        <p className="mt-1 text-xs text-secondary">
                          {disease.category}
                        </p>
                        {matchingSymptoms.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {matchingSymptoms.map((symptom) => (
                              <span
                                key={symptom}
                                className="rounded-full bg-primary/5 px-2 py-0.5 text-[10px] font-medium text-primary"
                              >
                                {symptom}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 text-secondary transition group-hover:translate-x-1 group-hover:text-primary" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border p-6 text-center">
                  <Search className="mx-auto h-5 w-5 text-secondary" />
                  <p className="mt-2 text-sm font-medium text-ink">
                    No matching conditions found
                  </p>
                  <p className="mt-1 text-xs text-secondary">
                    Try another condition name or symptom.
                  </p>
                </div>
              )}
            </section>

            <aside className="space-y-5">
              <section className="rounded-2xl border border-border/80 bg-white p-5 shadow-soft">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                      Workspace
                    </p>
                    <h2 className="mt-1 text-base font-semibold text-ink">
                      Your research profile
                    </h2>
                  </div>
                  <UserRound className="h-5 w-5 text-secondary" />
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">
                      {profile?.name || 'Researcher'}
                    </p>
                    <p className="truncate text-xs text-secondary">
                      {profile?.institution || 'Add your institution'}
                    </p>
                  </div>
                </div>
                <Link
                  href="/settings"
                  className="mt-5 flex w-full items-center justify-between rounded-xl border border-border px-3.5 py-2.5 text-xs font-semibold text-secondary transition hover:border-primary/30 hover:text-primary"
                >
                  Manage profile and preferences
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </section>

              <section className="rounded-2xl border border-border/80 bg-white p-5 shadow-soft">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-semibold text-ink">
                    Recent activity
                  </h2>
                </div>
                <div className="mt-5 space-y-4">
                  <div className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <div>
                      <p className="text-xs font-medium text-ink">
                        Symptom catalog ready
                      </p>
                      <p className="mt-1 text-[11px] text-secondary">
                        {diseases.length} conditions indexed for exploration
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    <div>
                      <p className="text-xs font-medium text-ink">
                        Research pathways available
                      </p>
                      <p className="mt-1 text-[11px] text-secondary">
                        Inspect candidate graph evidence
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section
                id="research-notes"
                className="rounded-2xl border border-primary/10 bg-primary/[0.045] p-5"
              >
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="h-4 w-4" />
                  <h2 className="text-sm font-semibold">Research note</h2>
                </div>
                <p className="mt-2 text-xs leading-5 text-secondary">
                  Shared symptoms can guide a literature search, but they do
                  not establish a shared mechanism or support a treatment
                  recommendation.
                </p>
              </section>

              <div className="flex items-center gap-2 px-1 text-[10px] leading-4 text-secondary">
                <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                Preview data is stored in this browser only.
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <AuthGate>
      <DashboardWorkspace />
    </AuthGate>
  );
}
