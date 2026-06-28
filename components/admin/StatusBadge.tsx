import type {
  ClientStatus,
  EventStatus,
  EventType,
  ProposalStatus,
} from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import {
  CLIENT_STATUS,
  EVENT_STATUS,
  EVENT_TYPE,
  PROPOSAL_STATUS,
} from "@/lib/status";

export function ClientStatusBadge({ status }: { status: ClientStatus }) {
  const { label, tone } = CLIENT_STATUS[status];
  return <Badge tone={tone}>{label}</Badge>;
}

export function EventStatusBadge({ status }: { status: EventStatus }) {
  const { label, tone } = EVENT_STATUS[status];
  return <Badge tone={tone}>{label}</Badge>;
}

export function EventTypeBadge({ type }: { type: EventType }) {
  const { label, tone } = EVENT_TYPE[type];
  return <Badge tone={tone}>{label}</Badge>;
}

export function ProposalStatusBadge({ status }: { status: ProposalStatus }) {
  const { label, tone } = PROPOSAL_STATUS[status];
  return <Badge tone={tone}>{label}</Badge>;
}
