"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { nextEmployeeDisplayId } from "@/lib/ids";
import { requireAdmin } from "@/lib/session";

export type ActionState = { error?: string; ok?: boolean };

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Valid email required"),
  role: z.string().min(1, "Role is required"),
});

export async function createEmployee(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const d = parsed.data;

  await prisma.$transaction(async (tx) => {
    const displayId = await nextEmployeeDisplayId(tx);
    await tx.employee.create({
      data: {
        displayId,
        name: d.name,
        phone: d.phone,
        email: d.email,
        role: d.role,
      },
    });
  });

  revalidatePath("/admin/employees");
  return { ok: true };
}

export async function deleteEmployee(id: string): Promise<ActionState> {
  await requireAdmin();
  const assignmentCount = await prisma.eventAssignment.count({
    where: { employeeId: id },
  });
  if (assignmentCount > 0) {
    return {
      error: "This employee is assigned to events and can't be removed.",
    };
  }
  await prisma.employee.delete({ where: { id } });
  revalidatePath("/admin/employees");
  return { ok: true };
}
