"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/session";

export type ActionState = { error?: string; ok?: boolean };

const createSchema = z
  .object({
    clientId: z.string().min(1, "Client is required"),
    type: z.enum(["WEDDING", "BABY_SHOWER"]),
    eventDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    venue: z.string().optional(),
  })
  .refine(
    (d) => !d.endDate || new Date(d.endDate) >= new Date(d.eventDate),
    { message: "End date must be on or after the start date", path: ["endDate"] },
  );

export async function createEvent(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePermission("events");
  const parsed = createSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const { clientId, type, eventDate, endDate, venue } = parsed.data;

  const event = await prisma.event.create({
    data: {
      clientId,
      type,
      eventDate: new Date(eventDate),
      endDate: endDate ? new Date(endDate) : null,
      venue: venue || null,
    },
  });

  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/admin/events");
  redirect(`/admin/events/${event.id}`);
}

export async function updateEventStatus(id: string, status: string) {
  await requirePermission("events");
  if (!["UPCOMING", "COMPLETED", "CANCELLED"].includes(status)) {
    throw new Error("Invalid status");
  }
  const event = await prisma.event.update({
    where: { id },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { status: status as any },
    select: { clientId: true },
  });

  // When an event is marked completed, advance the client to COMPLETED.
  if (status === "COMPLETED") {
    await prisma.client.update({
      where: { id: event.clientId },
      data: { status: "COMPLETED" },
    });
  }

  revalidatePath(`/admin/events/${id}`);
  revalidatePath("/admin/events");
}

const paymentSchema = z.object({
  type: z.enum(["ADVANCE", "FINAL"]),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
});

export async function recordPayment(
  eventId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePermission("events");
  const parsed = paymentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const { type, amount } = parsed.data;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { clientId: true },
  });
  if (!event) return { error: "Event not found." };

  await prisma.payment.create({
    data: { eventId, type, amount },
  });

  // Recording an advance moves the client to ADVANCE_RECEIVED and marks
  // the proposal as accepted — paying the advance is the acceptance signal.
  if (type === "ADVANCE") {
    await prisma.$transaction([
      prisma.client.update({
        where: { id: event.clientId },
        data: { status: "ADVANCE_RECEIVED" },
      }),
      prisma.proposal.updateMany({
        where: { eventId, status: { not: "ACCEPTED" } },
        data: { status: "ACCEPTED" },
      }),
    ]);
  }

  // Keep an existing invoice in sync so its balance due reflects every
  // payment (advance and final), not just the advance it was created with.
  await recalcInvoice(eventId);

  revalidatePath(`/admin/events/${eventId}`);
  return { ok: true };
}

/**
 * Recomputes an event's invoice from all recorded payments. No-op if the event
 * has no invoice yet. Paid = sum of every payment; balance due = total − paid.
 */
export async function recalcInvoice(eventId: string) {
  const invoice = await prisma.invoice.findUnique({ where: { eventId } });
  if (!invoice) return;

  const payments = await prisma.payment.findMany({
    where: { eventId },
    select: { amount: true },
  });
  const paid = payments.reduce((sum, p) => sum + p.amount, 0);

  await prisma.invoice.update({
    where: { eventId },
    data: {
      advancePaid: paid,
      balanceDue: Math.max(0, invoice.totalAmount - paid),
    },
  });
}
