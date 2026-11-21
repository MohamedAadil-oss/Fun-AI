import test from 'node:test';
import assert from 'node:assert/strict';
import {
  appendCardsToDeck,
  applyChoice,
  clampMeter,
  createInitialSession,
  getMeterStatusLabel,
  resumeSessionWithNewCards,
  validateCardsPayload,
  validateWorldPayload,
} from './engine';
import { SEED_WORLDS } from './seedWorlds';
import type { WorldDeck } from './types';

test('clampMeter bounds values between 0 and 100', () => {
  assert.equal(clampMeter(-20), 0);
  assert.equal(clampMeter(0), 0);
  assert.equal(clampMeter(42.6), 43);
  assert.equal(clampMeter(140), 100);
});

test('getMeterStatusLabel returns clear text states across ranges', () => {
  assert.equal(getMeterStatusLabel(10), 'Critical Low');
  assert.equal(getMeterStatusLabel(25), 'Fragile');
  assert.equal(getMeterStatusLabel(50), 'Steady');
  assert.equal(getMeterStatusLabel(75), 'Elevated');
  assert.equal(getMeterStatusLabel(92), 'Critical High');
});

test('createInitialSession starts all 4 meters at 50 and turn 1', () => {
  const world = SEED_WORLDS[0];
  const session = createInitialSession(world);
  assert.equal(session.state, 'PLAYING');
  assert.equal(session.turn, 1);
  assert.equal(session.cardIndex, 0);
  assert.deepEqual(session.meters, {
    cohesion: 50,
    crumbs: 50,
    sympathy: 50,
    crown: 50,
  });
});

test('applyChoice updates meters, turn count, and chronicle history', () => {
  const world = SEED_WORLDS[0];
  const initial = createInitialSession(world);
  const next = applyChoice(initial, world, 'left');

  assert.equal(next.state, 'PLAYING');
  assert.equal(next.turn, 2);
  assert.equal(next.cardIndex, 1);
  assert.equal(next.meters.cohesion, 65);
  assert.equal(next.meters.crumbs, 70);
  assert.equal(next.meters.sympathy, 40);
  assert.equal(next.meters.crown, 35);
  assert.equal(next.history.length, 1);
  assert.equal(next.history[0].choiceSide, 'left');
});

test('applyChoice triggers GAME_OVER when a meter hits 0 or 100', () => {
  const testWorld: WorldDeck = {
    ...SEED_WORLDS[0],
    cards: [
      {
        id: 'collapse-card',
        speaker: 'Test Envoy',
        role: 'Tester',
        prompt: 'Extreme test dilemma.',
        leftChoice: {
          label: 'Crash unity',
          outcome: 'Unity vanished.',
          effects: { cohesion: -50, crumbs: 0, sympathy: 0, crown: 0 },
        },
        rightChoice: {
          label: 'Overflow crumbs',
          outcome: 'Crumbs everywhere.',
          effects: { cohesion: 0, crumbs: 50, sympathy: 0, crown: 0 },
        },
      },
    ],
  };

  const s1 = applyChoice(createInitialSession(testWorld), testWorld, 'left');
  assert.equal(s1.state, 'GAME_OVER');
  assert.equal(s1.ending?.kind, 'collapse');
  assert.equal(s1.ending?.meterId, 'cohesion');

  const s2 = applyChoice(createInitialSession(testWorld), testWorld, 'right');
  assert.equal(s2.state, 'GAME_OVER');
  assert.equal(s2.ending?.kind, 'overflow');
  assert.equal(s2.ending?.meterId, 'crumbs');
});

test('surviving all cards transitions to ROUND_SUMMARY and appending cards resumes play', () => {
  const shortWorld: WorldDeck = {
    ...SEED_WORLDS[0],
    cards: [SEED_WORLDS[0].cards[0]],
  };

  const session = applyChoice(createInitialSession(shortWorld), shortWorld, 'right');
  assert.equal(session.state, 'ROUND_SUMMARY');
  assert.equal(session.ending?.kind, 'survived');

  const extendedWorld = appendCardsToDeck(shortWorld, [SEED_WORLDS[0].cards[1]]);
  assert.equal(extendedWorld.cards.length, 2);

  const resumed = resumeSessionWithNewCards(session, extendedWorld);
  assert.equal(resumed.state, 'PLAYING');
  assert.equal(resumed.cardIndex, 1);
  assert.equal(resumed.turn, 2);
});

test('validateWorldPayload rejects malformed input and normalizes valid AI payloads', () => {
  assert.throws(() => validateWorldPayload({}, '/fallback.jpg'));

  const valid = validateWorldPayload(
    {
      title: 'Toaster Council',
      subtitle: 'Appliance Democracy',
      premise: 'A sentient toaster runs for city council.',
      tone: 'Satire',
      meters: [
        {
          id: 'heat',
          label: 'Heat',
          icon: 'flame',
          lowEndTitle: 'Cold Crumb',
          lowEndText: 'Unplugged forever.',
          highEndTitle: 'Meltdown',
          highEndText: 'Burnt bagels.',
        },
        {
          id: 'votes',
          label: 'Votes',
          icon: 'users',
          lowEndTitle: 'Zero Ballots',
          lowEndText: 'Lost to a blender.',
          highEndTitle: 'Landslide',
          highEndText: 'President of kitchens.',
        },
        {
          id: 'power',
          label: 'Voltage',
          icon: 'sparkles',
          lowEndTitle: 'Blackout',
          lowEndText: 'No juice.',
          highEndTitle: 'Surge',
          highEndText: 'Tripped the grid.',
        },
        {
          id: 'trust',
          label: 'Trust',
          icon: 'shield',
          lowEndTitle: 'Recalled',
          lowEndText: 'Sent to scrap.',
          highEndTitle: 'Worshipped',
          highEndText: 'Too sacred to toast.',
        },
      ],
      cards: [
        {
          id: 'tc-1',
          speaker: 'Mayor Kettle',
          role: 'Incumbent',
          prompt: 'Debate starts in five minutes.',
          leftChoice: {
            label: 'Pop two sourdough slices',
            outcome: 'The crowd cheered.',
            effects: { heat: 10, votes: 15, power: -10, trust: 5 },
          },
          rightChoice: {
            label: 'Deliver a serious fiscal speech',
            outcome: 'Respectable, if dry.',
            effects: { heat: -5, votes: 5, power: 0, trust: 15 },
          },
        },
      ],
      victoryTitle: 'Sworn In',
      victoryText: 'You won the kitchen ward.',
    },
    '/fallback.jpg'
  );

  assert.equal(valid.title, 'Toaster Council');
  assert.equal(valid.source, 'ai');
  assert.equal(valid.cards.length, 1);

  const extra = validateCardsPayload(
    [
      {
        id: 'tc-2',
        speaker: 'Blender Bob',
        role: 'Heckler',
        prompt: 'What about bagels?',
        leftChoice: {
          label: 'Bagel mode engaged',
          outcome: 'Smooth victory.',
          effects: { heat: 5, votes: 10, power: -5, trust: 5 },
        },
        rightChoice: {
          label: 'Ignore the heckler',
          outcome: 'Dignified silence.',
          effects: { heat: -5, votes: -5, power: 5, trust: 10 },
        },
      },
    ],
    valid.meters.map((m) => m.id)
  );
  assert.equal(extra.length, 1);
});
