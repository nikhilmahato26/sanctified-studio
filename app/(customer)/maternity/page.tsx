import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GalleryGrid } from "@/components/customer/GalleryGrid";
import { Reveal } from "@/components/customer/Reveal";
import { getGalleryImages } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Maternity",
  description:
    "Soft, joyful maternity photography for the people welcoming someone new.",
};

// Pull live gallery images from Cloudinary at request time.
export const revalidate = 300;

export default async function MaternityPage() {
  const images = await getGalleryImages("baby-shower");

  return (
    <>
      <section className="bg-blush/30">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.2em] text-clay">
              Maternity photography
            </p>
            <h1 className="mt-4 max-w-2xl font-display text-6xl leading-[1.05] text-espresso">
              Maternity & New Born Studio
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              We meticulously document every stage, from maternity to newborn, to create timeless memories for you.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <GalleryGrid tone="blush" label="Maternity" images={images} />
      </section>


      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="rounded-2xl bg-blush/35 px-8 py-12 text-center">
          <h2 className="font-display text-3xl text-espresso">
            Please do not hesitate to contact us
          </h2>
          <Button asChild size="lg" variant="blush" className="mt-6">
            <Link href="/contact">Start an enquiry</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
