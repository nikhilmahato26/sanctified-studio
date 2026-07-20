import { requireAdmin } from "@/lib/session";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { getGalleryImages } from "@/lib/gallery";
import { PageHeader } from "@/components/admin/PageHeader";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { YoutubeManager } from "@/components/admin/YoutubeManager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  await requireAdmin();

  const [wedding, baby, youtubeLinks] = await Promise.all([
    getGalleryImages("wedding", 60),
    getGalleryImages("baby-shower", 60),
    prisma.youtubeLink.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const weddingLinks = youtubeLinks.filter((l) => l.category === "wedding");
  const babyLinks = youtubeLinks.filter((l) => l.category === "baby-shower");

  return (
    <>
      <PageHeader
        title="Gallery"
        description="Photos and videos here appear on the public weddings and maternity pages."
      />
      
      {!isCloudinaryConfigured && (
        <div className="mb-8 rounded-2xl border border-dashed border-line bg-white/40 p-8 text-sm text-muted">
          Cloudinary isn&apos;t configured yet. Add{" "}
          <code className="font-mono">CLOUDINARY_CLOUD_NAME</code>,{" "}
          <code className="font-mono">CLOUDINARY_API_KEY</code> and{" "}
          <code className="font-mono">CLOUDINARY_API_SECRET</code> to your
          environment to upload and manage gallery photos. You can still manage YouTube videos below.
        </div>
      )}
      <div className="space-y-12">
        <div>
          <GalleryManager type="wedding" title="Weddings" images={wedding} />
          <YoutubeManager type="wedding" title="Weddings" links={weddingLinks} />
        </div>
        <div>
          <GalleryManager
            type="baby-shower"
            title="Maternity"
            images={baby}
          />
          <YoutubeManager type="baby-shower" title="Maternity" links={babyLinks} />
        </div>
      </div>
    </>
  );
}
