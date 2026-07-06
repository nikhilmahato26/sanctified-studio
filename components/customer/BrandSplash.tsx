"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Full-screen brand splash shown once when the customer site first loads.
 * The logo is a demo placeholder at /public/logo.svg — replace that file with
 * the real brand logo (any SVG/PNG) and this splash picks it up automatically.
 */
export function BrandSplash() {
  // `fade` starts the opacity transition; `gone` unmounts after it finishes.
  const [fade, setFade] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFade(true), 1400);
    const goneTimer = setTimeout(() => setGone(true), 2200);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(goneTimer);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#260707] transition-opacity duration-700 ${
        fade ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <Image
        src="/logo.svg"
        alt="Sanctified Studio"
        width={520}
        height={320}
        priority
        className="animate-splash-in w-64 max-w-[70vw] md:w-80"
      />
    </div>
  );
}
