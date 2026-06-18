-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."AlertStatus" AS ENUM ('PENDING', 'EMAIL_SENT', 'ACKNOWLEDGED', 'RESOLVED');

-- CreateEnum
CREATE TYPE "public"."ClothingSize" AS ENUM ('CHILD_SMALL', 'CHILD_MEDIUM', 'CHILD_LARGE', 'ADULT_SMALL', 'ADULT_MEDIUM', 'ADULT_LARGE', 'ADULT_EXTRA_LARGE');

-- CreateEnum
CREATE TYPE "public"."ComplianceAlertType" AS ENUM ('VETTING_EXPIRED', 'VETTING_EXPIRING_SOON', 'SAFEGUARDING_1_MISSING', 'SAFEGUARDING_1_OUTDATED');

-- CreateEnum
CREATE TYPE "public"."ConsentStatus" AS ENUM ('NOT_REQUESTED', 'PENDING', 'SIGNED', 'REVOKED');

-- CreateEnum
CREATE TYPE "public"."FundraisingCampaignType" AS ENUM ('KIT_DESIGN', 'FUN_RUN', 'LOTTO', 'DONATION');

-- CreateEnum
CREATE TYPE "public"."MemberClassification" AS ENUM ('JUVENILE', 'MINOR', 'NON_PLAYING_ACTIVE', 'PARENT');

