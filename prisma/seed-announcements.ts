#!/usr/bin/env tsx

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required to seed announcements.");
  }
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });
}

const announcements = [
  {
    title: "RVR Awarded FAI Club Mark",
    category: "NEWS" as const,
    body: `Rivervalley Rangers AFC has been awarded the FAI Club Mark, recognising the club's high standards in player welfare, coach development, and community football.\n\nThe Club Mark programme, supported by Circle K, is the FAI's quality assurance mark for football clubs across Ireland. Achieving this accreditation reflects the hard work and dedication of our coaches, volunteers, and committee over many years.\n\nWe're proud to carry this mark into the 2025/26 season and beyond.`,
    isPublished: true,
    pinned: false,
  },
  {
    title: "Ladies Football Fit — New Term Starting",
    category: "RECRUITMENT" as const,
    body: `Our Ladies Football Fit programme is back — a fun, friendly session designed to help ladies get fit and learn the basics of football in a welcoming environment.\n\nNo experience needed. All ages and abilities welcome. Sessions are kept small and focused so everyone gets plenty of touches and plenty of laughs.\n\n**When:** Every Tuesday at 8pm\n**Where:** Small Astro, Rivervalley\n**Cost:** €5 per session\n\nPre-booking is required — drop us an enquiry to secure your spot.`,
    isPublished: true,
    pinned: false,
  },
  {
    title: "Walking Football — New Players Welcome Every Monday",
    category: "RECRUITMENT" as const,
    body: `Walking Football at Rivervalley Rangers is growing — and we want more players to join us every Monday night.\n\nIt's the real game, played at walking pace. Improve your health and mobility, meet new people, stay socially connected, and enjoy the fun and teamwork of football in a low-impact, joint-friendly way.\n\n**When:** Every Monday night, 8–9pm\n**Where:** Rivervalley Astro, Swords\n**Cost:** €5 per week\n\nAll adults welcome — no experience necessary. Just show up and get involved.`,
    isPublished: true,
    pinned: false,
  },
  {
    title: "Football For All — Under 12 Girls Wanted",
    category: "RECRUITMENT" as const,
    body: `Our Football For All programme runs every Saturday at 2:30pm at Rivervalley Community Centre — fun and friendly sessions for girls and boys of all abilities.\n\nWe are currently looking for new players in our Under 12 Girls group. If your daughter is looking to try football in a welcoming, no-pressure environment, this is the perfect place to start.\n\n**When:** Every Saturday at 2:30pm\n**Where:** Rivervalley Community Centre\n\nGirls and boys of all abilities and backgrounds are welcome. Come along and give it a try!`,
    isPublished: true,
    pinned: false,
  },
  {
    title: "Rivervalley Rangers Academy Returns",
    category: "NEWS" as const,
    body: `The Rivervalley Rangers Academy is back — and we can't wait to welcome players for the new season.\n\nWith over 20 years of academy football behind us, our programme offers a structured pathway from grassroots into competitive football. Our dedicated coaches place a strong emphasis on fun and learning, helping players build confidence, social skills, and a love of the game.\n\nThe Academy is FAI Club Mark accredited and operates with fully vetted, committed coaches at every age group.\n\nRegistration is open — don't miss your place for the new season.`,
    isPublished: true,
    pinned: false,
    ctaLabel: "Register Now",
    ctaUrl: "/register",
  },
];

async function seedAnnouncements() {
  const prisma = createPrismaClient();

  try {
    let created = 0;
    for (const data of announcements) {
      await prisma.announcement.create({ data });
      created++;
    }
    console.log(`Announcements seed completed. Created ${created} announcements.`);
  } finally {
    await prisma.$disconnect();
  }
}

seedAnnouncements().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown seed error.";
  console.error(`Announcements seed failed: ${message}`);
  process.exit(1);
});
