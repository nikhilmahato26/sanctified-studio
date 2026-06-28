import Image from "next/image";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "sand" | "blush" | "sage" | "clay" | "cream";

const toneGradient: Record<Tone, string> = {
  sand: "from-sand to-[#d8cab4]",
  blush: "from-blush to-[#d9b3ab]",
  sage: "from-sage to-[#7f8d72]",
  clay: "from-clay to-[#8a6f57]",
  cream: "from-cream to-sand",
};

interface PhotoProps {
  /** Real image URL (Cloudinary etc). When absent, a branded placeholder renders. */
  src?: string;
  alt?: string;
  label?: string;
  tone?: Tone;
  className?: string;
  /** e.g. "aspect-[4/5]" */
  aspect?: string;
  priority?: boolean;
}

/**
 * Editorial photo tile. Renders a real next/image when `src` is provided,
 * otherwise a soft branded gradient placeholder so layouts never look broken.
 */
export function Photo({
  src,
  alt = "",
  label,
  tone = "sand",
  className,
  aspect = "aspect-[4/5]",
  priority,
}: PhotoProps) {
  return (
    <div
      className={cn(
        "zoom-on-hover relative overflow-hidden rounded-2xl",
        aspect,
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      ) : (
        <div
          className={cn(
            "flex h-full w-full items-center justify-center bg-gradient-to-br",
            toneGradient[tone],
          )}
        >
          <div className="flex flex-col items-center gap-2 text-espresso/40">
            <Camera className="size-7" />
            {label && (
              <span className="font-display text-sm tracking-wide">
                {label}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
