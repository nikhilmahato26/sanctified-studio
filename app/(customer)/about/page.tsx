import type { Metadata } from "next";
import { Photo } from "@/components/customer/Photo";
import { Reveal } from "@/components/customer/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Sanctified Studio is a small photography studio for weddings and maternity.",
};

const approach = [
  {
    title: "Wedding Day",
    body: "Throughout the entire engagement, from our initial meeting to the project's completion, we strive to ensure our clients feel at ease and empowered to communicate openly in all circumstances. Our objective is to deliver innovative and exceptional results.",
  },
  {
    title: "The delivery of their cherished memories.",
    body: "Our editing suite meticulously crafts each scene to achieve a cinematic quality, and through precise photo grading, we uncover the inherent beauty within every image. Our core commitment is to provide the most expeditious data delivery in the industry, enabling all to commemorate their cherished memories.",
  },
  {
    title: "The relationship between the client and the team.",
    body: "We are eager to share these moments on our social media platforms, as they authentically showcase our dedication and commitment to their weddings. We consistently strive to maintain strong connections with our valued clients, fostering an environment where they feel comfortable reaching out to us repeatedly.",
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
              Our vision is to capture each moment with the wonder of cherished memories.
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
              Our vision originated from a dedicated space where the concept of creating a vibrant environment, allowing individuals to entrust their cherished life moments to the safest hands, was conceived. Our founder, Mr. Swapnil Pawar, possesses the remarkable ability to navigate every situation with composure and a positive demeanor. His innovative mindset consistently produces exceptional results, even in challenging circumstances. We firmly believe that every moment holds significance and should be treated with the utmost care, ensuring that we deliver our best without compromising authenticity. We excel in crafting compelling pre-wedding narratives and conceptual shoots.

Our Co-founder, Mrs. Sardhana, is an extraordinary individual who oversees our Baby Studio and Maternity services. She infuses her maternal touch into every aspect, ensuring that every baby feels comfortable within the environment she meticulously creates. Her artistic talent consistently transforms each setup into a magical experience, contribute
            </p>
            <p>
              We chose to focus on weddings and maternity because they share
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
              How we proceed
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
