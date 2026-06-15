import type { ClassifiedMember, MemberClassification, MemberInput, PricingBreakdown } from './types';

const CURRENT_YEAR = new Date().getFullYear();

const STANDALONE_EUROS: Record<MemberClassification, number> = {
  JUVENILE: 250,
  MINOR: 250,
  NON_PLAYING_ACTIVE: 140,
  PARENT: 250, // individual rate when no bundle applies
};

/**
 * Bundle options sorted by descending coverage so the algorithm always
 * tries the most generous bundle first (fast exit once minimum is found).
 */
const BUNDLE_OPTIONS = [
  { requiredParents: 2, requiredChildren: 2, price: 475, coversAllChildren: true,  label: 'Option 6: 2 Parents + 2+ Children (€475)' },
  { requiredParents: 1, requiredChildren: 4, price: 475, coversAllChildren: true,  label: 'Option 4: 1 Parent + 4+ Children (€475)' },
  { requiredParents: 2, requiredChildren: 1, price: 395, coversAllChildren: false, label: 'Option 5: 2 Parents + 1 Child (€395)'     },
  { requiredParents: 1, requiredChildren: 3, price: 415, coversAllChildren: false, label: 'Option 3: 1 Parent + 3 Children (€415)'   },
  { requiredParents: 1, requiredChildren: 2, price: 355, coversAllChildren: false, label: 'Option 2: 1 Parent + 2 Children (€355)'   },
  { requiredParents: 1, requiredChildren: 1, price: 275, coversAllChildren: false, label: 'Option 1: 1 Parent + 1 Child (€275)'      },
] as const;

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export interface ValidationError {
  field: string;
  message: string;
}

function validateString(value: unknown, field: string, maxLen = 100): ValidationError | null {
  if (typeof value !== 'string' || value.trim().length === 0)
    return { field, message: `${field} must be a non-empty string` };
  if (value.trim().length > maxLen)
    return { field, message: `${field} must be ${maxLen} characters or fewer` };
  return null;
}

function parseDateOfBirth(raw: unknown, field: string): { date: Date; year: number } | ValidationError {
  const err = validateString(raw, field, 10);
  if (err) return err;

  const str = (raw as string).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str))
    return { field, message: `${field} must be in YYYY-MM-DD format` };

  const parsed = new Date(`${str}T00:00:00.000Z`);
  if (isNaN(parsed.getTime()))
    return { field, message: `${field} is not a valid date` };

  const year = parseInt(str.slice(0, 4), 10);
  if (year < 1930)
    return { field, message: `${field}: birth year ${year} is not valid (minimum 1930)` };
  if (year > CURRENT_YEAR)
    return { field, message: `${field}: birth year ${year} cannot be in the future` };

  return { date: parsed, year };
}

function classifyMember(
  birthYear: number,
  role: string | undefined,
  index: number,
): MemberClassification | ValidationError {
  if (birthYear >= 2010 && birthYear <= 2019) return 'JUVENILE';
  if (birthYear === 2008 || birthYear === 2009) return 'MINOR';

  if (birthYear < 2008) {
    if (!role)
      return {
        field: `members[${index}].role`,
        message: `role is required for adult members (born before 2008) — must be "parent", "coach", or "mentor"`,
      };
    const r = role.toLowerCase();
    if (r === 'coach' || r === 'mentor') return 'NON_PLAYING_ACTIVE';
    if (r === 'parent') return 'PARENT';
    return {
      field: `members[${index}].role`,
      message: `role "${role}" is not valid — must be "parent", "coach", or "mentor"`,
    };
  }

  // Born 2020 or later (year > 2019 and ≤ CURRENT_YEAR)
  return {
    field: `members[${index}].dateOfBirth`,
    message: `Birth year ${birthYear} does not map to a supported membership tier (supported: 2008–2019 for children, pre-2008 for adults)`,
  };
}

