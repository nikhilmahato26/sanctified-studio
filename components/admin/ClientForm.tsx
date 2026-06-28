"use client";

import { useActionState } from "react";
import { createClient, type ActionState } from "@/app/admin/(panel)/clients/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ClientForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    createClient,
    {},
  );

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" name="notes" />
        </div>
      </div>

      {state.error && <p className="text-sm text-red-700">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Add client"}
      </Button>
    </form>
  );
}
