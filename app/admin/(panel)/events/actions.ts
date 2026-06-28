"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export type ActionState = { error?: string; ok?: boolean };

const createSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  type: z.enum(["WEDDING", "BABY_SHOWER"]),
  eventDate: z.string().min(1, "Date is required"),
  venue: z.string().optional(),
});

export async function createEvent(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = createSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const { clientId, type, eventDate, venue } = parsed.data;

  const event = await prisma.event.create({
    data: {
      clientId,
      type,
      eventDate: new Date(eventDate),
      venue: venue || null,
    },
  });

  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/admin/events");
  redirect(`/admin/events/${event.id}`);
}

export async function updateEventStatus(id: string, status: string) {
  await requireAdmin();
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
  await requireAdmin();
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

  // Recording an advance moves the client to ADVANCE_RECEIVED.
  if (type === "ADVANCE") {
    await prisma.client.update({
      where: { id: event.clientId },
      data: { status: "ADVANCE_RECEIVED" },
    });
  }

  revalidatePath(`/admin/events/${eventId}`);
  return { ok: true };
}
