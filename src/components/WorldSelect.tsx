import { ArrowRight, Sparkles, Trash2 } from 'lucide-react';
import { CUSTOM_STUDIO_COVER } from '../game/seedWorlds';
import type { WorldDeck } from '../game/types';
import { WorldArtwork } from './WorldArtwork';

interface WorldSelectProps {
  worlds: WorldDeck[];
  onPlayWorld: (world: WorldDeck) => void;
  onOpenAiCreator: () => void;
  onDeleteCustomWorld: (worldId: string) => void;
}

export function WorldSelect({
  worlds,
  onPlayWorld,
  onOpenAiCreator,
  onDeleteCustomWorld,
}: WorldSelectProps) {
  const featured = worlds[0];

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* Hero Split */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
        <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#131C2E] p-8 lg:col-span-6">
          <div>
            <p className="text-xs font-medium tracking-wide text-amber-400">
              Interactive Dilemma Deck · Powered by Gemini
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-slate-50 sm:text-4xl lg:text-[2.65rem] [text-wrap:balance]">
              Every choice tilts four fragile world forces.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300">
              Step into absurd civic crises, zero-gravity kitchens, or dragon-fired bakeries.
              Keep every meter away from 0 and 100—or invent your own playable deck with AI in seconds.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {featured && (
              <button
                type="button"
                onClick={() => onPlayWorld(featured)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
              >
                <span>Play {featured.title}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              onClick={onOpenAiCreator}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/60 px-5 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-800 hover:border-slate-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
            >
              <Sparkles className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <span>Invent a World with AI</span>
            </button>
          </div>
        </div>

        {featured && (
          <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-[#131C2E] lg:col-span-6 aspect-[4/3] lg:aspect-auto">
            <WorldArtwork
              src={featured.coverImage}
              alt={`Storybook illustration for ${featured.title}`}
              title={featured.title}
              className="lg:h-full"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/65 to-transparent p-6 pt-16">
              <p className="text-xs text-slate-300">
                Featured Deck <span aria-hidden="true">·</span> {featured.cards.length} Dilemma Cards{' '}
                <span aria-hidden="true">·</span> {featured.tone}
              </p>
              <p className="mt-1 font-display text-xl font-bold text-slate-50">
                {featured.title}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Playable Decks Grid */}
      <section aria-labelledby="decks-heading" className="mt-12">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-slate-800 pb-4">
          <h2 id="decks-heading" className="font-display text-2xl font-bold text-slate-50">
            Choose a World Deck
          </h2>
          <p className="text-sm text-slate-400 tabular-nums">
            {worlds.length} playable {worlds.length === 1 ? 'deck' : 'decks'} ready
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {worlds.map((world) => (
            <article
              key={world.id}
              className="flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-[#131C2E] transition-transform duration-150 hover:-translate-y-0.5"
            >
              <div className="aspect-[4/3] w-full overflow-hidden border-b border-slate-800 bg-slate-900">
                <WorldArtwork
                  src={world.coverImage}
                  alt={`Illustration for ${world.title}`}
                  title={world.title}
                />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs text-slate-400">
                  {world.source === 'ai' ? 'AI Generated' : 'Curated Deck'}{' '}
                  <span aria-hidden="true">·</span>{' '}
                  <span className="tabular-nums">{world.cards.length} Cards</span>{' '}
                  <span aria-hidden="true">·</span> {world.tone}
                </p>

                <h3 className="mt-1.5 font-display text-xl font-bold text-slate-50">
                  {world.title}
                </h3>

                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-300">
                  {world.premise}
                </p>

                <div className="mt-5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onPlayWorld(world)}
                    aria-label={`Play ${world.title}`}
                    className="flex-1 min-h-[44px] rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                  >
                    Play Deck
                  </button>

                  {world.source === 'ai' && (
                    <button
                      type="button"
                      onClick={() => onDeleteCustomWorld(world.id)}
                      aria-label={`Delete ${world.title}`}
                      className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg border border-slate-700 text-slate-400 hover:border-rose-500/60 hover:text-rose-300 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-400"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}

          {/* Custom AI Studio Invitation Card */}
          <article className="flex flex-col overflow-hidden rounded-xl border border-dashed border-slate-700 bg-[#11192B]">
            <div className="aspect-[4/3] w-full overflow-hidden border-b border-slate-800 bg-slate-900">
              <WorldArtwork
                src={CUSTOM_STUDIO_COVER}
                alt="Ornate wooden storytelling deck on dark velvet table"
                title="Custom AI Studio"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <p className="text-xs text-amber-400">
                Gemini Deck Builder <span aria-hidden="true">·</span> Any Premise
              </p>
              <h3 className="mt-1.5 font-display text-xl font-bold text-slate-50">
                Forge Your Own World
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-300">
                Pitch a wild scenario—a haunted furniture store, an underwater detective agency,
                or anything else—and play a bespoke 6-card deck immediately.
              </p>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={onOpenAiCreator}
                  className="w-full min-h-[44px] rounded-lg border border-amber-400/50 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-300 hover:bg-amber-400 hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                >
                  Open AI Deck Builder
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
