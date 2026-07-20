"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { Trash2, Link as LinkIcon } from "lucide-react";
import {
  addYoutubeLink,
  deleteYoutubeLink,
  type ActionState,
} from "@/app/admin/(panel)/gallery/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function extractYoutubeId(url: string) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
}

export function YoutubeManager({
  type,
  title,
  links,
}: {
  type: "wedding" | "baby-shower";
  title: string;
  links: { id: string; url: string }[];
}) {
  const action = addYoutubeLink.bind(null, type);
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
    <div className="mt-12 border-t border-line pt-12">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-xl text-espresso">{title} Videos</h3>
        <form
          ref={formRef}
          action={formAction}
          className="flex items-center gap-2"
        >
          <Input
            type="url"
            name="url"
            placeholder="https://youtube.com/watch?v=..."
            required
            className="w-64"
          />
          <Button type="submit" size="sm" disabled={pending}>
            <LinkIcon className="size-4 mr-2" />
            {pending ? "Adding…" : "Add Video"}
          </Button>
        </form>
      </div>

      {state.error && <p className="mb-3 text-sm text-red-700">{state.error}</p>}
      {rowError && <p className="mb-3 text-sm text-red-700">{rowError}</p>}

      {links.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line bg-white/40 p-8 text-center text-sm text-muted">
          No YouTube videos added yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {links.map((link) => {
            const videoId = extractYoutubeId(link.url);
            return (
              <div
                key={link.id}
                className="group relative aspect-video overflow-hidden rounded-xl border border-line bg-espresso/5"
              >
                {videoId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?controls=0`}
                    title="YouTube video player"
                    className="h-full w-full pointer-events-none"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  ></iframe>
                ) : (
                  <div className="flex h-full items-center justify-center p-4 text-center text-xs text-muted">
                    {link.url}
                  </div>
                )}
                
                <button
                  type="button"
                  aria-label="Delete link"
                  disabled={rowPending}
                  onClick={() =>
                    startRow(async () => {
                      setRowError(null);
                      const res = await deleteYoutubeLink(link.id, type);
                      if (res.error) setRowError(res.error);
                    })
                  }
                  className="absolute right-2 top-2 rounded-full bg-espresso/80 p-1.5 text-cream opacity-0 transition-opacity hover:bg-red-700 group-hover:opacity-100 disabled:opacity-50 z-10"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
