import { X } from 'lucide-react';

interface HowToPlayModalProps {
  open: boolean;
  onClose: () => void;
}

export function HowToPlayModal({ open, onClose }: HowToPlayModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-to-play-title"
    >
      <div className="w-full max-w-lg rounded-xl border border-slate-700 bg-[#131C2E] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="how-to-play-title" className="font-display text-2xl font-bold text-slate-50">
              How PlotDeck Works
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Keep four competing world forces balanced between 1 and 99.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close How to Play"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-400"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <ol className="mt-6 space-y-4 text-sm leading-relaxed text-slate-300">
          <li>
            <span className="font-semibold text-amber-400">01. Read each dilemma carefully.</span>{' '}
            Every turn presents a character and a binary choice. Hover or focus a choice button to
            spot which meters will rise or fall before you commit.
          </li>
          <li>
            <span className="font-semibold text-amber-400">02. Avoid both zero and one hundred.</span>{' '}
            Letting any meter collapse to 0 or overflow to 100 triggers an immediate ending for that
            world.
          </li>
          <li>
            <span className="font-semibold text-amber-400">03. Extend with AI anytime.</span>{' '}
            Invent any custom premise from scratch, or click Generate AI Twist during play to have
            Gemini write three new cards reacting to your choices.
          </li>
        </ol>

        <div className="mt-6 border-t border-slate-800 pt-4 text-xs text-slate-400">
          Keyboard shortcuts during play: press <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-slate-200">A</kbd> or{' '}
          <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-slate-200">←</kbd> for Left Choice,{' '}
          <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-slate-200">D</kbd> or{' '}
          <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-slate-200">→</kbd> for Right Choice.
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[42px] rounded-lg bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
