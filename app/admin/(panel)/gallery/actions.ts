"use server";

import { revalidatePath } from "next/cache";
import {
  cloudinary,
  isCloudinaryConfigured,
  galleryFolder,
} from "@/lib/cloudinary";
import { requirePermission } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export type ActionState = { error?: string; ok?: boolean };

const TYPES = ["wedding", "baby-shower"] as const;
type GalleryType = (typeof TYPES)[number];

export async function uploadGalleryImage(
  type: GalleryType,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePermission("gallery");
  if (!isCloudinaryConfigured) {
    return { error: "Cloudinary is not configured." };
  }
  if (!TYPES.includes(type)) return { error: "Invalid gallery." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image to upload." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "Only image files are allowed." };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { error: "Images must be under 10 MB." };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;
    await cloudinary.uploader.upload(dataUri, {
      folder: galleryFolder(type),
      resource_type: "image",
    });
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    return { error: "Upload failed. Please try again." };
  }

  revalidatePath("/admin/gallery");
  revalidatePath(type === "wedding" ? "/weddings" : "/maternity");
  return { ok: true };
}

export async function deleteGalleryImage(
  publicId: string,
  type: GalleryType,
): Promise<ActionState> {
  await requirePermission("gallery");
  if (!isCloudinaryConfigured) return { error: "Cloudinary is not configured." };

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete failed:", err);
    return { error: "Could not delete the image." };
  }

  revalidatePath("/admin/gallery");
  revalidatePath(type === "wedding" ? "/weddings" : "/baby-showers");
  return { ok: true };
}

export async function addYoutubeLink(
  type: GalleryType,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePermission("gallery");
  if (!TYPES.includes(type)) return { error: "Invalid gallery." };

  const url = formData.get("url");
  if (typeof url !== "string" || !url.trim()) {
    return { error: "Please enter a valid YouTube link." };
  }

  try {
    await prisma.youtubeLink.create({
      data: {
        category: type,
        url: url.trim(),
      },
    });
  } catch (err) {
    console.error("Failed to add youtube link:", err);
    return { error: "Failed to save the link. Please try again." };
  }

  revalidatePath("/admin/gallery");
  revalidatePath(type === "wedding" ? "/weddings" : "/maternity");
  revalidatePath("/gallery");
  return { ok: true };
}

export async function deleteYoutubeLink(
  id: string,
  type: GalleryType,
): Promise<ActionState> {
  await requirePermission("gallery");

  try {
    await prisma.youtubeLink.delete({
      where: { id },
    });
  } catch (err) {
    console.error("Failed to delete youtube link:", err);
    return { error: "Could not delete the link." };
  }

  revalidatePath("/admin/gallery");
  revalidatePath(type === "wedding" ? "/weddings" : "/maternity");
  revalidatePath("/gallery");
  return { ok: true };
}
