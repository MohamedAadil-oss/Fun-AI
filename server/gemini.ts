import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import {
  CUSTOM_STUDIO_COVER,
} from '../src/game/seedWorlds';
import {
  validateCardsPayload,
  validateWorldPayload,
} from '../src/game/engine';
import type { DilemmaCard, MeterDefinition, WorldDeck } from '../src/game/types';

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new GeminiConfigError(
      'GEMINI_API_KEY is not configured. Add your key in the Settings > Secrets panel to generate custom AI worlds.'
    );
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export class GeminiConfigError extends Error {
  readonly status = 400;
  readonly code = 'API_KEY_MISSING';
}

export class GeminiUpstreamError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status = 502, code = 'GEMINI_UPSTREAM_ERROR') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function classifyGeminiError(err: unknown): Error {
  if (err instanceof GeminiConfigError || err instanceof GeminiUpstreamError) {
    return err;
  }
  const msg = err instanceof Error ? err.message : String(err);
  const lower = msg.toLowerCase();

  if (lower.includes('permission_denied') || lower.includes('api_key_invalid') || lower.includes('api key')) {
    return new GeminiUpstreamError(
      'Your Gemini API key could not be authorized. Please check it in the Settings > Secrets panel.',
      403,
      'API_KEY_INVALID'
    );
  }
  if (lower.includes('resource_exhausted') || lower.includes('429')) {
    return new GeminiUpstreamError(
      'Rate limit reached on the Gemini API. Please wait a moment and try again.',
      429,
      'RESOURCE_EXHAUSTED'
    );
  }
  return new GeminiUpstreamError(
    `Could not generate story content: ${msg}`,
    502,
    'GEMINI_UPSTREAM_ERROR'
  );
}

interface RawEffectsTuple {
  m1: number;
  m2: number;
  m3: number;
  m4: number;
}

interface RawChoice {
  label: string;
  outcome: string;
  effects: RawEffectsTuple;
}

interface RawCard {
  id: string;
  speaker: string;
  role: string;
  prompt: string;
  leftChoice: RawChoice;
  rightChoice: RawChoice;
}

interface RawWorldResponse {
  title: string;
  subtitle: string;
  premise: string;
  tone: string;
  meters: Array<{
    id: string;
    label: string;
    icon: string;
    lowEndTitle: string;
    lowEndText: string;
    highEndTitle: string;
    highEndText: string;
  }>;
  cards: RawCard[];
  victoryTitle: string;
  victoryText: string;
}

function mapTupleEffects(
  tuple: RawEffectsTuple | undefined,
  meterIds: string[]
): Record<string, number> {
  const values = [
    tuple?.m1 ?? 0,
    tuple?.m2 ?? 0,
    tuple?.m3 ?? 0,
    tuple?.m4 ?? 0,
  ];
  const result: Record<string, number> = {};
  meterIds.forEach((id, idx) => {
    result[id] = values[idx] ?? 0;
  });
  return result;
}

const CHOICE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    label: {
      type: Type.STRING,
      description: 'Short 3-6 word action label for the button.',
    },
    outcome: {
      type: Type.STRING,
      description: 'Witty 1-sentence consequence shown after choosing.',
    },
    effects: {
      type: Type.OBJECT,
      description: 'Integer meter shifts from -25 to +25 for meters 1 through 4.',
      properties: {
        m1: { type: Type.INTEGER },
        m2: { type: Type.INTEGER },
        m3: { type: Type.INTEGER },
        m4: { type: Type.INTEGER },
      },
      required: ['m1', 'm2', 'm3', 'm4'],
    },
  },
  required: ['label', 'outcome', 'effects'],
};

const CARD_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    speaker: { type: Type.STRING, description: 'Character name presenting the dilemma.' },
    role: { type: Type.STRING, description: 'Short 2-4 word role or title.' },
    prompt: {
      type: Type.STRING,
      description: 'Vivid 1-2 sentence dilemma requiring a left or right choice.',
    },
    leftChoice: CHOICE_SCHEMA,
    rightChoice: CHOICE_SCHEMA,
  },
  required: ['id', 'speaker', 'role', 'prompt', 'leftChoice', 'rightChoice'],
};

