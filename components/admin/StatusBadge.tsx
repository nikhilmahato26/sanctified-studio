import type {
  ClientStatus,
  EventStatus,
  ProposalStatus,
  PaymentType,
} from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import {
  CLIENT_STATUS,
  EVENT_STATUS,
  PROPOSAL_STATUS,
  PAYMENT_TYPE,
} from "@/lib/status";

export function ClientStatusBadge({ status }: { status: ClientStatus }) {
  const { label, tone } = CLIENT_STATUS[status];
  return <Badge tone={tone}>{label}</Badge>;
}

export function EventStatusBadge({ status }: { status: EventStatus }) {
  const { label, tone } = EVENT_STATUS[status];
  return <Badge tone={tone}>{label}</Badge>;
}

export function EventTypeBadge({ type }: { type: string }) {
  // Simple deterministic color assignment based on type name length or first char
  const colors = ["sage", "blush", "neutral", "clay", "green", "red", "amber", "blue"] as const;
  const colorIndex = type.length % colors.length;
  const tone = colors[colorIndex] || "sage";
  
  return (
    <Badge tone={tone}>
      {type}
    </Badge>
  );
}

export function ProposalStatusBadge({ status }: { status: ProposalStatus }) {
  const { label, tone } = PROPOSAL_STATUS[status];
  return <Badge tone={tone}>{label}</Badge>;
}
