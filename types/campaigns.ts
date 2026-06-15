export type CurrencyCode = "EUR" | "GBP" | "USD";

export type KitSubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface KitSubmission {
  id: string;
  designerName: string;
  teamName: string;
  imageUrl: string;
  votesCount: number;
  isApproved: boolean;
  createdAt: string;
}

export interface KitSubmissionFormValues {
  designerName: string;
  teamName: string;
  designFile: FileList;
}

export interface KitVoteResponse {
  submissionId: string;
  votesCount: number;
  alreadyVoted?: boolean;
}

export interface KitDesignSubmission {
  id: string;
  competitionId: string;
  designerName: string;
  designerAge?: number;
  title: string;
  story?: string;
  fileUrl: string;
  fileMimeType: string;
  thumbnailUrl?: string;
  status: KitSubmissionStatus;
  voteCount: number;
  createdAt: string;
}

export interface KitCompetition {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  templatePdfUrl: string;
  votingOpen: boolean;
  submissionDeadline?: string;
  submissions: KitDesignSubmission[];
}

export interface KitTemplateDownloadLead {
  guardianName: string;
  email: string;
  playerAgeGroup?: string;
  consentToUpdates: boolean;
}

export interface KitDesignUploadDraft {
  designerName: string;
  designerAge?: number;
  guardianName?: string;
  email: string;
  title: string;
  story?: string;
  file?: File;
}

export type DonationProvider = "SPOTFUND" | "PITCHIN" | "MANUAL";

export interface DonationMeter {
  provider: DonationProvider;
  campaignUrl?: string;
  targetAmountCents: number;
  raisedAmountCents: number;
  donorCount?: number;
  lastSyncedAt?: string;
}

export interface FunRunMerchItem {
  id: string;
  name: string;
  description?: string;
  priceCents: number;
  stockQuantity?: number;
  active: boolean;
}

export interface FunRunParticipantInfo {
  participantFirstName: string;
  participantLastName: string;
  participantAge: string;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalNotes: string;
  consentToPhotography: boolean;
  marketingConsent: boolean;
}

export interface FunRunMerchSelection {
  merchItemId: string;
  quantity: number;
}

export interface FunRunRegistrationDraft {
  participant: FunRunParticipantInfo;
  merchSelections: FunRunMerchSelection[];
}

export interface StripeCheckoutRequest {
  campaignId: string;
  registration: FunRunRegistrationDraft;
  successUrl: string;
  cancelUrl: string;
}

export interface StripeCheckoutResponse {
  sessionId: string;
  checkoutUrl: string;
}

export interface FunRunCampaign {
  id: string;
  slug: string;
  title: string;
  dateLabel: string;
  locationLabel: string;
  registrationFeeCents: number;
  targetAmountCents: number;
  raisedAmountCents: number;
  provider: DonationProvider;
  providerCampaignUrl?: string;
  merchItems: FunRunMerchItem[];
}

export interface LottoDrawResult {
  id: string;
  drawDate: string;
  numbers: number[];
  bonusNumber?: number;
  winnerSummary?: string;
  jackpotCents: number;
}

export interface LottoWidgetData {
  jackpotCents: number;
  currency: CurrencyCode;
  nextDrawLabel: string;
  providerName: "Clubforce" | "Local Lotto" | string;
  providerUrl: string;
  recentResults: LottoDrawResult[];
}
