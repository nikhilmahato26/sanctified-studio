"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export type ActionState = { error?: string; ok?: boolean };

const assignSchema = z.object({
  employeeId: z.string().min(1, "Pick an employee"),
  payoutAmount: z.coerce.number().positive("Payout must be greater than zero"),
});

export async function assignEmployee(
  eventId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = assignSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const { employeeId, payoutAmount } = parsed.data;

  const existing = await prisma.eventAssignment.findFirst({
    where: { eventId, employeeId },
  });
  if (existing) {
    return { error: "That employee is already assigned to this event." };
  }

  await prisma.$transaction(async (tx) => {
    const assignment = await tx.eventAssignment.create({
      data: { eventId, employeeId, payoutAmount },
    });
    await tx.payout.create({
      data: {
        assignmentId: assignment.id,
        employeeId,
        amount: payoutAmount,
        isPaid: false,
      },
    });
  });

  revalidatePath(`/admin/events/${eventId}`);
  return { ok: true };
}

export async function togglePayoutPaid(payoutId: string, eventId: string) {
  await requireAdmin();
  const payout = await prisma.payout.findUnique({ where: { id: payoutId } });
  if (!payout) throw new Error("Payout not found");

  await prisma.payout.update({
    where: { id: payoutId },
    data: {
      isPaid: !payout.isPaid,
      paidAt: !payout.isPaid ? new Date() : null,
    },
  });

  revalidatePath(`/admin/events/${eventId}`);
  revalidatePath("/admin/employees");
}

export async function removeAssignment(assignmentId: string, eventId: string) {
  await requireAdmin();
  await prisma.$transaction([
    prisma.payout.deleteMany({ where: { assignmentId } }),
    prisma.eventAssignment.delete({ where: { id: assignmentId } }),
  ]);
  revalidatePath(`/admin/events/${eventId}`);
}
