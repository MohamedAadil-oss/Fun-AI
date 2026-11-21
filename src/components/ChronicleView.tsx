import { BookOpen, Trash2 } from 'lucide-react';
import type { RecordedChronicleRun, TurnHistoryEntry } from '../game/types';

interface ChronicleViewProps {
  runs: RecordedChronicleRun[];
  activeTurns: TurnHistoryEntry[];
  activeWorldTitle: string | null;
  onClearRuns: () => void;
  onReturnToWorlds: () => void;
}

export function ChronicleView({
  runs,
  activeTurns,
  activeWorldTitle,
  onClearRuns,
  onReturnToWorlds,
}: ChronicleViewProps) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-50">Chronicle &amp; Endings</h1>
          <p className="mt-1 text-sm text-slate-400">
            A ledger of your past reigns and decisions from the current tabletop session.
          </p>
        </div>
        {runs.length > 0 && (
          <button
            type="button"
            onClick={onClearRuns}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-slate-700 px-3.5 py-2 text-xs font-medium text-slate-300 hover:border-rose-500/50 hover:text-rose-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Clear Recorded Endings</span>
          </button>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Completed Endings */}
        <section className="lg:col-span-6" aria-labelledby="endings-log-heading">
          <h2 id="endings-log-heading" className="font-display text-xl font-bold text-slate-100">
            Completed Reigns ({runs.length})
          </h2>

          {runs.length === 0 ? (
            <div className="mt-4 rounded-xl border border-slate-800 bg-[#131C2E] p-6 text-center">
              <BookOpen className="mx-auto w-7 h-7 text-slate-500" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium text-slate-200">No completed runs recorded yet.</p>
              <p className="mt-1 text-xs text-slate-400">
                Finish a deck or push a meter to 0 or 100 to unlock your first chronicle entry.
              </p>
              <button
                type="button"
                onClick={onReturnToWorlds}
                className="mt-4 min-h-[40px] rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-300 transition-colors cursor-pointer"
              >
                Browse Worlds
              </button>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {runs.map((run) => (
                <li
                  key={run.id}
                  className="rounded-xl border border-slate-800 bg-[#131C2E] p-4"
                >
                  <p className="text-xs text-slate-400">
                    {run.worldTitle} <span aria-hidden="true">·</span>{' '}
                    <span className="tabular-nums">{run.turnsPlayed} turns</span>{' '}
                    <span aria-hidden="true">·</span>{' '}
                    <span
                      className={
                        run.endingKind === 'survived' ? 'text-emerald-400' : 'text-rose-300'
                      }
                    >
                      {run.endingKind === 'survived'
                        ? 'Survived'
                        : run.endingKind === 'collapse'
                        ? 'Collapsed'
                        : 'Overflowed'}
                    </span>
                  </p>
                  <p className="mt-1 font-display text-lg font-bold text-slate-50">
                    {run.endingTitle}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Active Session Decisions */}
        <section className="lg:col-span-6" aria-labelledby="active-log-heading">
          <h2 id="active-log-heading" className="font-display text-xl font-bold text-slate-100">
            {activeWorldTitle ? `Current Session: ${activeWorldTitle}` : 'Current Session Log'}
          </h2>

          {activeTurns.length === 0 ? (
            <div className="mt-4 rounded-xl border border-slate-800 bg-[#131C2E] p-6 text-sm text-slate-400">
              Decisions from your active game session will appear here turn by turn.
            </div>
          ) : (
            <ol className="mt-4 space-y-3">
              {activeTurns.map((entry) => (
                <li
                  key={`${entry.cardId}-${entry.turn}`}
                  className="rounded-xl border border-slate-800 bg-[#131C2E] p-4"
                >
                  <p className="text-xs text-slate-400 tabular-nums">
                    Turn {entry.turn} <span aria-hidden="true">·</span> {entry.speaker}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-amber-300">
                    Chose: {entry.choiceLabel}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">{entry.outcome}</p>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </main>
  );
}
