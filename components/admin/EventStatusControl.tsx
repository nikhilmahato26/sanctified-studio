"use client";

import { useTransition } from "react";
import type { EventStatus } from "@prisma/client";
import { updateEventStatus } from "@/app/admin/(panel)/events/actions";
import { EVENT_STATUS } from "@/lib/status";
import { cn } from "@/lib/utils";

const OPTIONS: EventStatus[] = ["UPCOMING", "COMPLETED", "CANCELLED"];

export function EventStatusControl({
  id,
  status,
}: {
  id: string;
  status: EventStatus;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((s) => (
        <button
          key={s}
          disabled={pending || s === status}
          onClick={() => startTransition(() => updateEventStatus(id, s))}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60",
            s === status
              ? "bg-espresso text-cream"
              : "bg-espresso/5 text-muted hover:bg-espresso/10",
          )}
        >
          {EVENT_STATUS[s].label}
        </button>
      ))}
    </div>
  );
}
