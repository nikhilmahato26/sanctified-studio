import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GalleryGrid } from "@/components/customer/GalleryGrid";
import { Reveal } from "@/components/customer/Reveal";
import { getGalleryImages } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Weddings",
  description:
    "Unhurried, editorial wedding photography. From the first look to the last dance.",
};

// Pull live gallery images from Cloudinary at request time.
export const revalidate = 300;

export default async function WeddingsPage() {
  const images = await getGalleryImages("wedding");

  return (
    <>
      <section className="bg-sage/20">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.2em] text-clay">
              Wedding photography
            </p>
            <h1 className="mt-4 max-w-2xl font-display text-6xl leading-[1.05] text-espresso">
              Framing Emotions. Celebrating Forever.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              From the initial freezing process to the final delivery, we manage every step with the utmost care, as if it were our own. We share in our clients' successes and empathize with their challenges, which is why we consider ourselves an integral part of their extended family.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <GalleryGrid tone="sage" label="Wedding" images={images} />
      </section>


      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="rounded-2xl bg-sage/25 px-8 py-12 text-center">
          <h2 className="font-display text-3xl text-espresso">
            Tell us about your wedding
          </h2>
          <Button asChild size="lg" variant="sage" className="mt-6">
            <Link href="/contact">Start an enquiry</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
