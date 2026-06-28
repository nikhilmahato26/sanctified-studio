import { Photo } from "@/components/customer/Photo";
import { Reveal } from "@/components/customer/Reveal";

const tiles: { tone: "sand" | "blush" | "sage" | "clay"; label: string; aspect: string }[] = [
  { tone: "sage", label: "Vows", aspect: "aspect-[3/4]" },
  { tone: "blush", label: "First touch", aspect: "aspect-square" },
  { tone: "sand", label: "Celebration", aspect: "aspect-square" },
  { tone: "clay", label: "Details", aspect: "aspect-[3/4]" },
  { tone: "blush", label: "Little one", aspect: "aspect-square" },
  { tone: "sage", label: "Together", aspect: "aspect-[3/4]" },
];

export function Mosaic() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <Reveal>
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-4xl text-espresso">
              A glimpse of our work
            </h2>
            <p className="mt-2 max-w-md text-muted">
              Every gallery is its own story. Here are a few frames we love.
            </p>
          </div>
        </div>
      </Reveal>

      <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
        {tiles.map((t, i) => (
          <Reveal key={t.label} delay={i * 0.05} className="break-inside-avoid">
            <Photo tone={t.tone} label={t.label} aspect={t.aspect} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
