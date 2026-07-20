import type {
  ClientStatus,
  EventStatus,
  ProposalStatus,
  PaymentType,
} from "@prisma/client";

type Tone = "neutral" | "sage" | "blush" | "clay" | "amber" | "green" | "red" | "blue";

export const CLIENT_STATUS: Record<
  ClientStatus,
  { label: string; tone: Tone }
> = {
  LEAD: { label: "Lead", tone: "neutral" },
  POSITIVE: { label: "Positive", tone: "blue" },
  PROPOSAL_SENT: { label: "Proposal sent", tone: "amber" },
  ADVANCE_RECEIVED: { label: "Advance received", tone: "clay" },
  COMPLETED: { label: "Completed", tone: "green" },
  CANCELLED: { label: "Cancelled", tone: "red" },
};

/** Ordered pipeline for progress UI (excludes CANCELLED). */
export const CLIENT_PIPELINE: ClientStatus[] = [
  "LEAD",
  "POSITIVE",
  "PROPOSAL_SENT",
  "ADVANCE_RECEIVED",
  "COMPLETED",
];

export const EVENT_STATUS: Record<EventStatus, { label: string; tone: Tone }> = {
  UPCOMING: { label: "Upcoming", tone: "blue" },
  COMPLETED: { label: "Completed", tone: "green" },
  CANCELLED: { label: "Cancelled", tone: "red" },
};

export const PROPOSAL_STATUS: Record<
  ProposalStatus,
  { label: string; tone: Tone }
> = {
  DRAFT: { label: "Draft", tone: "neutral" },
  SENT: { label: "Sent", tone: "amber" },
  ACCEPTED: { label: "Accepted", tone: "green" },
};

export const PAYMENT_TYPE: Record<PaymentType, { label: string }> = {
  ADVANCE: { label: "Advance" },
  FINAL: { label: "Final" },
};
