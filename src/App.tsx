import { useCallback, useEffect, useState } from 'react';
import { AiWorldModal } from './components/AiWorldModal';
import { ChronicleView } from './components/ChronicleView';
import { GameBoard } from './components/GameBoard';
import { Header, type ActiveView } from './components/Header';
import { HowToPlayModal } from './components/HowToPlayModal';
import { WorldSelect } from './components/WorldSelect';
import {
  appendCardsToDeck,
  applyChoice,
  createInitialSession,
  resumeSessionWithNewCards,
} from './game/engine';
import { SEED_WORLDS } from './game/seedWorlds';
import type {
  DilemmaCard,
  GameSession,
  RecordedChronicleRun,
  WorldDeck,
} from './game/types';
import { playChoiceSound, playGameOverSound, playVictorySound } from './utils/sound';

const CUSTOM_WORLDS_STORAGE_KEY = 'plotdeck.customWorlds.v1';
const CHRONICLE_STORAGE_KEY = 'plotdeck.chronicle.v1';

function loadStoredCustomWorlds(): WorldDeck[] {
  try {
    const raw = localStorage.getItem(CUSTOM_WORLDS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as WorldDeck[]) : [];
  } catch {
    return [];
  }
}

function loadStoredChronicle(): RecordedChronicleRun[] {
  try {
    const raw = localStorage.getItem(CHRONICLE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RecordedChronicleRun[]) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [customWorlds, setCustomWorlds] = useState<WorldDeck[]>(loadStoredCustomWorlds);
  const [chronicleRuns, setChronicleRuns] = useState<RecordedChronicleRun[]>(loadStoredChronicle);
  const [activeView, setActiveView] = useState<ActiveView>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        return 'play';
      }
    }
    return 'worlds';
  });

  const allWorlds = [...customWorlds, ...SEED_WORLDS];

  const [activeWorld, setActiveWorld] = useState<WorldDeck>(() => SEED_WORLDS[0]);
  const [session, setSession] = useState<GameSession>(() =>
    createInitialSession(SEED_WORLDS[0])
  );

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiCreateLoading, setAiCreateLoading] = useState(false);
  const [aiCreateError, setAiCreateError] = useState<string | null>(null);
  const [twistLoading, setTwistLoading] = useState(false);
  const [twistError, setTwistError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_WORLDS_STORAGE_KEY, JSON.stringify(customWorlds));
    } catch {
      // Storage quota ignored
    }
  }, [customWorlds]);

  useEffect(() => {
    try {
      localStorage.setItem(CHRONICLE_STORAGE_KEY, JSON.stringify(chronicleRuns));
    } catch {
      // Storage quota ignored
    }
  }, [chronicleRuns]);

  useEffect(() => {
    document.body.dataset.state =
      activeView === 'play' ? session.state.toLowerCase() : activeView;
  }, [activeView, session.state]);

  const handlePlayWorld = useCallback((world: WorldDeck) => {
    setActiveWorld(world);
    setSession(createInitialSession(world));
    setTwistError(null);
    setActiveView('play');
  }, []);

  const handleRestart = useCallback(() => {
    setSession(createInitialSession(activeWorld));
    setTwistError(null);
  }, [activeWorld]);

  const handleChoose = useCallback(
    (side: 'left' | 'right') => {
      const next = applyChoice(session, activeWorld, side);
      setSession(next);

      if (next.state === 'GAME_OVER' && next.ending) {
        playGameOverSound(soundEnabled);
        setChronicleRuns((prev) => [
          {
            id: `run-${Date.now()}`,
            worldId: activeWorld.id,
            worldTitle: activeWorld.title,
            turnsPlayed: next.history.length,
            endingTitle: next.ending!.title,
            endingKind: next.ending!.kind,
            finishedAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      } else if (next.state === 'ROUND_SUMMARY' && next.ending) {
        playVictorySound(soundEnabled);
        setChronicleRuns((prev) => [
          {
            id: `run-${Date.now()}`,
            worldId: activeWorld.id,
            worldTitle: activeWorld.title,
            turnsPlayed: next.history.length,
            endingTitle: next.ending!.title,
            endingKind: next.ending!.kind,
            finishedAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      } else {
        playChoiceSound(soundEnabled);
      }
    },
    [session, activeWorld, soundEnabled]
  );

  const handleDeleteCustomWorld = useCallback(
    (worldId: string) => {
      setCustomWorlds((prev) => prev.filter((w) => w.id !== worldId));
      if (activeWorld.id === worldId) {
        setActiveWorld(SEED_WORLDS[0]);
        setSession(createInitialSession(SEED_WORLDS[0]));
      }
    },
    [activeWorld.id]
  );

  const handleCreateAiWorld = useCallback(async (premise: string, tone: string) => {
    setAiCreateLoading(true);
    setAiCreateError(null);

    try {
      const res = await fetch('/api/worlds/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ premise, tone }),
      });
      const data = await res.json();

      if (!res.ok || !data?.world) {
        throw new Error(data?.error || 'Could not generate world deck.');
      }

      const newWorld = data.world as WorldDeck;
      setCustomWorlds((prev) => [newWorld, ...prev]);
      setActiveWorld(newWorld);
      setSession(createInitialSession(newWorld));
      setTwistError(null);
      setAiModalOpen(false);
      setActiveView('play');
    } catch (err) {
      setAiCreateError(
        err instanceof Error ? err.message : 'Unexpected error while building your world.'
      );
    } finally {
      setAiCreateLoading(false);
    }
  }, []);

  const handleGenerateTwist = useCallback(async () => {
    setTwistLoading(true);
    setTwistError(null);

    try {
      const res = await fetch('/api/worlds/twist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          worldTitle: activeWorld.title,
          worldPremise: activeWorld.premise,
          tone: activeWorld.tone,
          meters: activeWorld.meters,
          meterValues: session.meters,
          recentHistory: session.history.map((h) => ({
            speaker: h.speaker,
            choiceLabel: h.choiceLabel,
            outcome: h.outcome,
          })),
        }),
      });
      const data = await res.json();

      if (!res.ok || !Array.isArray(data?.cards)) {
        throw new Error(data?.error || 'Could not generate twist cards.');
      }

      const updatedDeck = appendCardsToDeck(activeWorld, data.cards as DilemmaCard[]);
      setActiveWorld(updatedDeck);
      if (updatedDeck.source === 'ai') {
        setCustomWorlds((prev) =>
          prev.map((w) => (w.id === updatedDeck.id ? updatedDeck : w))
        );
      }

      if (session.state === 'ROUND_SUMMARY') {
        setSession((prev) => resumeSessionWithNewCards(prev, updatedDeck));
      }
    } catch (err) {
      setTwistError(
        err instanceof Error ? err.message : 'Could not generate follow-up twist cards.'
      );
    } finally {
      setTwistLoading(false);
    }
  }, [activeWorld, session]);

  return (
    <div className="min-h-screen bg-[#0B1120] text-[#F1F5F9]">
      <Header
        activeView={activeView}
        onNavigate={(view) => {
          if (view === 'play') {
            setActiveView('play');
          } else {
            setActiveView(view);
          }
        }}
        onOpenHowToPlay={() => setHowToPlayOpen(true)}
        onOpenAiCreator={() => {
          setAiCreateError(null);
          setAiModalOpen(true);
        }}
      />

      {activeView === 'worlds' && (
        <WorldSelect
          worlds={allWorlds}
          onPlayWorld={handlePlayWorld}
          onOpenAiCreator={() => {
            setAiCreateError(null);
            setAiModalOpen(true);
          }}
          onDeleteCustomWorld={handleDeleteCustomWorld}
        />
      )}

      {activeView === 'play' && (
        <GameBoard
          world={activeWorld}
          session={session}
          soundEnabled={soundEnabled}
          twistLoading={twistLoading}
          twistError={twistError}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
          onChoose={handleChoose}
          onRestart={handleRestart}
          onBackToWorlds={() => setActiveView('worlds')}
          onGenerateTwist={handleGenerateTwist}
          onDismissTwistError={() => setTwistError(null)}
        />
      )}

      {activeView === 'chronicle' && (
        <ChronicleView
          runs={chronicleRuns}
          activeTurns={session.history}
          activeWorldTitle={session.history.length > 0 ? activeWorld.title : null}
          onClearRuns={() => setChronicleRuns([])}
          onReturnToWorlds={() => setActiveView('worlds')}
        />
      )}

      <HowToPlayModal open={howToPlayOpen} onClose={() => setHowToPlayOpen(false)} />

      <AiWorldModal
        open={aiModalOpen}
        onClose={() => {
          if (!aiCreateLoading) setAiModalOpen(false);
        }}
        onWorldCreated={handleCreateAiWorld}
        loading={aiCreateLoading}
        error={aiCreateError}
      />
    </div>
  );
}
