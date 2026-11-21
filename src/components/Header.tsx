export type ActiveView = 'worlds' | 'play' | 'chronicle';

interface HeaderProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  onOpenHowToPlay: () => void;
  onOpenAiCreator: () => void;
}

export function Header({
  activeView,
  onNavigate,
  onOpenHowToPlay,
  onOpenAiCreator,
}: HeaderProps) {
  return (
    <header className="border-b border-slate-800/80 bg-[#0B1120]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:gap-8 sm:px-6 sm:py-4">
        <button
          type="button"
          onClick={() => onNavigate('worlds')}
          className="font-display text-lg sm:text-xl font-bold tracking-tight text-slate-50 whitespace-nowrap shrink-0 hover:text-amber-400 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 rounded-sm cursor-pointer"
        >
          PlotDeck
        </button>

        <nav aria-label="Primary navigation" className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium">
          <button
            type="button"
            onClick={() => onNavigate('worlds')}
            className={`py-1.5 whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 ${
              activeView === 'worlds'
                ? 'border-amber-400 text-slate-50'
                : 'border-transparent text-slate-400 hover:text-slate-100'
            }`}
          >
            Worlds
          </button>
          <button
            type="button"
            onClick={() => onNavigate('chronicle')}
            className={`py-1.5 whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 ${
              activeView === 'chronicle'
                ? 'border-amber-400 text-slate-50'
                : 'border-transparent text-slate-400 hover:text-slate-100'
            }`}
          >
            Chronicle
          </button>
          <button
            type="button"
            onClick={onOpenHowToPlay}
            className="hidden sm:inline-block py-1.5 whitespace-nowrap shrink-0 border-b-2 border-transparent text-slate-400 hover:text-slate-100 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
          >
            How to Play
          </button>
        </nav>

        <div className="shrink-0">
          <button
            type="button"
            onClick={onOpenAiCreator}
            className="min-h-[40px] rounded-lg bg-amber-400 px-3 py-2 text-xs sm:px-4 sm:text-sm font-semibold text-slate-950 hover:bg-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
          >
            Create AI World
          </button>
        </div>
      </div>
    </header>
  );
}
