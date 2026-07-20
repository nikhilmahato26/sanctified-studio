import type { Metadata } from "next";
import { getGalleryImages } from "@/lib/gallery";
import { GalleryTabs } from "@/components/customer/GalleryTabs";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Explore our portfolio of weddings and maternity sessions.",
};

export const revalidate = 300;

export default async function GalleryPage() {
  const weddingImages = await getGalleryImages("wedding");
  const maternityImages = await getGalleryImages("baby-shower");

  return (
    <div className="mx-auto max-w-6xl px-5 py-20">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl text-espresso md:text-5xl">
          Gallery
        </h1>
        <p className="mt-4 text-muted">
          A selection of moments from our weddings and maternity sessions.
        </p>
      </div>

      <GalleryTabs
        weddingImages={weddingImages}
        maternityImages={maternityImages}
      />
    </div>
  );
}
