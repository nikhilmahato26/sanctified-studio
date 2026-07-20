"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createCategory(formData: FormData) {
  const name = formData.get("name");
  if (!name || typeof name !== "string") {
    return;
  }

  try {
    await prisma.eventCategory.create({
      data: { name: name.trim() },
    });
    revalidatePath("/admin/categories");
  } catch (err: any) {
    console.error(err);
  }
}

export async function deleteCategory(formData: FormData) {
  const id = formData.get("id");
  if (!id || typeof id !== "string") {
    return;
  }
  
  try {
    await prisma.eventCategory.delete({
      where: { id },
    });
    revalidatePath("/admin/categories");
  } catch (err) {
    console.error(err);
  }
}
