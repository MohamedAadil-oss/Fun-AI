export type GameState = 'TITLE_MENU' | 'PLAYING' | 'ROUND_SUMMARY' | 'GAME_OVER';

export type MeterIconName =
  | 'users'
  | 'coins'
  | 'heart'
  | 'crown'
  | 'flame'
  | 'wind'
  | 'shield'
  | 'sparkles';

export interface MeterDefinition {
  id: string;
  label: string;
  icon: MeterIconName;
  lowEndTitle: string;
  lowEndText: string;
  highEndTitle: string;
  highEndText: string;
}

export type MeterEffects = Record<string, number>;

export interface DilemmaChoice {
  label: string;
  outcome: string;
  effects: MeterEffects;
}

export interface DilemmaCard {
  id: string;
  speaker: string;
  role: string;
  prompt: string;
  leftChoice: DilemmaChoice;
  rightChoice: DilemmaChoice;
}

export interface WorldDeck {
  id: string;
  title: string;
  subtitle: string;
  premise: string;
  tone: string;
  source: 'curated' | 'ai';
  coverImage: string;
  meters: [MeterDefinition, MeterDefinition, MeterDefinition, MeterDefinition];
  cards: DilemmaCard[];
  victoryTitle: string;
  victoryText: string;
}

export interface TurnHistoryEntry {
  turn: number;
  cardId: string;
  speaker: string;
  prompt: string;
  choiceSide: 'left' | 'right';
  choiceLabel: string;
  outcome: string;
  deltas: MeterEffects;
}

export interface GameEnding {
  kind: 'collapse' | 'overflow' | 'survived';
  meterId?: string;
  meterLabel?: string;
  title: string;
  description: string;
}

export interface GameSession {
  worldId: string;
  state: GameState;
  turn: number;
  cardIndex: number;
  meters: Record<string, number>;
  history: TurnHistoryEntry[];
  ending: GameEnding | null;
  lastOutcome: {
    text: string;
    deltas: MeterEffects;
  } | null;
}

export interface RecordedChronicleRun {
  id: string;
  worldId: string;
  worldTitle: string;
  turnsPlayed: number;
  endingTitle: string;
  endingKind: GameEnding['kind'];
  finishedAt: string;
}
