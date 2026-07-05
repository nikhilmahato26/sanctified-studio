"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { sendMail } from "@/lib/mailer";
import { renderInvoicePdf } from "@/lib/pdf/invoice";
import { formatCurrency, formatDate } from "@/lib/utils";
import { EVENT_TYPE } from "@/lib/status";

export type ActionState = { error?: string; ok?: boolean };

/** Create or refresh an invoice from the event's proposal + all payments. */
export async function createInvoice(eventId: string): Promise<ActionState> {
  await requireAdmin();

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { proposal: true, payments: true, invoice: true },
  });
  if (!event) return { error: "Event not found." };
  if (!event.proposal) {
    return { error: "Create a proposal first to bill from its total." };
  }

  const totalAmount = event.proposal.total;
  // Count every payment received so far, not just the advance.
  const paid = event.payments.reduce((a, p) => a + p.amount, 0);
  const balanceDue = Math.max(0, totalAmount - paid);

  await prisma.invoice.upsert({
    where: { eventId },
    update: { totalAmount, advancePaid: paid, balanceDue },
    create: { eventId, totalAmount, advancePaid: paid, balanceDue },
  });

  revalidatePath(`/admin/events/${eventId}`);
  return { ok: true };
}

export async function sendInvoice(invoiceId: string): Promise<ActionState> {
  await requireAdmin();

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { event: { include: { client: true } } },
  });
  if (!invoice) return { error: "Invoice not found." };

  const { event } = invoice;
  const { client } = event;

  let pdf: Buffer;
  try {
    pdf = await renderInvoicePdf({
      invoiceNumber: invoiceId.slice(-6).toUpperCase(),
      clientName: client.name,
      clientEmail: client.email,
      eventType: EVENT_TYPE[event.type].label,
      eventDate: formatDate(event.eventDate),
      totalAmount: invoice.totalAmount,
      advancePaid: invoice.advancePaid,
      balanceDue: invoice.balanceDue,
      date: formatDate(new Date()),
    });
  } catch (err) {
    console.error("Invoice PDF render failed:", err);
    return { error: "Could not generate the PDF." };
  }

  try {
    await sendMail({
      to: client.email,
      subject: "Your invoice · Sanctified Studio",
      html: `<p>Hi ${client.name},</p>
        <p>Please find your invoice attached. The balance due is
        <strong>${formatCurrency(invoice.balanceDue)}</strong>.</p>
        <p>Warmly,<br/>Sanctified Studio</p>`,
      attachments: [
        {
          filename: `invoice-${invoiceId.slice(-6)}.pdf`,
          content: pdf,
          contentType: "application/pdf",
        },
      ],
    });
  } catch (err) {
    console.error("Invoice email failed:", err);
    return {
      error: err instanceof Error ? err.message : "Could not send the email.",
    };
  }

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { sentAt: new Date() },
  });

  revalidatePath(`/admin/events/${event.id}`);
  return { ok: true };
}