export function validateAndClassifyMembers(
  raw: unknown,
): { members: ClassifiedMember[] } | { errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!Array.isArray(raw)) {
    return { errors: [{ field: 'members', message: 'members must be an array' }] };
  }
  if (raw.length === 0) {
    return { errors: [{ field: 'members', message: 'members array must not be empty' }] };
  }
  if (raw.length > 20) {
    return { errors: [{ field: 'members', message: 'members array cannot exceed 20 entries' }] };
  }

  const classified: ClassifiedMember[] = [];

  for (let i = 0; i < raw.length; i++) {
    const item = raw[i] as MemberInput;
    const prefix = `members[${i}]`;

    const fnErr = validateString(item?.firstName, `${prefix}.firstName`);
    if (fnErr) errors.push(fnErr);

    const lnErr = validateString(item?.lastName, `${prefix}.lastName`);
    if (lnErr) errors.push(lnErr);

    const dobResult = parseDateOfBirth(item?.dateOfBirth, `${prefix}.dateOfBirth`);
    if ('field' in dobResult) {
      errors.push(dobResult);
      continue;
    }

    if (item?.teamRegistration !== undefined) {
      const trErr = validateString(item.teamRegistration, `${prefix}.teamRegistration`, 100);
      if (trErr) errors.push(trErr);
    }

    const classResult = classifyMember(dobResult.year, item?.role, i);
    if (typeof classResult === 'object' && 'field' in classResult) {
      errors.push(classResult);
      continue;
    }

    if (fnErr || lnErr) continue;

    classified.push({
      firstName: item.firstName.trim(),
      lastName: item.lastName.trim(),
      dateOfBirth: dobResult.date,
      birthYear: dobResult.year,
      classification: classResult,
      teamRegistration: item.teamRegistration?.trim() || undefined,
      standaloneEuros: STANDALONE_EUROS[classResult],
    });
  }

  if (errors.length > 0) return { errors };
  return { members: classified };
}

// ---------------------------------------------------------------------------
// Pricing engine
// ---------------------------------------------------------------------------

function optimalFamilyBundle(
  parentCount: number,
  childCount: number,
): { totalEuros: number; appliedOption: string | null } {
  const PARENT_RATE = STANDALONE_EUROS.PARENT;
  const CHILD_RATE = STANDALONE_EUROS.JUVENILE; // both JUVENILE and MINOR are €250

  let best = {
    totalEuros: parentCount * PARENT_RATE + childCount * CHILD_RATE,
    appliedOption: null as string | null,
  };

  if (parentCount === 0) return best;

  for (const opt of BUNDLE_OPTIONS) {
    if (parentCount < opt.requiredParents || childCount < opt.requiredChildren) continue;

    const extraParents = parentCount - opt.requiredParents;
    const extraChildren = opt.coversAllChildren ? 0 : childCount - opt.requiredChildren;
    const total = opt.price + extraParents * PARENT_RATE + extraChildren * CHILD_RATE;

    if (total < best.totalEuros) {
      best = { totalEuros: total, appliedOption: opt.label };
    }
  }

  return best;
}

export function calculatePricing(members: ClassifiedMember[]): PricingBreakdown {
  const parents = members.filter((m) => m.classification === 'PARENT');
  const children = members.filter(
    (m) => m.classification === 'JUVENILE' || m.classification === 'MINOR',
  );
  const individual = members.filter(
    (m) => m.classification === 'NON_PLAYING_ACTIVE',
  );

  const individualTotal = individual.reduce((sum, m) => sum + m.standaloneEuros, 0);
  const subtotalIndividual = members.reduce((sum, m) => sum + m.standaloneEuros, 0);

  const { totalEuros: familyTotal, appliedOption } = optimalFamilyBundle(
    parents.length,
    children.length,
  );

  const totalAmountCents = (individualTotal + familyTotal) * 100;
  const savingsCents = subtotalIndividual * 100 - totalAmountCents;

  // Build per-member amounts for the DB row. Under a bundle, pro-rate the
  // bundle price evenly across bundled members so each row sums to the total.
  const bundledCount = parents.length + children.length;
  const perBundledMemberCents =
    bundledCount > 0 ? Math.round((familyTotal * 100) / bundledCount) : 0;

  const breakdown: PricingBreakdown['members'] = [
    ...individual.map((m) => ({
      firstName: m.firstName,
      lastName: m.lastName,
      classification: m.classification,
      teamRegistration: m.teamRegistration,
      amountCents: m.standaloneEuros * 100,
    })),
    ...parents.map((m) => ({
      firstName: m.firstName,
      lastName: m.lastName,
      classification: m.classification,
      teamRegistration: m.teamRegistration,
      amountCents: perBundledMemberCents,
    })),
    ...children.map((m) => ({
      firstName: m.firstName,
      lastName: m.lastName,
      classification: m.classification,
      teamRegistration: m.teamRegistration,
      amountCents: perBundledMemberCents,
    })),
  ];

  return {
    members: breakdown,
    subtotalIndividualCents: subtotalIndividual * 100,
    appliedOption,
    totalAmountCents,
    savingsCents: Math.max(0, savingsCents),
  };
}
