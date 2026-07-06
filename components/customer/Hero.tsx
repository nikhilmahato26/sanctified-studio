import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Photo } from "@/components/customer/Photo";
import { Reveal } from "@/components/customer/Reveal";

export function Hero() {
  return (
    <section className="bg-sand">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.2em] text-clay">
            Wedding & baby shower photography
          </p>
          <h1 className="mt-4 font-display text-6xl leading-[1.05] text-espresso md:text-7xl">
            Moments worth keeping.
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted">
            Sanctified Studio captures the quiet, in-between moments — warm,
            unhurried, and true to you.
          </p>
          <div className="mt-8 space-y-3">
            <Button asChild size="lg">
              <Link href="/contact">Start an enquiry</Link>
            </Button>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" variant="sage">
                <Link href="/weddings">Weddings</Link>
              </Button>
              <Button asChild size="lg" variant="blush">
                <Link href="/baby-showers">Baby showers</Link>
              </Button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Photo
            tone="blush"
            label="Portrait"
            aspect="aspect-[4/5]"
            priority
            className="mx-auto w-full max-w-sm shadow-md"
          />
        </Reveal>
      </div>
    </section>
  );
}
