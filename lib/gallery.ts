import { cloudinary, isCloudinaryConfigured, galleryFolder } from "@/lib/cloudinary";

export interface GalleryImage {
  src: string;
  alt?: string;
  publicId: string;
}

/**
 * Returns gallery images for a service type from Cloudinary.
 * If Cloudinary isn't configured, returns [] and the UI falls back to
 * branded placeholders. (Wired fully in Phase 9.)
 */
export async function getGalleryImages(
  type: "wedding" | "baby-shower",
  limit = 12,
): Promise<GalleryImage[]> {
  if (!isCloudinaryConfigured) return [];
  try {
    const res = await cloudinary.search
      .expression(`folder:${galleryFolder(type)}`)
      .sort_by("created_at", "desc")
      .max_results(limit)
      .execute();

    return (res.resources ?? []).map(
      (r: { secure_url: string; public_id: string }) => ({
        src: r.secure_url,
        publicId: r.public_id,
      }),
    );
  } catch (err) {
    console.error("Cloudinary gallery fetch failed:", err);
    return [];
  }
}
