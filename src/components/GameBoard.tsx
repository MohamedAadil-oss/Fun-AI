import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  Loader2,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { motion } from 'motion/react';
import { formatDeltaSummary, getMeterStatusLabel } from '../game/engine';
import type { GameSession, WorldDeck } from '../game/types';
import { MeterIcon } from './MeterIcon';

interface GameBoardProps {
  world: WorldDeck;
  session: GameSession;
  soundEnabled: boolean;
  twistLoading: boolean;
  twistError: string | null;
  onToggleSound: () => void;
  onChoose: (side: 'left' | 'right') => void;
  onRestart: () => void;
  onBackToWorlds: () => void;
  onGenerateTwist: () => void;
  onDismissTwistError: () => void;
}

export function GameBoard({
  world,
  session,
  soundEnabled,
  twistLoading,
  twistError,
  onToggleSound,
  onChoose,
  onRestart,
  onBackToWorlds,
  onGenerateTwist,
  onDismissTwistError,
}: GameBoardProps) {
  const [hoveredSide, setHoveredSide] = useState<'left' | 'right' | null>(null);

  const currentCard = world.cards[session.cardIndex];
  const previewChoice =
    session.state === 'PLAYING' && currentCard && hoveredSide
      ? hoveredSide === 'left'
        ? currentCard.leftChoice
        : currentCard.rightChoice
      : null;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (session.state !== 'PLAYING') return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        setHoveredSide(null);
        onChoose('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        setHoveredSide(null);
        onChoose('right');
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [session.state, onChoose]);

  const lastDeltas = session.lastOutcome
    ? formatDeltaSummary(world, session.lastOutcome.deltas)
    : [];

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      {/* Workspace Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-4 min-w-0">
          <button
            type="button"
            onClick={onBackToWorlds}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-400"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            <span>All Worlds</span>
          </button>
          <div className="min-w-0">
            <h1 className="truncate font-display text-xl font-bold text-slate-50">
              {world.title}
            </h1>
            <p className="text-xs text-slate-400 tabular-nums">
              {session.state === 'PLAYING'
                ? `Turn ${session.turn} of ${world.cards.length}`
                : `Finished after ${session.history.length} ${
                    session.history.length === 1 ? 'turn' : 'turns'
                  }`}
              {' '}
              <span aria-hidden="true">·</span> {world.subtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-400"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-400" aria-hidden="true" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" aria-hidden="true" />
            )}
            <span>{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-400"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Restart</span>
          </button>

          {session.state !== 'GAME_OVER' && (
            <button
              type="button"
              onClick={onGenerateTwist}
              disabled={twistLoading}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-amber-400/40 bg-amber-400/10 px-3.5 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-400 hover:text-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-400"
            >
              {twistLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              <span>{twistLoading ? 'Writing Twist...' : 'Generate AI Twist'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Error Alert if AI Twist failed */}
      {twistError && (
        <div
          role="alert"
          className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-rose-500/40 bg-rose-950/50 px-4 py-3 text-sm text-rose-200"
        >
          <span>{twistError}</span>
          <button
            type="button"
            onClick={onDismissTwistError}
            className="text-xs font-semibold text-rose-100 underline hover:text-white shrink-0 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 4-Meter HUD Strip */}
      <section aria-label="World balance meters" className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {world.meters.map((meter) => {
          const val = session.meters[meter.id] ?? 50;
          const status = getMeterStatusLabel(val);
          const previewDelta = previewChoice?.effects[meter.id] ?? 0;
          const isExtreme = val <= 15 || val >= 85;
          const isWarn = (val > 15 && val <= 34) || (val >= 66 && val < 85);

          return (
            <div
              key={meter.id}
              data-testid={`meter-${meter.id}`}
              className="rounded-xl border border-slate-800 bg-[#131C2E] p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <MeterIcon name={meter.icon} className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate text-sm font-semibold text-slate-100">
                    {meter.label}
                  </span>
                </div>
                <span className="font-mono text-sm font-semibold text-slate-50 tabular-nums shrink-0">
                  {val}
                </span>
              </div>

              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-200 ${
                    isExtreme
                      ? 'bg-rose-400'
                      : isWarn
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                  }`}
                  style={{ width: `${val}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between gap-2 text-xs">
                <span
                  className={
                    isExtreme
                      ? 'font-medium text-rose-300'
                      : isWarn
                      ? 'text-amber-300'
                      : 'text-slate-400'
                  }
                >
                  {status}
                </span>
                {previewDelta !== 0 ? (
                  <span className="font-mono text-amber-300" aria-live="polite">
                    {previewDelta > 0 ? '▲ Shift' : '▼ Shift'}
                  </span>
                ) : (
                  <span className="text-slate-600 tabular-nums">0–100</span>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Main Tabletop Stage */}
      <section className="mt-8 flex flex-col items-center">
        {session.state === 'PLAYING' && currentCard && (
          <div className="relative w-full max-w-3xl">
            {/* Subtle card stack shadow beneath active card */}
            <div
              aria-hidden="true"
              className="absolute inset-x-3 -bottom-2.5 h-6 rounded-b-xl border border-slate-700/70 bg-slate-800/70"
            />

            <motion.article
              key={currentCard.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              data-testid="dilemma-card"
              className="relative rounded-xl border border-slate-200 bg-[#F8FAFC] p-7 text-slate-900 shadow-2xl sm:p-9"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
                <p className="text-sm font-medium text-slate-600">
                  <span className="font-semibold text-slate-900">{currentCard.speaker}</span>{' '}
                  <span aria-hidden="true">·</span> {currentCard.role}
                </p>
                <span className="font-mono text-xs text-slate-500 tabular-nums">
                  Card {session.cardIndex + 1}/{world.cards.length}
                </span>
              </div>

              <p className="mt-6 font-display text-xl font-semibold leading-relaxed text-slate-950 sm:text-2xl [text-wrap:balance]">
                {currentCard.prompt}
              </p>

              <div className="mt-8 grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setHoveredSide(null);
                    onChoose('left');
                  }}
                  onMouseEnter={() => setHoveredSide('left')}
                  onMouseLeave={() => setHoveredSide(null)}
                  onFocus={() => setHoveredSide('left')}
                  onBlur={() => setHoveredSide(null)}
                  className="group flex min-h-[50px] items-center justify-between gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-900 hover:border-slate-900 hover:bg-amber-300 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                >
                  <span className="flex items-center gap-2.5">
                    <ArrowLeft className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-slate-950" aria-hidden="true" />
                    <span>{currentCard.leftChoice.label}</span>
                  </span>
                  <kbd className="hidden md:inline-block shrink-0 rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-600">
                    A
                  </kbd>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHoveredSide(null);
                    onChoose('right');
                  }}
                  onMouseEnter={() => setHoveredSide('right')}
                  onMouseLeave={() => setHoveredSide(null)}
                  onFocus={() => setHoveredSide('right')}
                  onBlur={() => setHoveredSide(null)}
                  className="group flex min-h-[50px] items-center justify-between gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-900 hover:border-slate-900 hover:bg-amber-300 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                >
                  <span className="flex items-center gap-2.5">
                    <ArrowRight className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-slate-950" aria-hidden="true" />
                    <span>{currentCard.rightChoice.label}</span>
                  </span>
                  <kbd className="hidden md:inline-block shrink-0 rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-600">
                    D
                  </kbd>
                </button>
              </div>
            </motion.article>
          </div>
        )}

        {/* Game Over / Round Summary Epilogue Card */}
        {(session.state === 'GAME_OVER' || session.state === 'ROUND_SUMMARY') && session.ending && (
          <motion.article
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            data-testid="ending-card"
            className="w-full max-w-2xl rounded-xl border border-slate-700 bg-[#131C2E] p-8 shadow-2xl"
          >
            <p
              className={`text-xs font-semibold ${
                session.ending.kind === 'survived' ? 'text-emerald-400' : 'text-rose-300'
              }`}
            >
              {session.ending.kind === 'survived'
                ? `Deck Completed · All ${world.cards.length} Dilemmas Survived`
                : session.ending.kind === 'collapse'
                ? `Meter Collapsed · ${session.ending.meterLabel} reached 0`
                : `Meter Overflowed · ${session.ending.meterLabel} reached 100`}
            </p>

            <h2 className="mt-2 font-display text-3xl font-bold text-slate-50 [text-wrap:balance]">
              {session.ending.title}
            </h2>

            <p className="mt-3 text-base leading-relaxed text-slate-300">
              {session.ending.description}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 border-y border-slate-800 py-4 sm:grid-cols-4">
              {world.meters.map((m) => (
                <div key={m.id}>
                  <p className="text-xs text-slate-400">{m.label}</p>
                  <p className="mt-0.5 font-mono text-lg font-semibold text-slate-100 tabular-nums">
                    {session.meters[m.id] ?? 50}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onRestart}
                className="min-h-[44px] rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
              >
                Play Again
              </button>

              {session.state === 'ROUND_SUMMARY' && (
                <button
                  type="button"
                  onClick={onGenerateTwist}
                  disabled={twistLoading}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-amber-400/40 bg-amber-400/10 px-4 py-2.5 text-sm font-semibold text-amber-300 hover:bg-amber-400 hover:text-slate-950 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {twistLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Sparkles className="w-4 h-4" aria-hidden="true" />
                  )}
                  <span>{twistLoading ? 'Writing Next Chapter...' : 'Extend Story with AI'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={onBackToWorlds}
                className="min-h-[44px] rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Choose Another World
              </button>
            </div>
          </motion.article>
        )}

        {/* Last Consequence Readout */}
        {session.lastOutcome && (
          <div
            aria-live="polite"
            className="mt-6 w-full max-w-2xl rounded-lg border border-slate-800 bg-[#131C2E]/80 px-5 py-3.5 text-sm text-slate-300"
          >
            <p className="text-slate-200">{session.lastOutcome.text}</p>
            {lastDeltas.length > 0 && (
              <p className="mt-1.5 font-mono text-xs text-slate-400 tabular-nums">
                {lastDeltas.map((d, idx) => (
                  <span key={d.meterId}>
                    {idx > 0 && <span aria-hidden="true"> · </span>}
                    <span className={d.delta > 0 ? 'text-emerald-400' : 'text-rose-300'}>
                      {d.label} {d.delta > 0 ? `+${d.delta}` : d.delta}
                    </span>
                  </span>
                ))}
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
