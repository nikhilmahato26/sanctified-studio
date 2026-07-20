"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  createEmployee,
  type ActionState,
} from "@/app/admin/(panel)/employees/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EmployeeForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    createEmployee,
    {},
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Input id="role" name="role" placeholder="Photographer, editor…" required />
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
          <Label htmlFor="password">Login Password (Optional)</Label>
          <Input id="password" name="password" type="password" placeholder="Leave blank if no login needed" />
        </div>
      </div>

      <div className="space-y-2 pt-4">
        <Label>System Permissions</Label>
        <div className="flex flex-wrap gap-4">
          {[
            { id: "clients", label: "Clients" },
            { id: "events", label: "Events" },
            { id: "finance", label: "Finance" },
            { id: "gallery", label: "Gallery" },
          ].map((p) => (
            <label key={p.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="permissions"
                value={p.id}
                className="rounded border-line text-espresso focus:ring-espresso"
              />
              {p.label}
            </label>
          ))}
        </div>
        <p className="text-xs text-muted">Check the sections this employee is allowed to access.</p>
      </div>

      {state.error && <p className="text-sm text-red-700">{state.error}</p>}
      {state.ok && <p className="text-sm text-emerald-700">Employee added.</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Adding…" : "Add employee"}
      </Button>
    </form>
  );
}
