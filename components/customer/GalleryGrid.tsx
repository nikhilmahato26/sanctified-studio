import { Photo } from "@/components/customer/Photo";
import { Reveal } from "@/components/customer/Reveal";

interface GalleryGridProps {
  tone: "sage" | "blush";
  /** Real image URLs (e.g. from Cloudinary). Falls back to placeholders. */
  images?: { src: string; alt?: string }[];
  label: string;
}

const placeholderAspects = [
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[4/5]",
  "aspect-square",
  "aspect-[3/4]",
  "aspect-[4/5]",
  "aspect-square",
  "aspect-[3/4]",
];

export function GalleryGrid({ tone, images, label }: GalleryGridProps) {
  const items =
    images && images.length > 0
      ? images
      : placeholderAspects.map(() => null);

  return (
    <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
      {items.map((item, i) => (
        <Reveal key={i} delay={(i % 6) * 0.04} className="break-inside-avoid">
          <Photo
            tone={tone}
            label={item ? undefined : label}
            src={item?.src}
            alt={item?.alt}
            aspect={placeholderAspects[i % placeholderAspects.length]}
          />
        </Reveal>
      ))}
    </div>
  );
}
