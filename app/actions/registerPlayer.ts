'use server';

import { prisma } from '@/lib/prisma';
import { createHash } from 'crypto';

export type PlayerGender = 'MALE' | 'FEMALE';

export interface RegistrationInput {
  firstName:   string;
  lastName:    string;
  yearOfBirth: number;
  gender:      PlayerGender;
  parentName:  string;
  parentEmail: string;
  parentPhone: string;
  notes:       string;
  gdprConsent: boolean;
}

export type RegistrationResult =
  | { ok: true; playerId: string; firstName: string }
  | { ok: false; error: string };

const CURRENT_YEAR = new Date().getFullYear();

function isValidYear(y: number) {
  return y >= CURRENT_YEAR - 80 && y <= CURRENT_YEAR - 4;
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
  const firstName   = input.firstName.trim();
  const lastName    = input.lastName.trim();
  const parentName  = input.parentName.trim();
  const parentEmail = input.parentEmail.trim().toLowerCase();
  const parentPhone = input.parentPhone.trim();
  const notes       = input.notes.trim();

  if (firstName.length < 2)
    return { ok: false, error: 'Player first name must be at least 2 characters.' };
  if (lastName.length < 2)
    return { ok: false, error: 'Player last name must be at least 2 characters.' };
  if (!isValidYear(Math.trunc(input.yearOfBirth)))
    return { ok: false, error: 'Year of birth is outside the accepted range.' };
  if (!['MALE', 'FEMALE'].includes(input.gender))
    return { ok: false, error: 'Please select Boys or Girls.' };
  if (parentName.length < 2)
    return { ok: false, error: 'Parent or guardian full name is required.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail))
    return { ok: false, error: 'A valid email address is required.' };
  if (parentPhone.length < 7)
    return { ok: false, error: 'A valid phone number is required.' };
  if (!input.gdprConsent)
    return { ok: false, error: 'Consent is required to submit.' };

  const yearOfBirth   = Math.trunc(input.yearOfBirth);
  const displayName   = `${firstName} ${lastName}`;
  const signedAt      = new Date();
  const signatureHash = buildConsentHash(displayName, parentName, parentEmail, signedAt);

  try {
    const profile = await prisma.$transaction(async (tx) => {
      const created = await tx.playerProfile.create({
        data: {
          firstName,
          lastName,
          displayName,
          yearOfBirth,
          gender:             input.gender,
          notes:              notes || null,
          registrationStatus: 'NEW',
          isPrivate:          true,
          dataConsentStatus:  'PENDING',
        },
      });

      await tx.parentConsent.create({
        data: {
          playerProfileId: created.id,
          parentName,
          parentEmail,
          parentPhone:     parentPhone || null,
          signatureHash,
          photoRelease:    input.gdprConsent,
          medicalTreatment: false,
          dataProcessing:  input.gdprConsent,
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