export async function generateWorldDeck(
  premise: string,
  tone: string
): Promise<WorldDeck> {
  const ai = getClient();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Create a playable dilemma card deck for the interactive choice game PlotDeck.
Premise: "${premise}"
Requested tone: "${tone}"

Design:
- A memorable title (2-5 words), concise subtitle (3-6 words with a middle dot separator if helpful), and crisp 1-2 sentence premise.
- Exactly 4 distinct world balance meters that pull against each other (each with a short 1-2 word label, an icon from [users, coins, heart, crown, flame, wind, shield, sparkles], plus funny/dramatic endings for hitting 0 or 100).
- Exactly 6 vivid dilemma cards with recurring or memorable speakers, punchy 1-2 sentence dilemmas, and two genuinely contrasting choices (leftChoice and rightChoice).
- Each choice shifts meters m1, m2, m3, m4 by integers between -25 and +25 (avoid making every choice purely good or purely bad; create trade-offs!).
- A victoryTitle and victoryText if the player survives all cards without collapsing or overflowing any meter.`,
      config: {
        systemInstruction:
          'You are the lead tabletop narrative designer for PlotDeck, crafting witty, balanced, replayable dilemma card decks with clear trade-offs and charming specificity.',
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            premise: { type: Type.STRING },
            tone: { type: Type.STRING },
            meters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  label: { type: Type.STRING },
                  icon: {
                    type: Type.STRING,
                    description: 'One of: users, coins, heart, crown, flame, wind, shield, sparkles',
                  },
                  lowEndTitle: { type: Type.STRING },
                  lowEndText: { type: Type.STRING },
                  highEndTitle: { type: Type.STRING },
                  highEndText: { type: Type.STRING },
                },
                required: [
                  'id',
                  'label',
                  'icon',
                  'lowEndTitle',
                  'lowEndText',
                  'highEndTitle',
                  'highEndText',
                ],
              },
            },
            cards: {
              type: Type.ARRAY,
              items: CARD_SCHEMA,
            },
            victoryTitle: { type: Type.STRING },
            victoryText: { type: Type.STRING },
          },
          required: [
            'title',
            'subtitle',
            'premise',
            'tone',
            'meters',
            'cards',
            'victoryTitle',
            'victoryText',
          ],
        },
      },
    });

    const rawText = (response.text ?? '').trim();
    if (!rawText) {
      throw new GeminiUpstreamError('Gemini returned an empty response.', 502);
    }

    const parsed = JSON.parse(rawText) as RawWorldResponse;
    const meterIds = (parsed.meters ?? []).map((m, idx) =>
      typeof m.id === 'string' && m.id.trim()
        ? m.id.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_')
        : `meter_${idx + 1}`
    );

    const normalizedForValidation = {
      ...parsed,
      cards: (parsed.cards ?? []).map((c) => ({
        ...c,
        leftChoice: {
          ...c.leftChoice,
          effects: mapTupleEffects(c.leftChoice?.effects, meterIds),
        },
        rightChoice: {
          ...c.rightChoice,
          effects: mapTupleEffects(c.rightChoice?.effects, meterIds),
        },
      })),
    };

    return validateWorldPayload(normalizedForValidation, CUSTOM_STUDIO_COVER);
  } catch (err) {
    throw classifyGeminiError(err);
  }
}

export async function generateTwistCards(params: {
  worldTitle: string;
  worldPremise: string;
  tone: string;
  meters: MeterDefinition[];
  meterValues: Record<string, number>;
  recentHistory: Array<{
    speaker: string;
    choiceLabel: string;
    outcome: string;
  }>;
}): Promise<DilemmaCard[]> {
  const ai = getClient();
  const meterSummary = params.meters
    .map((m, idx) => `m${idx + 1} (${m.label}): ${params.meterValues[m.id] ?? 50}/100`)
    .join(', ');

  const historySummary =
    params.recentHistory.length > 0
      ? params.recentHistory
          .slice(-4)
          .map((h) => `- ${h.speaker}: player chose "${h.choiceLabel}" -> ${h.outcome}`)
          .join('\n')
      : '- No prior turns yet; escalate the opening tension.';

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Generate 3 escalating follow-up dilemma cards for an active PlotDeck session.
World: ${params.worldTitle} (${params.tone})
Premise: ${params.worldPremise}
Current Meter Levels: ${meterSummary}
Recent Decisions:
${historySummary}

Write 3 fresh cards that directly react to the player's recent choices and current fragile meters.
Map effects to m1, m2, m3, m4 in the exact meter order listed above, using integer deltas between -25 and +25.`,
      config: {
        systemInstruction:
          'You are the live AI story director for PlotDeck. Invent sharp, reactive, surprising dilemmas that reference earlier choices and keep meter tension alive.',
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cards: {
              type: Type.ARRAY,
              items: CARD_SCHEMA,
            },
          },
          required: ['cards'],
        },
      },
    });

    const rawText = (response.text ?? '').trim();
    if (!rawText) {
      throw new GeminiUpstreamError('Gemini returned an empty response.', 502);
    }

    const parsed = JSON.parse(rawText) as { cards?: RawCard[] };
    const meterIds = params.meters.map((m) => m.id);
    const mappedCards = (parsed.cards ?? []).map((c) => ({
      ...c,
      leftChoice: {
        ...c.leftChoice,
        effects: mapTupleEffects(c.leftChoice?.effects, meterIds),
      },
      rightChoice: {
        ...c.rightChoice,
        effects: mapTupleEffects(c.rightChoice?.effects, meterIds),
      },
    }));

    return validateCardsPayload(mappedCards, meterIds);
  } catch (err) {
    throw classifyGeminiError(err);
  }
}
