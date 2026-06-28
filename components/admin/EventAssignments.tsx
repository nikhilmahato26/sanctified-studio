"use client";

import { useActionState, useEffect, useRef, useTransition } from "react";
import { Trash2 } from "lucide-react";
import {
  assignEmployee,
  togglePayoutPaid,
  removeAssignment,
  type ActionState,
} from "@/app/admin/(panel)/events/assignment-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface AssignmentRow {
  id: string;
  employeeName: string;
  employeeDisplayId: string;
  payoutAmount: number;
  isPaid: boolean;
  payoutId: string | null;
}

interface EmployeeOption {
  id: string;
  name: string;
  displayId: string;
  role: string;
}

export function EventAssignments({
  eventId,
  assignments,
  employees,
}: {
  eventId: string;
  assignments: AssignmentRow[];
  employees: EmployeeOption[];
}) {
  const action = assignEmployee.bind(null, eventId);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    {},
  );
  const [rowPending, startRow] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  const assignedIds = new Set(assignments.map((a) => a.employeeDisplayId));
  const available = employees.filter((e) => !assignedIds.has(e.displayId));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team & payouts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {assignments.length === 0 ? (
          <p className="text-sm text-muted">No one assigned yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {assignments.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div>
                  <p className="font-medium text-espresso">{a.employeeName}</p>
                  <p className="font-mono text-xs text-muted">
                    {a.employeeDisplayId} · {formatCurrency(a.payoutAmount)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={a.isPaid ? "green" : "amber"}>
                    {a.isPaid ? "Paid" : "Unpaid"}
                  </Badge>
                  {a.payoutId && (
                    <Button
                      size="sm"
                      variant={a.isPaid ? "ghost" : "sage"}
                      disabled={rowPending}
                      onClick={() =>
                        startRow(() =>
                          togglePayoutPaid(a.payoutId as string, eventId),
                        )
                      }
                    >
                      {a.isPaid ? "Mark unpaid" : "Mark paid"}
                    </Button>
                  )}
                  <button
                    type="button"
                    aria-label="Remove assignment"
                    disabled={rowPending}
                    onClick={() =>
                      startRow(() => removeAssignment(a.id, eventId))
                    }
                    className="rounded-lg p-2 text-muted hover:bg-espresso/5 hover:text-red-700"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {available.length > 0 ? (
          <form
            ref={formRef}
            action={formAction}
            className="flex flex-wrap items-end gap-2 border-t border-line pt-4"
          >
            <div className="min-w-48 flex-1">
              <Select name="employeeId" defaultValue="" required>
                <option value="" disabled>
                  Assign an employee…
                </option>
                {available.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} · {e.role}
                  </option>
                ))}
              </Select>
            </div>
            <Input
              name="payoutAmount"
              type="number"
              min="1"
              placeholder="Payout"
              required
              className="w-32"
            />
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? "Adding…" : "Assign"}
            </Button>
            {state.error && (
              <p className="w-full text-sm text-red-700">{state.error}</p>
            )}
          </form>
        ) : (
          <p className="border-t border-line pt-4 text-sm text-muted">
            {employees.length === 0
              ? "Add employees first to assign them."
              : "Everyone is assigned."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
