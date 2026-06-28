"use client";

import { useTransition } from "react";
import type { ClientStatus } from "@prisma/client";
import { Check } from "lucide-react";
import { updateClientStatus } from "@/app/admin/(panel)/clients/actions";
import { CLIENT_PIPELINE, CLIENT_STATUS } from "@/lib/status";
import { cn } from "@/lib/utils";

export function ClientStatusControl({
  id,
  status,
}: {
  id: string;
  status: ClientStatus;
}) {
  const [pending, startTransition] = useTransition();
  const currentIndex = CLIENT_PIPELINE.indexOf(status);

  function set(next: ClientStatus) {
    if (next === status) return;
    startTransition(() => updateClientStatus(id, next));
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {CLIENT_PIPELINE.map((s, i) => {
          const done = currentIndex >= 0 && i <= currentIndex;
          const isCurrent = s === status;
          return (
            <button
              key={s}
              onClick={() => set(s)}
              disabled={pending}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60",
                isCurrent
                  ? "bg-espresso text-cream"
                  : done
                    ? "bg-sage/30 text-espresso"
                    : "bg-espresso/5 text-muted hover:bg-espresso/10",
              )}
            >
              {done && !isCurrent && <Check className="size-3" />}
              {CLIENT_STATUS[s].label}
            </button>
          );
        })}
      </div>
      <button
        onClick={() => set("CANCELLED")}
        disabled={pending || status === "CANCELLED"}
        className={cn(
          "mt-3 text-xs underline-offset-2 hover:underline disabled:opacity-60",
          status === "CANCELLED" ? "text-red-700" : "text-muted",
        )}
      >
        {status === "CANCELLED" ? "Cancelled" : "Mark as cancelled"}
      </button>
    </div>
  );
}
