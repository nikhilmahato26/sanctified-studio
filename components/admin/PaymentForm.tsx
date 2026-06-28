"use client";

import { useActionState, useRef, useEffect } from "react";
import { recordPayment, type ActionState } from "@/app/admin/(panel)/events/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function PaymentForm({ eventId }: { eventId: string }) {
  const action = recordPayment.bind(null, eventId);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    {},
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-wrap items-end gap-2">
      <div>
        <Select name="type" defaultValue="ADVANCE" className="w-36">
          <option value="ADVANCE">Advance</option>
          <option value="FINAL">Final</option>
        </Select>
      </div>
      <Input
        name="amount"
        type="number"
        min="1"
        step="1"
        placeholder="Amount"
        required
        className="w-36"
      />
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Saving…" : "Record"}
      </Button>
      {state.error && (
        <p className="w-full text-sm text-red-700">{state.error}</p>
      )}
    </form>
  );
}
