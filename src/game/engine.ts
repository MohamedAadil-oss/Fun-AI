import type {
  DilemmaCard,
  DilemmaChoice,
  GameEnding,
  GameSession,
  MeterDefinition,
  MeterEffects,
  MeterIconName,
  WorldDeck,
} from './types';

export const INITIAL_METER_VALUE = 50;
export const MIN_METER_VALUE = 0;
export const MAX_METER_VALUE = 100;

const VALID_ICONS: ReadonlySet<MeterIconName> = new Set([
  'users',
  'coins',
  'heart',
  'crown',
  'flame',
  'wind',
  'shield',
  'sparkles',
]);

export function clampMeter(value: number): number {
  if (!Number.isFinite(value)) return INITIAL_METER_VALUE;
  return Math.max(MIN_METER_VALUE, Math.min(MAX_METER_VALUE, Math.round(value)));
}

export function getMeterStatusLabel(value: number): string {
  if (value <= 15) return 'Critical Low';
  if (value <= 34) return 'Fragile';
  if (value <= 65) return 'Steady';
  if (value <= 84) return 'Elevated';
  return 'Critical High';
}

export function createInitialSession(world: WorldDeck): GameSession {
  const meters: Record<string, number> = {};
  for (const meter of world.meters) {
    meters[meter.id] = INITIAL_METER_VALUE;
  }

  return {
    worldId: world.id,
    state: 'PLAYING',
    turn: 1,
    cardIndex: 0,
    meters,
    history: [],
    ending: null,
    lastOutcome: null,
  };
}

export function formatDeltaSummary(
  world: WorldDeck,
  deltas: MeterEffects
): Array<{ meterId: string; label: string; delta: number }> {
  return world.meters
    .map((m) => ({
      meterId: m.id,
      label: m.label,
      delta: deltas[m.id] ?? 0,
    }))
    .filter((entry) => entry.delta !== 0);
}

export function applyChoice(
  session: GameSession,
  world: WorldDeck,
  side: 'left' | 'right'
): GameSession {
  if (session.state !== 'PLAYING') {
    return session;
  }

  const card = world.cards[session.cardIndex];
  if (!card) {
    return {
      ...session,
      state: 'ROUND_SUMMARY',
      ending: {
        kind: 'survived',
        title: world.victoryTitle,
        description: world.victoryText,
      },
    };
  }

  const chosen = side === 'left' ? card.leftChoice : card.rightChoice;
  const nextMeters: Record<string, number> = { ...session.meters };
  const appliedDeltas: MeterEffects = {};

  for (const meter of world.meters) {
    const rawDelta = chosen.effects[meter.id] ?? 0;
    const prev = nextMeters[meter.id] ?? INITIAL_METER_VALUE;
    const next = clampMeter(prev + rawDelta);
    nextMeters[meter.id] = next;
    appliedDeltas[meter.id] = next - prev;
  }

  const historyEntry = {
    turn: session.turn,
    cardId: card.id,
    speaker: card.speaker,
    prompt: card.prompt,
    choiceSide: side,
    choiceLabel: chosen.label,
    outcome: chosen.outcome,
    deltas: appliedDeltas,
  };

  const nextHistory = [...session.history, historyEntry];

  // Check collapse (<= 0) or overflow (>= 100) in meter order
  let triggeredEnding: GameEnding | null = null;
  for (const meter of world.meters) {
    const value = nextMeters[meter.id];
    if (value <= MIN_METER_VALUE) {
      triggeredEnding = {
        kind: 'collapse',
        meterId: meter.id,
        meterLabel: meter.label,
        title: meter.lowEndTitle,
        description: meter.lowEndText,
      };
      break;
    }
    if (value >= MAX_METER_VALUE) {
      triggeredEnding = {
        kind: 'overflow',
        meterId: meter.id,
        meterLabel: meter.label,
        title: meter.highEndTitle,
        description: meter.highEndText,
      };
      break;
    }
  }

  if (triggeredEnding) {
    return {
      ...session,
      state: 'GAME_OVER',
      meters: nextMeters,
      history: nextHistory,
      ending: triggeredEnding,
      lastOutcome: {
        text: chosen.outcome,
        deltas: appliedDeltas,
      },
    };
  }

  const nextCardIndex = session.cardIndex + 1;
  if (nextCardIndex >= world.cards.length) {
    return {
      ...session,
      state: 'ROUND_SUMMARY',
      cardIndex: nextCardIndex,
      meters: nextMeters,
      history: nextHistory,
      ending: {
        kind: 'survived',
        title: world.victoryTitle,
        description: world.victoryText,
      },
      lastOutcome: {
        text: chosen.outcome,
        deltas: appliedDeltas,
      },
    };
  }

  return {
    ...session,
    state: 'PLAYING',
    turn: session.turn + 1,
    cardIndex: nextCardIndex,
    meters: nextMeters,
    history: nextHistory,
    ending: null,
    lastOutcome: {
      text: chosen.outcome,
      deltas: appliedDeltas,
    },
  };
}

