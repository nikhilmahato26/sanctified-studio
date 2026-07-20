"use client";

import { useState } from "react";
import { GalleryGrid } from "@/components/customer/GalleryGrid";
import type { GalleryImage } from "@/lib/gallery";

export function GalleryTabs({
  weddingImages,
  maternityImages,
}: {
  weddingImages: GalleryImage[];
  maternityImages: GalleryImage[];
}) {
  const [activeTab, setActiveTab] = useState<"weddings" | "maternity">("weddings");

  return (
    <div>
      <div className="mb-12 flex justify-center space-x-4">
        <button
          onClick={() => setActiveTab("weddings")}
          className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
            activeTab === "weddings"
              ? "bg-espresso text-cream"
              : "bg-sage/20 text-espresso hover:bg-sage/40"
          }`}
        >
          Weddings
        </button>
        <button
          onClick={() => setActiveTab("maternity")}
          className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
            activeTab === "maternity"
              ? "bg-espresso text-cream"
              : "bg-blush/40 text-espresso hover:bg-blush/60"
          }`}
        >
          Maternity & Baby Shoots
        </button>
      </div>

      {activeTab === "weddings" ? (
        <GalleryGrid tone="sage" label="Wedding" images={weddingImages} />
      ) : (
        <GalleryGrid tone="blush" label="Maternity" images={maternityImages} />
      )}
    </div>
  );
}
