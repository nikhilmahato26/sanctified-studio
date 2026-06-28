"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { sendMail } from "@/lib/mailer";
import { renderProposalPdf } from "@/lib/pdf/proposal";
import { parseLineItems, sumLineItems, type LineItem } from "@/lib/pdf/types";
import { formatDate } from "@/lib/utils";
import { EVENT_TYPE } from "@/lib/status";

export type ActionState = { error?: string; ok?: boolean };

function defaultLineItems(type: "WEDDING" | "BABY_SHOWER"): LineItem[] {
  if (type === "WEDDING") {
    return [
      { label: "Full-day photography coverage", amount: 60000 },
      { label: "Edited online gallery", amount: 15000 },
      { label: "Highlight album", amount: 10000 },
    ];
  }
  return [
    { label: "Photography coverage", amount: 18000 },
    { label: "Edited online gallery", amount: 8000 },
  ];
}

export async function createProposal(eventId: string) {
  await requireAdmin();
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { proposal: true },
  });
  if (!event) throw new Error("Event not found");
  if (event.proposal) redirect(`/admin/proposals/${event.proposal.id}`);

  const items = defaultLineItems(event.type);
  const proposal = await prisma.proposal.create({
    data: {
      eventId,
      lineItems: items as unknown as Prisma.InputJsonValue,
      total: sumLineItems(items),
      status: "DRAFT",
    },
  });

  revalidatePath(`/admin/events/${eventId}`);
  redirect(`/admin/proposals/${proposal.id}`);
}

export async function updateProposal(
  proposalId: string,
  items: LineItem[],
  notes: string,
): Promise<ActionState> {
  await requireAdmin();
  const clean = items
    .map((i) => ({ label: String(i.label).trim(), amount: Number(i.amount) || 0 }))
    .filter((i) => i.label.length > 0);

  await prisma.proposal.update({
    where: { id: proposalId },
    data: {
      lineItems: clean as unknown as Prisma.InputJsonValue,
      total: sumLineItems(clean),
      notes: notes.trim() || null,
    },
  });

  revalidatePath(`/admin/proposals/${proposalId}`);
  return { ok: true };
}

export async function sendProposal(proposalId: string): Promise<ActionState> {
  await requireAdmin();

  const proposal = await prisma.proposal.findUnique({
    where: { id: proposalId },
    include: { event: { include: { client: true } } },
  });
  if (!proposal) return { error: "Proposal not found." };

  const { event } = proposal;
  const { client } = event;
  const items = parseLineItems(proposal.lineItems);

  let pdf: Buffer;
  try {
    pdf = await renderProposalPdf({
      proposalNumber: proposalId.slice(-6).toUpperCase(),
      clientName: client.name,
      clientEmail: client.email,
      eventType: EVENT_TYPE[event.type].label,
      eventDate: formatDate(event.eventDate),
      venue: event.venue,
      lineItems: items,
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
        <p>Thank you for considering Sanctified Studio for your ${EVENT_TYPE[event.type].label.toLowerCase()}.
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
      error:
        err instanceof Error ? err.message : "Could not send the email.",
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
