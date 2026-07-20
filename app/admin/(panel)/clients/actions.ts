"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { nextClientDisplayId } from "@/lib/ids";
import { requirePermission } from "@/lib/session";

const CLIENT_STATUSES = [
  "LEAD",
  "POSITIVE",
  "PROPOSAL_SENT",
  "ADVANCE_RECEIVED",
  "COMPLETED",
  "CANCELLED",
] as const;

const createSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Valid email required"),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export type ActionState = { error?: string; ok?: boolean };

export async function createClient(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePermission("clients");

  const parsed = createSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const data = parsed.data;

  const client = await prisma.$transaction(async (tx) => {
    const displayId = await nextClientDisplayId(tx);
    return tx.client.create({
      data: {
        displayId,
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address || null,
        notes: data.notes || null,
        status: "LEAD",
        source: "manual",
      },
    });
  });

  revalidatePath("/admin/leads");
  redirect(`/admin/clients/${client.id}`);
}

export async function updateClientStatus(id: string, status: string) {
  await requirePermission("clients");
  if (!CLIENT_STATUSES.includes(status as (typeof CLIENT_STATUSES)[number])) {
    throw new Error("Invalid status");
  }
  await prisma.client.update({
    where: { id },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { status: status as any },
  });
  revalidatePath(`/admin/clients/${id}`);
  revalidatePath("/admin/leads");
}

const updateSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export async function updateClient(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePermission("clients");
  const parsed = updateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const d = parsed.data;
  await prisma.client.update({
    where: { id },
    data: {
      name: d.name,
      phone: d.phone,
      email: d.email,
      address: d.address || null,
      notes: d.notes || null,
    },
  });
  revalidatePath(`/admin/clients/${id}`);
  revalidatePath("/admin/leads");
  return { ok: true };
}
