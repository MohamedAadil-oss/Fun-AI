import { useState, type FormEvent } from 'react';
import { Loader2, Sparkles, X } from 'lucide-react';

interface AiWorldModalProps {
  open: boolean;
  onClose: () => void;
  onWorldCreated: (premise: string, tone: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const IDEA_SPARKS = [
  'A sentient espresso machine running for city mayor',
  'Ghostly roommates negotiating chores in a Victorian townhouse',
  'A tiny submarine crew delivering mail across a coral reef',
  'Cats staging a diplomatic summit with the household vacuum cleaner',
];

const TONES = ['Whimsical Satire', 'Cozy Mystery', 'Sci-Fi Comedy', 'Dramatic Fable'];

export function AiWorldModal({
  open,
  onClose,
  onWorldCreated,
  loading,
  error,
}: AiWorldModalProps) {
  const [premise, setPremise] = useState('');
  const [tone, setTone] = useState(TONES[0]);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = premise.trim();
    if (trimmed.length < 6) {
      setValidationError('Please enter a premise of at least 6 characters or pick an idea spark.');
      return;
    }
    setValidationError(null);
    await onWorldCreated(trimmed, tone);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-creator-title"
    >
      <div className="w-full max-w-xl rounded-xl border border-slate-700 bg-[#131C2E] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="ai-creator-title" className="font-display text-2xl font-bold text-slate-50">
              Create Custom AI World
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Describe any strange scenario. Gemini will craft 4 balance meters, 6 dilemma cards, and custom endings.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close AI World Creator"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 disabled:opacity-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-400"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div>
            <label htmlFor="world-premise" className="block text-sm font-semibold text-slate-200">
              World Premise
            </label>
            <textarea
              id="world-premise"
              rows={3}
              value={premise}
              onChange={(e) => {
                setPremise(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="e.g., A medieval dragon who secretly runs a neighborhood bookstore..."
              className="mt-2 w-full rounded-lg border border-slate-700 bg-[#0B1120] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
            />
            {validationError && (
              <p role="alert" className="mt-1.5 text-xs font-medium text-rose-300">
                {validationError}
              </p>
            )}
          </div>

          <div>
            <p className="text-xs font-medium text-slate-400">Need inspiration? Pick a spark:</p>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {IDEA_SPARKS.map((spark) => (
                <button
                  key={spark}
                  type="button"
                  onClick={() => {
                    setPremise(spark);
                    setValidationError(null);
                  }}
                  className="rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-left text-xs text-slate-300 hover:border-amber-400/50 hover:text-slate-100 transition-colors cursor-pointer"
                >
                  {spark}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="block text-xs font-medium text-slate-400">Narrative Tone</span>
            <div className="mt-2 flex flex-wrap gap-1.5 rounded-lg bg-[#0B1120] p-1">
              {TONES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`flex-1 min-h-[36px] rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    tone === t
                      ? 'bg-amber-400 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-rose-500/40 bg-rose-950/60 px-4 py-3 text-sm text-rose-200"
            >
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="min-h-[42px] rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-50 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300 disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : (
                <Sparkles className="w-4 h-4" aria-hidden="true" />
              )}
              <span>{loading ? 'Building Deck...' : 'Generate World'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
