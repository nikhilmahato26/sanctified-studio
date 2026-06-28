"use client";

import { useTransition, useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteEmployee } from "@/app/admin/(panel)/employees/actions";

export function DeleteEmployeeButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-red-700">{error}</span>}
      <button
        type="button"
        aria-label="Remove employee"
        disabled={pending}
        onClick={() =>
          start(async () => {
            setError(null);
            const res = await deleteEmployee(id);
            if (res.error) setError(res.error);
          })
        }
        className="rounded-lg p-2 text-muted hover:bg-espresso/5 hover:text-red-700 disabled:opacity-50"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
