import assert from 'node:assert/strict';
import test from 'node:test';
import { CompetitionType } from '@prisma/client';
import { generateFixtures } from '../lib/competitions/scheduler';

test('round-robin scheduling uses every configured event date', () => {
  const fixtures = generateFixtures({
    teams: ['a', 'b', 'c', 'd'].map((id) => ({ id })),
    competitionType: CompetitionType.MINI_LEAGUE,
    venues: [{ name: 'Rivervalley', pitches: ['Pitch 1'] }],
    dates: [new Date('2026-07-11T00:00:00Z'), new Date('2026-07-12T00:00:00Z')],
    startTime: '09:00',
    gameDuration: 20,
    breakDuration: 5,
  });

  assert.equal(fixtures.length, 6);
  const perDay = fixtures.reduce<Record<string, number>>((counts, fixture) => {
    const day = fixture.scheduledAt.toISOString().slice(0, 10);
    counts[day] = (counts[day] ?? 0) + 1;
    return counts;
  }, {});
  assert.deepEqual(perDay, { '2026-07-11': 3, '2026-07-12': 3 });
  assert.ok(fixtures.every((fixture) => fixture.venueName === 'Rivervalley'));
});

test('scheduler falls back to a main pitch when no venues are configured', () => {
  const [fixture] = generateFixtures({
    teams: [{ id: 'a' }, { id: 'b' }],
    competitionType: CompetitionType.BLITZ,
    venues: [],
    dates: [new Date('2026-07-11T00:00:00Z')],
    startTime: '10:30',
    gameDuration: 15,
    breakDuration: 5,
  });

  assert.equal(fixture.venueName, 'Main Pitch');
  assert.equal(fixture.pitchLabel, null);
});
