"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Trash2, Upload } from "lucide-react";
import {
  uploadGalleryImage,
  deleteGalleryImage,
  type ActionState,
} from "@/app/admin/(panel)/gallery/actions";
import { Button } from "@/components/ui/button";

interface GalleryImage {
  src: string;
  publicId: string;
}

export function GalleryManager({
  type,
  title,
  images,
}: {
  type: "wedding" | "baby-shower";
  title: string;
  images: GalleryImage[];
}) {
  const action = uploadGalleryImage.bind(null, type);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    {},
  );
  const [rowPending, startRow] = useTransition();
  const [rowError, setRowError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-espresso">{title}</h2>
        <form
          ref={formRef}
          action={formAction}
          className="flex items-center gap-2"
        >
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            className="text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-espresso file:px-4 file:py-2 file:text-cream"
          />
          <Button type="submit" size="sm" disabled={pending}>
            <Upload className="size-4" />
            {pending ? "Uploading…" : "Upload"}
          </Button>
        </form>
      </div>

      {state.error && <p className="mb-3 text-sm text-red-700">{state.error}</p>}
      {rowError && <p className="mb-3 text-sm text-red-700">{rowError}</p>}

      {images.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line bg-white/40 p-8 text-center text-sm text-muted">
          No images yet. Uploads appear on the public {title.toLowerCase()} page.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img) => (
            <div
              key={img.publicId}
              className="group relative aspect-square overflow-hidden rounded-xl border border-line"
            >
              <Image
                src={img.src}
                alt=""
                fill
                sizes="200px"
                className="object-cover"
              />
              <button
                type="button"
                aria-label="Delete image"
                disabled={rowPending}
                onClick={() =>
                  startRow(async () => {
                    setRowError(null);
                    const res = await deleteGalleryImage(img.publicId, type);
                    if (res.error) setRowError(res.error);
                  })
                }
                className="absolute right-2 top-2 rounded-full bg-espresso/80 p-1.5 text-cream opacity-0 transition-opacity hover:bg-red-700 group-hover:opacity-100 disabled:opacity-50"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
