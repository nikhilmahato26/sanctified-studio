import { Check } from "lucide-react";
import type { Package } from "@/lib/packages";
import { Reveal } from "@/components/customer/Reveal";
import { cn } from "@/lib/utils";

export function PackageList({
  packages,
  accent,
}: {
  packages: Package[];
  accent: "sage" | "blush";
}) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {packages.map((p, i) => (
        <Reveal key={p.name} delay={i * 0.06}>
          <div className="flex h-full flex-col rounded-2xl border border-line bg-white/60 p-7">
            <h3 className="font-display text-2xl text-espresso">{p.name}</h3>
            <p className="mt-1 text-sm text-muted">{p.blurb}</p>
            <p className="mt-4 text-3xl font-semibold text-espresso">
              {p.price}
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-espresso/80">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check
                    className={cn(
                      "mt-0.5 size-4 shrink-0",
                      accent === "sage" ? "text-sage" : "text-blush",
                    )}
                  />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