export function appendCardsToDeck(world: WorldDeck, newCards: DilemmaCard[]): WorldDeck {
  const existingIds = new Set(world.cards.map((c) => c.id));
  const deduped = newCards.map((card, idx) => {
    let candidateId = card.id || `twist-${world.cards.length + idx + 1}`;
    while (existingIds.has(candidateId)) {
      candidateId = `${candidateId}-${idx + 1}`;
    }
    existingIds.add(candidateId);
    return { ...card, id: candidateId };
  });

  return {
    ...world,
    cards: [...world.cards, ...deduped],
  };
}

export function resumeSessionWithNewCards(
  session: GameSession,
  world: WorldDeck
): GameSession {
  if (session.cardIndex >= world.cards.length) {
    return session;
  }
  return {
    ...session,
    state: 'PLAYING',
    turn: session.history.length + 1,
    ending: null,
  };
}

function asNonEmptyString(val: unknown, fieldName: string): string {
  if (typeof val !== 'string' || !val.trim()) {
    throw new Error(`Invalid or missing string field: ${fieldName}`);
  }
  return val.trim();
}

function normalizeIcon(val: unknown, fallbackIndex: number): MeterIconName {
  if (typeof val === 'string' && VALID_ICONS.has(val as MeterIconName)) {
    return val as MeterIconName;
  }
  const fallbacks: MeterIconName[] = ['users', 'coins', 'heart', 'crown'];
  return fallbacks[fallbackIndex % fallbacks.length];
}

function normalizeChoice(raw: unknown, meterIds: string[], sideLabel: string): DilemmaChoice {
  if (!raw || typeof raw !== 'object') {
    throw new Error(`Missing ${sideLabel}`);
  }
  const obj = raw as Record<string, unknown>;
  const label = asNonEmptyString(obj.label, `${sideLabel}.label`);
  const outcome = asNonEmptyString(obj.outcome, `${sideLabel}.outcome`);

  const rawEffects = (obj.effects && typeof obj.effects === 'object'
    ? obj.effects
    : {}) as Record<string, unknown>;

  const effects: MeterEffects = {};
  for (const id of meterIds) {
    const val = rawEffects[id];
    const num = typeof val === 'number' && Number.isFinite(val) ? Math.round(val) : 0;
    effects[id] = Math.max(-35, Math.min(35, num));
  }

  return { label, outcome, effects };
}

export function validateCardsPayload(raw: unknown, meterIds: string[]): DilemmaCard[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error('Expected a non-empty array of dilemma cards.');
  }

  return raw.map((item, idx) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`Card at index ${idx} is not an object.`);
    }
    const obj = item as Record<string, unknown>;
    return {
      id:
        typeof obj.id === 'string' && obj.id.trim()
          ? obj.id.trim()
          : `card-${Date.now()}-${idx + 1}`,
      speaker: asNonEmptyString(obj.speaker, `cards[${idx}].speaker`),
      role: asNonEmptyString(obj.role, `cards[${idx}].role`),
      prompt: asNonEmptyString(obj.prompt, `cards[${idx}].prompt`),
      leftChoice: normalizeChoice(obj.leftChoice, meterIds, `cards[${idx}].leftChoice`),
      rightChoice: normalizeChoice(obj.rightChoice, meterIds, `cards[${idx}].rightChoice`),
    };
  });
}

export function validateWorldPayload(
  raw: unknown,
  fallbackCoverImage: string
): WorldDeck {
  if (!raw || typeof raw !== 'object') {
    throw new Error('World payload must be an object.');
  }
  const obj = raw as Record<string, unknown>;

  if (!Array.isArray(obj.meters) || obj.meters.length !== 4) {
    throw new Error('World payload must define exactly 4 meters.');
  }

  const normalizedMeters = obj.meters.map((m, idx): MeterDefinition => {
    if (!m || typeof m !== 'object') {
      throw new Error(`Meter at index ${idx} is invalid.`);
    }
    const mo = m as Record<string, unknown>;
    const rawId =
      typeof mo.id === 'string' && mo.id.trim()
        ? mo.id.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_')
        : `meter_${idx + 1}`;

    return {
      id: rawId,
      label: asNonEmptyString(mo.label, `meters[${idx}].label`),
      icon: normalizeIcon(mo.icon, idx),
      lowEndTitle: asNonEmptyString(mo.lowEndTitle, `meters[${idx}].lowEndTitle`),
      lowEndText: asNonEmptyString(mo.lowEndText, `meters[${idx}].lowEndText`),
      highEndTitle: asNonEmptyString(mo.highEndTitle, `meters[${idx}].highEndTitle`),
      highEndText: asNonEmptyString(mo.highEndText, `meters[${idx}].highEndText`),
    };
  }) as [MeterDefinition, MeterDefinition, MeterDefinition, MeterDefinition];

  const meterIds = normalizedMeters.map((m) => m.id);
  const cards = validateCardsPayload(obj.cards, meterIds);

  return {
    id: `ai-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: asNonEmptyString(obj.title, 'title'),
    subtitle: asNonEmptyString(obj.subtitle, 'subtitle'),
    premise: asNonEmptyString(obj.premise, 'premise'),
    tone: typeof obj.tone === 'string' && obj.tone.trim() ? obj.tone.trim() : 'Whimsical Satire',
    source: 'ai',
    coverImage: fallbackCoverImage,
    meters: normalizedMeters,
    cards,
    victoryTitle: asNonEmptyString(obj.victoryTitle, 'victoryTitle'),
    victoryText: asNonEmptyString(obj.victoryText, 'victoryText'),
  };
}