-- CreateEnum
CREATE TYPE "public"."MembershipOrderStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "public"."ModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "public"."StaffRole" AS ENUM ('COACH', 'MENTOR', 'TEAM_MANAGER', 'WELFARE_OFFICER', 'COMMITTEE_MEMBER', 'VOLUNTEER');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('OPEN', 'PAID', 'PAST_DUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."VettingStatus" AS ENUM ('PENDING', 'APPROVED', 'EXPIRED');

-- CreateTable
CREATE TABLE "public"."ClubWelfareContact" (
    "id" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "vettingStatus" "public"."VettingStatus" NOT NULL DEFAULT 'PENDING',
    "safeguardingTrainingAt" TIMESTAMP(3),
    "policyOwner" BOOLEAN NOT NULL DEFAULT false,
    "publicContact" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubWelfareContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CoachProfile" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "teamName" TEXT,
    "qualificationLevel" TEXT,
    "vettingStatus" "public"."VettingStatus" NOT NULL DEFAULT 'PENDING',
    "vettingSubmittedAt" TIMESTAMP(3),
    "vettingApprovedAt" TIMESTAMP(3),
    "vettingExpiresAt" TIMESTAMP(3),
    "safeguardingTrainingAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoachProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ComplianceAlert" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "alertType" "public"."ComplianceAlertType" NOT NULL,
    "status" "public"."AlertStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "emailSentAt" TIMESTAMP(3),
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComplianceAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ComplianceCheck" (
    "id" TEXT NOT NULL,
    "coachProfileId" TEXT,
    "welfareContactId" TEXT,
    "checkName" TEXT NOT NULL,
    "status" "public"."VettingStatus" NOT NULL DEFAULT 'PENDING',
    "dueAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComplianceCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Donation" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "donorName" TEXT,
    "donorEmail" TEXT,
    "amountCents" INTEGER NOT NULL,
    "message" TEXT,
    "paymentStatus" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FunRunRegistration" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "participantName" TEXT NOT NULL,
    "participantAge" INTEGER NOT NULL,
    "guardianName" TEXT NOT NULL,
    "guardianEmail" TEXT NOT NULL,
    "guardianPhone" TEXT NOT NULL,
    "clothingSize" "public"."ClothingSize",
    "powderPackQuantity" INTEGER NOT NULL DEFAULT 0,
    "sunglassesQuantity" INTEGER NOT NULL DEFAULT 0,
    "totalAmountCents" INTEGER NOT NULL,
    "paymentStatus" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FunRunRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FundraisingCampaign" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "campaignType" "public"."FundraisingCampaignType" NOT NULL,
    "targetAmountCents" INTEGER NOT NULL,
    "raisedAmountCents" INTEGER NOT NULL DEFAULT 0,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FundraisingCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HistoricalStanding" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "divisionName" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "teamName" TEXT NOT NULL,
    "played" INTEGER NOT NULL,
    "won" INTEGER NOT NULL,
    "drawn" INTEGER NOT NULL,
    "lost" INTEGER NOT NULL,
    "goalsFor" INTEGER NOT NULL,
    "goalsAgainst" INTEGER NOT NULL,
    "goalDifference" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistoricalStanding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."KitDesignSubmission" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "submitterName" TEXT NOT NULL,
    "submitterEmail" TEXT NOT NULL,
    "teamName" TEXT,
    "designFileUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "moderationStatus" "public"."ModerationStatus" NOT NULL DEFAULT 'PENDING',
    "voteCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KitDesignSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."KitDesignVote" (
    "id" TEXT NOT NULL,
    "kitDesignSubmissionId" TEXT NOT NULL,
    "voterFingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KitDesignVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."KitSubmission" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT,
    "votesCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KitSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LottoDraw" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "drawDate" TIMESTAMP(3) NOT NULL,
    "jackpotCents" INTEGER NOT NULL,
    "winningNumbers" INTEGER[],
    "bonusNumber" INTEGER,
    "winnerSummary" TEXT,
    "providerName" TEXT NOT NULL,
    "providerUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LottoDraw_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MembershipMember" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "classification" "public"."MemberClassification" NOT NULL,
    "teamRegistration" TEXT,
    "amountCents" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MembershipMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MembershipOrder" (
    "id" TEXT NOT NULL,
    "status" "public"."MembershipOrderStatus" NOT NULL DEFAULT 'PENDING',
    "totalAmountCents" INTEGER NOT NULL,
    "appliedOption" TEXT,
    "contactEmail" TEXT,
    "stripeCheckoutSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "subscriptionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MembershipOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ParentConsent" (
    "id" TEXT NOT NULL,
    "playerProfileId" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
    "parentEmail" TEXT NOT NULL,
    "signatureHash" TEXT NOT NULL,
    "photoRelease" BOOLEAN NOT NULL DEFAULT false,
    "medicalTreatment" BOOLEAN NOT NULL DEFAULT false,
    "dataProcessing" BOOLEAN NOT NULL DEFAULT false,
    "signedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "ParentConsent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlayerProfile" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "yearOfBirth" INTEGER NOT NULL,
    "teamName" TEXT,
    "position" TEXT,
    "profileSummary" TEXT,
    "cardImageUrl" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "photoConsentStatus" "public"."ConsentStatus" NOT NULL DEFAULT 'NOT_REQUESTED',
    "medicalConsentStatus" "public"."ConsentStatus" NOT NULL DEFAULT 'NOT_REQUESTED',
    "dataConsentStatus" "public"."ConsentStatus" NOT NULL DEFAULT 'NOT_REQUESTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Season" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StaffMember" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "public"."StaffRole" NOT NULL DEFAULT 'COACH',
    "faiCometId" TEXT,
    "isGardaVetted" BOOLEAN NOT NULL DEFAULT false,
    "isVettingExpired" BOOLEAN NOT NULL DEFAULT false,
    "gardaVettingApprovedAt" TIMESTAMP(3),
    "safeguarding1CompletedAt" TIMESTAMP(3),
    "isSafeguarding1Current" BOOLEAN NOT NULL DEFAULT false,
    "isClubMarkCompliant" BOOLEAN NOT NULL DEFAULT false,
    "isActivelyCoaching" BOOLEAN NOT NULL DEFAULT true,
    "lastComplianceCheckedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StripeSubscription" (
    "id" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "status" "public"."SubscriptionStatus" NOT NULL DEFAULT 'OPEN',
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "billingEmail" TEXT NOT NULL,
    "billingName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TeamAssignment" (
    "id" TEXT NOT NULL,
    "staffMemberId" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TermsAcceptance" (
    "id" TEXT NOT NULL,
    "submissionType" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "submitterName" TEXT NOT NULL,
    "submitterEmail" TEXT NOT NULL,
    "termsVersion" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TermsAcceptance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VoteRecord" (
    "id" TEXT NOT NULL,
    "kitSubmissionId" TEXT NOT NULL,
    "voterFingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VoteRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClubWelfareContact_publicContact_isActive_idx" ON "public"."ClubWelfareContact"("publicContact" ASC, "isActive" ASC);

-- CreateIndex
CREATE INDEX "ClubWelfareContact_roleTitle_idx" ON "public"."ClubWelfareContact"("roleTitle" ASC);

-- CreateIndex
CREATE INDEX "ClubWelfareContact_vettingStatus_idx" ON "public"."ClubWelfareContact"("vettingStatus" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "CoachProfile_email_key" ON "public"."CoachProfile"("email" ASC);

-- CreateIndex
CREATE INDEX "CoachProfile_isActive_idx" ON "public"."CoachProfile"("isActive" ASC);

-- CreateIndex
CREATE INDEX "CoachProfile_lastName_firstName_idx" ON "public"."CoachProfile"("lastName" ASC, "firstName" ASC);

-- CreateIndex
CREATE INDEX "CoachProfile_teamName_idx" ON "public"."CoachProfile"("teamName" ASC);

-- CreateIndex
CREATE INDEX "CoachProfile_vettingStatus_idx" ON "public"."CoachProfile"("vettingStatus" ASC);

-- CreateIndex
CREATE INDEX "ComplianceAlert_staffId_alertType_status_idx" ON "public"."ComplianceAlert"("staffId" ASC, "alertType" ASC, "status" ASC);

-- CreateIndex
CREATE INDEX "ComplianceAlert_status_triggeredAt_idx" ON "public"."ComplianceAlert"("status" ASC, "triggeredAt" ASC);

-- CreateIndex
CREATE INDEX "ComplianceCheck_coachProfileId_status_idx" ON "public"."ComplianceCheck"("coachProfileId" ASC, "status" ASC);

-- CreateIndex
CREATE INDEX "ComplianceCheck_status_dueAt_idx" ON "public"."ComplianceCheck"("status" ASC, "dueAt" ASC);

-- CreateIndex
CREATE INDEX "ComplianceCheck_welfareContactId_status_idx" ON "public"."ComplianceCheck"("welfareContactId" ASC, "status" ASC);

-- CreateIndex
CREATE INDEX "Donation_campaignId_paymentStatus_idx" ON "public"."Donation"("campaignId" ASC, "paymentStatus" ASC);

-- CreateIndex
CREATE INDEX "Donation_donorEmail_idx" ON "public"."Donation"("donorEmail" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Donation_paymentReference_key" ON "public"."Donation"("paymentReference" ASC);

-- CreateIndex
CREATE INDEX "FunRunRegistration_campaignId_paymentStatus_idx" ON "public"."FunRunRegistration"("campaignId" ASC, "paymentStatus" ASC);

-- CreateIndex
CREATE INDEX "FunRunRegistration_guardianEmail_idx" ON "public"."FunRunRegistration"("guardianEmail" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "FunRunRegistration_paymentReference_key" ON "public"."FunRunRegistration"("paymentReference" ASC);

-- CreateIndex
CREATE INDEX "FundraisingCampaign_campaignType_isActive_idx" ON "public"."FundraisingCampaign"("campaignType" ASC, "isActive" ASC);

-- CreateIndex
CREATE INDEX "FundraisingCampaign_slug_idx" ON "public"."FundraisingCampaign"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "FundraisingCampaign_slug_key" ON "public"."FundraisingCampaign"("slug" ASC);

-- CreateIndex
CREATE INDEX "HistoricalStanding_seasonId_divisionName_idx" ON "public"."HistoricalStanding"("seasonId" ASC, "divisionName" ASC);

-- CreateIndex
CREATE INDEX "HistoricalStanding_seasonId_divisionName_position_idx" ON "public"."HistoricalStanding"("seasonId" ASC, "divisionName" ASC, "position" ASC);

-- CreateIndex
CREATE INDEX "HistoricalStanding_teamName_idx" ON "public"."HistoricalStanding"("teamName" ASC);

-- CreateIndex
CREATE INDEX "KitDesignSubmission_campaignId_moderationStatus_idx" ON "public"."KitDesignSubmission"("campaignId" ASC, "moderationStatus" ASC);

-- CreateIndex
CREATE INDEX "KitDesignSubmission_voteCount_idx" ON "public"."KitDesignSubmission"("voteCount" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "KitDesignVote_kitDesignSubmissionId_voterFingerprint_key" ON "public"."KitDesignVote"("kitDesignSubmissionId" ASC, "voterFingerprint" ASC);

-- CreateIndex
CREATE INDEX "KitDesignVote_voterFingerprint_idx" ON "public"."KitDesignVote"("voterFingerprint" ASC);

-- CreateIndex
CREATE INDEX "KitSubmission_votesCount_idx" ON "public"."KitSubmission"("votesCount" ASC);

-- CreateIndex
CREATE INDEX "LottoDraw_campaignId_drawDate_idx" ON "public"."LottoDraw"("campaignId" ASC, "drawDate" ASC);

-- CreateIndex
CREATE INDEX "MembershipMember_orderId_idx" ON "public"."MembershipMember"("orderId" ASC);

-- CreateIndex
CREATE INDEX "MembershipOrder_contactEmail_idx" ON "public"."MembershipOrder"("contactEmail" ASC);

-- CreateIndex
CREATE INDEX "MembershipOrder_status_idx" ON "public"."MembershipOrder"("status" ASC);

-- CreateIndex
CREATE INDEX "MembershipOrder_stripeCheckoutSessionId_idx" ON "public"."MembershipOrder"("stripeCheckoutSessionId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "MembershipOrder_stripeCheckoutSessionId_key" ON "public"."MembershipOrder"("stripeCheckoutSessionId" ASC);

-- CreateIndex
CREATE INDEX "MembershipOrder_subscriptionId_idx" ON "public"."MembershipOrder"("subscriptionId" ASC);

-- CreateIndex
CREATE INDEX "ParentConsent_parentEmail_idx" ON "public"."ParentConsent"("parentEmail" ASC);

-- CreateIndex
CREATE INDEX "ParentConsent_playerProfileId_signedAt_idx" ON "public"."ParentConsent"("playerProfileId" ASC, "signedAt" ASC);

-- CreateIndex
CREATE INDEX "PlayerProfile_isPrivate_idx" ON "public"."PlayerProfile"("isPrivate" ASC);

-- CreateIndex
CREATE INDEX "PlayerProfile_lastName_firstName_idx" ON "public"."PlayerProfile"("lastName" ASC, "firstName" ASC);

-- CreateIndex
CREATE INDEX "PlayerProfile_photoConsentStatus_dataConsentStatus_idx" ON "public"."PlayerProfile"("photoConsentStatus" ASC, "dataConsentStatus" ASC);

-- CreateIndex
CREATE INDEX "PlayerProfile_teamName_idx" ON "public"."PlayerProfile"("teamName" ASC);

-- CreateIndex
CREATE INDEX "Season_isActive_idx" ON "public"."Season"("isActive" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Season_label_key" ON "public"."Season"("label" ASC);

-- CreateIndex
CREATE INDEX "StaffMember_email_idx" ON "public"."StaffMember"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "StaffMember_email_key" ON "public"."StaffMember"("email" ASC);

-- CreateIndex
CREATE INDEX "StaffMember_isActivelyCoaching_isClubMarkCompliant_idx" ON "public"."StaffMember"("isActivelyCoaching" ASC, "isClubMarkCompliant" ASC);

-- CreateIndex
CREATE INDEX "StaffMember_lastName_firstName_idx" ON "public"."StaffMember"("lastName" ASC, "firstName" ASC);

-- CreateIndex
CREATE INDEX "StripeSubscription_billingEmail_idx" ON "public"."StripeSubscription"("billingEmail" ASC);

-- CreateIndex
CREATE INDEX "StripeSubscription_status_currentPeriodEnd_idx" ON "public"."StripeSubscription"("status" ASC, "currentPeriodEnd" ASC);

-- CreateIndex
CREATE INDEX "StripeSubscription_stripeCustomerId_idx" ON "public"."StripeSubscription"("stripeCustomerId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "StripeSubscription_stripeSubscriptionId_key" ON "public"."StripeSubscription"("stripeSubscriptionId" ASC);

-- CreateIndex
CREATE INDEX "TeamAssignment_season_teamName_idx" ON "public"."TeamAssignment"("season" ASC, "teamName" ASC);

-- CreateIndex
CREATE INDEX "TeamAssignment_staffMemberId_idx" ON "public"."TeamAssignment"("staffMemberId" ASC);

-- CreateIndex
CREATE INDEX "TermsAcceptance_acceptedAt_idx" ON "public"."TermsAcceptance"("acceptedAt" ASC);

-- CreateIndex
CREATE INDEX "TermsAcceptance_submissionType_submissionId_idx" ON "public"."TermsAcceptance"("submissionType" ASC, "submissionId" ASC);

-- CreateIndex
CREATE INDEX "TermsAcceptance_submitterEmail_idx" ON "public"."TermsAcceptance"("submitterEmail" ASC);

-- CreateIndex
CREATE INDEX "VoteRecord_kitSubmissionId_idx" ON "public"."VoteRecord"("kitSubmissionId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "VoteRecord_kitSubmissionId_voterFingerprint_key" ON "public"."VoteRecord"("kitSubmissionId" ASC, "voterFingerprint" ASC);

-- AddForeignKey
ALTER TABLE "public"."ComplianceAlert" ADD CONSTRAINT "ComplianceAlert_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."StaffMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ComplianceCheck" ADD CONSTRAINT "ComplianceCheck_coachProfileId_fkey" FOREIGN KEY ("coachProfileId") REFERENCES "public"."CoachProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ComplianceCheck" ADD CONSTRAINT "ComplianceCheck_welfareContactId_fkey" FOREIGN KEY ("welfareContactId") REFERENCES "public"."ClubWelfareContact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Donation" ADD CONSTRAINT "Donation_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."FundraisingCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FunRunRegistration" ADD CONSTRAINT "FunRunRegistration_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."FundraisingCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HistoricalStanding" ADD CONSTRAINT "HistoricalStanding_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "public"."Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KitDesignSubmission" ADD CONSTRAINT "KitDesignSubmission_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."FundraisingCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KitDesignVote" ADD CONSTRAINT "KitDesignVote_kitDesignSubmissionId_fkey" FOREIGN KEY ("kitDesignSubmissionId") REFERENCES "public"."KitDesignSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LottoDraw" ADD CONSTRAINT "LottoDraw_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."FundraisingCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MembershipMember" ADD CONSTRAINT "MembershipMember_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."MembershipOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MembershipOrder" ADD CONSTRAINT "MembershipOrder_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."StripeSubscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ParentConsent" ADD CONSTRAINT "ParentConsent_playerProfileId_fkey" FOREIGN KEY ("playerProfileId") REFERENCES "public"."PlayerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TeamAssignment" ADD CONSTRAINT "TeamAssignment_staffMemberId_fkey" FOREIGN KEY ("staffMemberId") REFERENCES "public"."StaffMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VoteRecord" ADD CONSTRAINT "VoteRecord_kitSubmissionId_fkey" FOREIGN KEY ("kitSubmissionId") REFERENCES "public"."KitSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

