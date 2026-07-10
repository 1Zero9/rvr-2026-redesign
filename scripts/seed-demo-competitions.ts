/**
 * Seeds one DEMO competition per CompetitionType (MINI_LEAGUE, KNOCKOUT,
 * GROUP_KNOCKOUT, BLITZ, FESTIVAL) with venues, teams, generated fixtures,
 * and partial results — so the admin UI and public competition pages can
 * be exercised end-to-end without touching real club data.
 *
 * All rows are flagged isDemo:true, shown with a DEMO badge/banner
 * everywhere they appear, and removable with the quick-delete button on
 * the competitions admin dashboard.
 *
 * Usage:
 *   npx tsx scripts/seed-demo-competitions.ts
 *
 * Safe to run multiple times — wipes any existing isDemo:true competitions
 * (cascades to their venues/teams/fixtures) and recreates them fresh.
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { createId } from '@paralleldrive/cuid2';
import { CompetitionType, TeamTheme, FixtureStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { generateFixtures } from '../lib/competitions/scheduler';
import { getThemeNames } from '../lib/competitions/theme-pools';

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(0, 0, 0, 0);
  return d;
}

function randomScore(): number {
  return Math.floor(Math.random() * 5);
}

interface DemoConfig {
  slug: string;
  name: string;
  type: CompetitionType;
  ageGroup: string;
  teamTheme: TeamTheme;
  teamCount: number;
  dateOffsetDays: number;
  state: 'DRAFT' | 'READY' | 'LIVE' | 'COMPLETE' | 'ARCHIVED';
  /** Which generated fixtures get a result entered. */
  completeSelector: (round: string | null, index: number, total: number) => boolean;
}

const DEMO_CONFIGS: DemoConfig[] = [
  {
    slug: 'demo-mini-league',
    name: 'DEMO — Summer Mini League',
    type: CompetitionType.MINI_LEAGUE,
    ageGroup: 'U12',
    teamTheme: TeamTheme.PREMIER_LEAGUE,
    teamCount: 6,
    dateOffsetDays: 3,
    state: 'LIVE',
    completeSelector: (_r, i, total) => i < Math.floor(total / 2),
  },
  {
    slug: 'demo-knockout-cup',
    name: 'DEMO — Cup Knockout',
    type: CompetitionType.KNOCKOUT,
    ageGroup: 'U14',
    teamTheme: TeamTheme.COUNTRIES,
    teamCount: 8,
    dateOffsetDays: 5,
    state: 'LIVE',
    completeSelector: (round) => round === 'Round 1',
  },
  {
    slug: 'demo-group-knockout',
    name: 'DEMO — Group Festival',
    type: CompetitionType.GROUP_KNOCKOUT,
    ageGroup: 'U10',
    teamTheme: TeamTheme.LOI_CLUBS,
    teamCount: 6,
    dateOffsetDays: 7,
    state: 'LIVE',
    completeSelector: (_r, i, total) => i < Math.floor(total / 2),
  },
  {
    slug: 'demo-blitz',
    name: 'DEMO — Blitz Day',
    type: CompetitionType.BLITZ,
    ageGroup: 'U16',
    teamTheme: TeamTheme.ANIMALS,
    teamCount: 6,
    dateOffsetDays: -2,
    state: 'COMPLETE',
    completeSelector: () => true,
  },
  {
    slug: 'demo-festival',
    name: 'DEMO — Summer Festival',
    type: CompetitionType.FESTIVAL,
    ageGroup: 'U8',
    teamTheme: TeamTheme.COLOURS,
    teamCount: 4,
    dateOffsetDays: 10,
    state: 'READY',
    completeSelector: () => false,
  },
];

async function main() {
  const superAdmin = await prisma.adminUser.findFirst({
    where: { globalRole: 'SUPER_ADMIN' },
    select: { id: true, email: true },
  });
  if (!superAdmin) {
    throw new Error('No SUPER_ADMIN AdminUser found — cannot attribute demo competitions.');
  }

  const wiped = await prisma.competition.deleteMany({ where: { isDemo: true } });
  console.log(`Wiped ${wiped.count} existing demo competition(s).`);

  for (const cfg of DEMO_CONFIGS) {
    const themeNames = getThemeNames(cfg.teamTheme, [], cfg.teamCount);

    const competition = await prisma.competition.create({
      data: {
        slug: cfg.slug,
        publicSlug: cfg.slug,
        name: cfg.name,
        type: cfg.type,
        participantMode: 'TEAMS',
        ageGroup: cfg.ageGroup,
        teamTheme: cfg.teamTheme,
        dates: [daysFromNow(cfg.dateOffsetDays)],
        isPublic: true,
        isDemo: true,
        state: cfg.state,
        createdById: superAdmin.id,
        venues: {
          create: { name: 'Home Ground', pitches: ['Pitch 1', 'Pitch 2'] },
        },
      },
      include: { venues: true },
    });

    const teams = await Promise.all(
      themeNames.map((themeName) =>
        prisma.competitionTeam.create({
          data: { id: createId(), competitionId: competition.id, name: themeName, themeName },
        }),
      ),
    );

    const fixtures = generateFixtures({
      teams,
      competitionType: cfg.type,
      venues: competition.venues,
      startTime: '10:00',
      gameDuration: 20,
      breakDuration: 5,
      dates: [daysFromNow(cfg.dateOffsetDays)],
    });

    await prisma.fixture.createMany({
      data: fixtures.map((f) => ({
        id: createId(),
        competitionId: competition.id,
        homeTeamId: f.homeTeamId,
        awayTeamId: f.awayTeamId,
        venueName: f.venueName,
        pitchLabel: f.pitchLabel,
        scheduledAt: f.scheduledAt,
        duration: f.duration,
        round: f.round,
      })),
    });

    const created = await prisma.fixture.findMany({
      where: { competitionId: competition.id },
      orderBy: { scheduledAt: 'asc' },
    });

    let completedCount = 0;
    for (const [i, fixture] of created.entries()) {
      if (cfg.completeSelector(fixture.round, i, created.length)) {
        await prisma.fixture.update({
          where: { id: fixture.id },
          data: {
            status: FixtureStatus.COMPLETE,
            homeScore: randomScore(),
            awayScore: randomScore(),
            resultEnteredAt: new Date(),
            resultEnteredById: superAdmin.id,
          },
        });
        completedCount++;
      }
    }

    console.log(
      `Created "${competition.name}" (${cfg.type}): ${teams.length} teams, ${created.length} fixtures, ${completedCount} completed.`,
    );
  }

  console.log('Done.');
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
