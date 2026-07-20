import Link from "next/link";
import { Photo } from "@/components/customer/Photo";
import { Reveal } from "@/components/customer/Reveal";
import { Button } from "@/components/ui/button";

export function AboutStrip() {
  return (
    <section className="bg-sand/60">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-2">
        <Reveal>
          <Photo tone="clay" label="Our studio" aspect="aspect-[5/4]" />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-sm uppercase tracking-[0.2em] text-clay">
            About the studio
          </p>
          <h2 className="mt-4 font-display text-4xl text-espresso">
            Photography that feels like a memory, not a pose.
          </h2>
          <p className="mt-5 text-muted">
            We are a small studio devoted to two of life&apos;s tenderest
            occasions — weddings and maternity. We work calmly and closely,
            so the day stays yours and the photographs stay honest.
          </p>
          <Button asChild variant="outline" className="mt-7">
            <Link href="/about">Read our story</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
