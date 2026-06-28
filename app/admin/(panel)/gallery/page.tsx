import { requireAdmin } from "@/lib/session";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { getGalleryImages } from "@/lib/gallery";
import { PageHeader } from "@/components/admin/PageHeader";
import { GalleryManager } from "@/components/admin/GalleryManager";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  await requireAdmin();

  if (!isCloudinaryConfigured) {
    return (
      <>
        <PageHeader
          title="Gallery"
          description="Manage the photos shown on the public site."
        />
        <div className="rounded-2xl border border-dashed border-line bg-white/40 p-8 text-sm text-muted">
          Cloudinary isn&apos;t configured yet. Add{" "}
          <code className="font-mono">CLOUDINARY_CLOUD_NAME</code>,{" "}
          <code className="font-mono">CLOUDINARY_API_KEY</code> and{" "}
          <code className="font-mono">CLOUDINARY_API_SECRET</code> to your
          environment to upload and manage gallery photos.
        </div>
      </>
    );
  }

  const [wedding, baby] = await Promise.all([
    getGalleryImages("wedding", 60),
    getGalleryImages("baby-shower", 60),
  ]);

  return (
    <>
      <PageHeader
        title="Gallery"
        description="Photos here appear on the public weddings and baby showers pages."
      />
      <div className="space-y-12">
        <GalleryManager type="wedding" title="Weddings" images={wedding} />
        <GalleryManager
          type="baby-shower"
          title="Baby showers"
          images={baby}
        />
      </div>
    </>
  );
}
