'use server';

import { prisma } from '@/lib/prisma';
import { createHash } from 'crypto';

export type PlayerPosition = 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';

export interface RegistrationInput {
  firstName: string;
  lastName: string;
  yearOfBirth: number;
  position: PlayerPosition;
  parentName: string;
  parentEmail: string;
  gdprConsent: boolean;
}

export type RegistrationResult =
  | { ok: true; playerId: string; firstName: string }
  | { ok: false; error: string };

const VALID_POSITIONS: ReadonlySet<string> = new Set([
  'Goalkeeper',
  'Defender',
  'Midfielder',
  'Forward',
]);

// U7–U12 players always have isPrivate locked to true server-side.
// No public or admin endpoint may set isPrivate: false for these age groups.
const YOUTH_LOCK_AGE_MIN = 7;
const YOUTH_LOCK_AGE_MAX = 12;

function isYouthPrivacyLocked(yearOfBirth: number): boolean {
  const age = new Date().getFullYear() - yearOfBirth;
  return age >= YOUTH_LOCK_AGE_MIN && age <= YOUTH_LOCK_AGE_MAX;
}

function buildConsentHash(
  playerDisplayName: string,
  parentName: string,
  parentEmail: string,
  signedAt: Date,
): string {
  return createHash('sha256')
    .update(`${playerDisplayName}|${parentName}|${parentEmail}|${signedAt.toISOString()}`)
    .digest('hex');
}

export async function registerPlayer(
  input: RegistrationInput,
): Promise<RegistrationResult> {
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const parentName = input.parentName.trim();
  const parentEmail = input.parentEmail.trim().toLowerCase();

  if (firstName.length < 2) {
    return { ok: false, error: 'Player first name must be at least 2 characters.' };
  }
  if (lastName.length < 2) {
    return { ok: false, error: 'Player last name must be at least 2 characters.' };
  }
  if (parentName.length < 2) {
    return { ok: false, error: 'Parent or guardian full name is required.' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail)) {
    return { ok: false, error: 'A valid email address is required.' };
  }
  if (!VALID_POSITIONS.has(input.position)) {
    return { ok: false, error: 'Please select a valid playing position.' };
  }

  const yearOfBirth = Math.trunc(input.yearOfBirth);
  const currentYear = new Date().getFullYear();
  if (yearOfBirth < currentYear - 80 || yearOfBirth > currentYear - 4) {
    return { ok: false, error: 'Year of birth is outside the accepted range.' };
  }

  if (!input.gdprConsent) {
    return { ok: false, error: 'GDPR consent is required to complete registration.' };
  }

  const youthLocked = isYouthPrivacyLocked(yearOfBirth);
  const displayName = `${firstName} ${lastName}`;
  const signedAt = new Date();
  const signatureHash = buildConsentHash(displayName, parentName, parentEmail, signedAt);

  try {
    const profile = await prisma.$transaction(async (tx) => {
      const created = await tx.playerProfile.create({
        data: {
          firstName,
          lastName,
          displayName,
          yearOfBirth,
          position: input.position,
          // All new profiles start private.
          // For U7–U12 (youthLocked), this is an explicit enforcement —
          // mutation endpoints must check isYouthPrivacyLocked before allowing changes.
          isPrivate: youthLocked ? true : true,
          dataConsentStatus: 'PENDING',
        },
      });

      await tx.parentConsent.create({
        data: {
          playerProfileId: created.id,
          parentName,
          parentEmail,
          signatureHash,
          photoRelease: input.gdprConsent,
          medicalTreatment: false,
          dataProcessing: input.gdprConsent,
          signedAt,
        },
      });

      return created;
    });

    return { ok: true, playerId: profile.id, firstName };
  } catch (err) {
    console.error('[registerPlayer] database write failed:', err);
    return {
      ok: false,
      error: 'Registration could not be saved. Please try again or contact the club.',
    };
  }
}
