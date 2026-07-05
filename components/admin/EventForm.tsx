"use client";

import { useActionState } from "react";
import { createEvent, type ActionState } from "@/app/admin/(panel)/events/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ClientOption {
  id: string;
  name: string;
  displayId: string;
}

export function EventForm({
  clients,
  fixedClient,
}: {
  clients?: ClientOption[];
  fixedClient?: ClientOption;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    createEvent,
    {},
  );

  return (
    <form action={action} className="space-y-5">
      {fixedClient ? (
        <input type="hidden" name="clientId" value={fixedClient.id} />
      ) : (
        <div>
          <Label htmlFor="clientId">Client</Label>
          <Select id="clientId" name="clientId" required defaultValue="">
            <option value="" disabled>
              Select a client…
            </option>
            {clients?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.displayId})
              </option>
            ))}
          </Select>
        </div>
      )}

      {fixedClient && (
        <p className="text-sm text-muted">
          For <span className="text-espresso">{fixedClient.name}</span> (
          {fixedClient.displayId})
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="type">Event type</Label>
          <Select id="type" name="type" defaultValue="WEDDING">
            <option value="WEDDING">Wedding</option>
            <option value="BABY_SHOWER">Baby shower</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="eventDate">Start date</Label>
          <Input id="eventDate" name="eventDate" type="date" required />
        </div>
        <div>
          <Label htmlFor="endDate">End date (optional)</Label>
          <Input id="endDate" name="endDate" type="date" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="venue">Venue (optional)</Label>
          <Input id="venue" name="venue" placeholder="Venue / location" />
        </div>
      </div>

      {state.error && <p className="text-sm text-red-700">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Creating…" : "Create event"}
      </Button>
    </form>
  );
}
