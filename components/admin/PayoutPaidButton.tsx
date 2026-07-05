"use client";

import { useTransition } from "react";
import { togglePayoutPaid } from "@/app/admin/(panel)/events/assignment-actions";
import { Button } from "@/components/ui/button";

export function PayoutPaidButton({
  payoutId,
  eventId,
  isPaid,
}: {
  payoutId: string;
  eventId: string;
  isPaid: boolean;
}) {
  const [pending, start] = useTransition();

  return (
    <Button
      size="sm"
      variant={isPaid ? "ghost" : "sage"}
      disabled={pending}
      onClick={() => start(() => togglePayoutPaid(payoutId, eventId))}
    >
      {pending ? "Saving…" : isPaid ? "Mark unpaid" : "Mark paid"}
    </Button>
  );
}
