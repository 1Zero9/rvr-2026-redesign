# Rivervalley Rangers AFC — RVR2026

Production Next.js platform for Rivervalley Rangers AFC. It includes the public club site, team and fixture data, registrations, campaigns, safeguarding workflows, announcements, and role-based administration.

## Local development

Requirements: Node.js 20+ and PostgreSQL 15+.

```bash
npm install
cp .env.example .env.local
npx prisma migrate deploy
npm run dev
```

See [SETUP.md](./SETUP.md) for environment variables, authentication, cron jobs, and season rollover.

## Release checks

```bash
npm run lint
npm run typecheck
npm test
npm run security-audit
npm audit
npm run build
```

The production site is `https://rivervalleyrangers.ie` and the repository remote is `https://github.com/1Zero9/rvr-2026-redesign`.
