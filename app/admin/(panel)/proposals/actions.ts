"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/session";
import { sendMail } from "@/lib/mailer";
import { renderProposalPdf } from "@/lib/pdf/proposal";
import {
  parseTimeline,
  parseStringList,
  type TimelineItem,
} from "@/lib/pdf/types";
import { formatDate, formatDateRange, toDateInput } from "@/lib/utils";


export type ActionState = { error?: string; ok?: boolean };

export interface ProposalDraft {
  timeline: TimelineItem[];
  deliverables: string[];
  terms: string[];
  total: number;
  notes: string;
}

/** A starter timeline stage seeded from the event's date range. */
function defaultTimeline(start: Date, end: Date | null): TimelineItem[] {
  return [
    {
      title: "Day 1",
      start: toDateInput(start),
      end: toDateInput(end ?? start),
      services: [
        "Traditional photography",
        "Traditional video",
        "Candid photography",
      ],
    },
  ];
}

const DEFAULT_TERMS = [
  "Avata drone cost will be extra.",
  "Content creation reels charges will be extra.",
  "50% advance required to confirm the booking.",
];

export async function createProposal(eventId: string) {
  await requirePermission("finance");
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { proposal: true },
  });
  if (!event) throw new Error("Event not found");
  if (event.proposal) redirect(`/admin/proposals/${event.proposal.id}`);

  const proposal = await prisma.proposal.create({
    data: {
      eventId,
      timeline: defaultTimeline(
        event.eventDate,
        event.endDate,
      ) as unknown as Prisma.InputJsonValue,
      deliverables: [] as unknown as Prisma.InputJsonValue,
      terms: DEFAULT_TERMS as unknown as Prisma.InputJsonValue,
      total: 0,
      status: "DRAFT",
    },
  });

  revalidatePath(`/admin/events/${eventId}`);
  redirect(`/admin/proposals/${proposal.id}`);
}

export async function updateProposal(
  proposalId: string,
  draft: ProposalDraft,
): Promise<ActionState> {
  await requirePermission("finance");

  const timeline = draft.timeline
    .map((t) => ({
      title: String(t.title).trim(),
      start: String(t.start).trim(),
      end: String(t.end).trim(),
      services: (t.services ?? [])
        .map((s) => String(s).trim())
        .filter((s) => s.length > 0),
    }))
    .filter((t) => t.title.length > 0 || t.services.length > 0);

  const deliverables = draft.deliverables
    .map((d) => String(d).trim())
    .filter((d) => d.length > 0);
  const terms = draft.terms.map((t) => String(t).trim()).filter((t) => t.length > 0);

  await prisma.proposal.update({
    where: { id: proposalId },
    data: {
      timeline: timeline as unknown as Prisma.InputJsonValue,
      deliverables: deliverables as unknown as Prisma.InputJsonValue,
      terms: terms as unknown as Prisma.InputJsonValue,
      total: Number(draft.total) || 0,
      notes: draft.notes.trim() || null,
    },
  });

  revalidatePath(`/admin/proposals/${proposalId}`);
  return { ok: true };
}

export async function sendProposal(proposalId: string): Promise<ActionState> {
  await requirePermission("finance");

  const proposal = await prisma.proposal.findUnique({
    where: { id: proposalId },
    include: { event: { include: { client: true } } },
  });
  if (!proposal) return { error: "Proposal not found." };

  const { event } = proposal;
  const { client } = event;

  let pdf: Buffer;
  try {
    pdf = await renderProposalPdf({
      proposalNumber: proposalId.slice(-6).toUpperCase(),
      clientName: client.name,
      clientEmail: client.email,
      eventType: event.type,
      eventKind: event.type,
      eventDate: formatDateRange(event.eventDate, event.endDate),
      venue: event.venue,
      timeline: parseTimeline(proposal.timeline),
      deliverables: parseStringList(proposal.deliverables),
      terms: parseStringList(proposal.terms),
      total: proposal.total,
      notes: proposal.notes,
      date: formatDate(new Date()),
    });
  } catch (err) {
    console.error("Proposal PDF render failed:", err);
    return { error: "Could not generate the PDF." };
  }

  try {
    await sendMail({
      to: client.email,
      subject: "Your photography proposal · Sanctified Studio",
      html: `<p>Hi ${client.name},</p>
        <p>Thank you for considering Sanctified Studio for your ${event.type.toLowerCase()}.
        Please find your proposal attached.</p>
        <p>Warmly,<br/>Sanctified Studio</p>`,
      attachments: [
        {
          filename: `proposal-${proposalId.slice(-6)}.pdf`,
          content: pdf,
          contentType: "application/pdf",
        },
      ],
    });
  } catch (err) {
    console.error("Proposal email failed:", err);
    return {
      error: err instanceof Error ? err.message : "Could not send the email.",
    };
  }

  await prisma.$transaction([
    prisma.proposal.update({
      where: { id: proposalId },
      data: { status: "SENT", sentAt: new Date() },
    }),
    prisma.client.update({
      where: { id: client.id },
      data: { status: "PROPOSAL_SENT" },
    }),
  ]);

  revalidatePath(`/admin/proposals/${proposalId}`);
  revalidatePath(`/admin/events/${event.id}`);
  return { ok: true };
}
