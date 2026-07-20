import { Hero } from "@/components/customer/Hero";
import { Mosaic } from "@/components/customer/Mosaic";
import { ServiceCard } from "@/components/customer/ServiceCard";
import { AboutStrip } from "@/components/customer/AboutStrip";
import { EnquiryBand } from "@/components/customer/EnquiryBand";
import { Reveal } from "@/components/customer/Reveal";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Mosaic />

      <section className="mx-auto max-w-6xl px-5 pb-4">
        <Reveal>
          <h2 className="mb-10 font-display text-4xl text-espresso">
            What we photograph
          </h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <ServiceCard
              title="Weddings"
              label="Weddings"
              accent="sage"
              href="/weddings"
              description="From Getting Ready to tears of last bye we captured everything"
            />
          </Reveal>
          <Reveal delay={0.08}>
            <ServiceCard
              title="Maternity"
              label="Maternity"
              accent="blush"
              href="/maternity"
              description="Maternity And Baby Shoot 
From baby bump to the joyful smiles of newborns and toddlers, we capture everything."
            />
          </Reveal>
        </div>
      </section>

      <div className="mt-10">
        <AboutStrip />
      </div>
      <EnquiryBand />
    </>
  );
}
