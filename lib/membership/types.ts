export type MemberRole = 'parent' | 'coach' | 'mentor';
export type MemberClassification = 'JUVENILE' | 'MINOR' | 'NON_PLAYING_ACTIVE' | 'PARENT';

export interface MemberInput {
  firstName: string;
  lastName: string;
  /** ISO date string YYYY-MM-DD */
  dateOfBirth: string;
  /** Required when the member is an adult (born before 2008) */
  role?: MemberRole;
  /** e.g. "U12 Boys A" */
  teamRegistration?: string;
}

export interface ClassifiedMember {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  birthYear: number;
  classification: MemberClassification;
  teamRegistration: string | undefined;
  /** Individual stand-alone price in euros (0 for PARENT — bundled separately) */
  standaloneEuros: number;
}

export interface PricingBreakdown {
  members: Array<{
    firstName: string;
    lastName: string;
    classification: MemberClassification;
    teamRegistration: string | undefined;
    amountCents: number;
  }>;
  subtotalIndividualCents: number;
  appliedOption: string | null;
  totalAmountCents: number;
  savingsCents: number;
}

export interface CalculateRequest {
  members: MemberInput[];
  /** Where Stripe redirects on successful payment */
  successUrl: string;
  /** Where Stripe redirects if the customer cancels */
  cancelUrl: string;
  /** Primary contact email for the order confirmation */
  contactEmail?: string;
}

export interface CalculateResponse {
  orderId: string;
  stripeCheckoutUrl: string;
  pricing: PricingBreakdown;
}
