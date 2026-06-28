import type { Metadata } from "next";
import { Photo } from "@/components/customer/Photo";
import { Reveal } from "@/components/customer/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Sanctified Studio is a small photography studio for weddings and baby showers.",
};

const approach = [
  {
    title: "Calm on the day",
    body: "We keep a light footprint so the day stays yours. No long shot-lists, no stiff posing — just gentle direction when it helps.",
  },
  {
    title: "Honest editing",
    body: "Warm, true-to-life colour. We edit so the photographs feel like the day actually felt, not like a trend that will date.",
  },
  {
    title: "Care after",
    body: "Private online galleries, thoughtful albums, and prompt delivery. The work doesn't end when the day does.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-sand">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.2em] text-clay">
              Our story
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-6xl leading-[1.05] text-espresso">
              A studio built around two tender occasions.
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-2">
        <Reveal>
          <Photo tone="blush" label="The studio" aspect="aspect-[4/5]" />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="space-y-5 text-lg text-muted">
            <p>
              Sanctified Studio began with a simple belief: the most meaningful
              photographs are the ones that feel like a memory, not a
              performance.
            </p>
            <p>
              We chose to focus on weddings and baby showers because they share
              something rare — a room full of people who love each other, fully
              present. Our job is to notice, and to keep it.
            </p>
            <p>
              We work as a small team so every couple and every family gets our
              full attention, from the first message to the final gallery.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="bg-sand/60">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Reveal>
            <h2 className="mb-10 font-display text-4xl text-espresso">
              How we work
            </h2>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {approach.map((a, i) => (
              <Reveal key={a.title} delay={i * 0.06}>
                <div className="rounded-2xl border border-line bg-white/60 p-7">
                  <h3 className="font-display text-2xl text-espresso">
                    {a.title}
                  </h3>
                  <p className="mt-3 text-muted">{a.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
