"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function extractYoutubeId(url: string) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
}

export function YoutubeCarousel({ 
  links, 
  title = "Featured Videos" 
}: { 
  links: { id: string; url: string }[];
  title?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!links || links.length === 0) return null;

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({ left: dir === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-display text-3xl text-espresso">{title}</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll("left")} 
            className="rounded-full bg-espresso/5 p-2 transition-colors hover:bg-espresso/10"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-5 text-espresso" />
          </button>
          <button 
            onClick={() => scroll("right")} 
            className="rounded-full bg-espresso/5 p-2 transition-colors hover:bg-espresso/10"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-5 text-espresso" />
          </button>
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {links.map((link) => {
          const videoId = extractYoutubeId(link.url);
          if (!videoId) return null;
          return (
            <div 
              key={link.id} 
              className="min-w-[300px] shrink-0 snap-start overflow-hidden rounded-xl border border-line bg-espresso/5 sm:min-w-[400px] md:min-w-[500px]"
              style={{ aspectRatio: "16/9" }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                className="h-full w-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          );
        })}
      </div>
    </section>
  );
}
