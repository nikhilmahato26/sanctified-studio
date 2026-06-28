"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, FileDown, Send } from "lucide-react";
import {
  updateProposal,
  sendProposal,
} from "@/app/admin/(panel)/proposals/actions";
import type { LineItem } from "@/lib/pdf/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";

export function ProposalEditor({
  proposalId,
  initialItems,
  initialNotes,
  status,
}: {
  proposalId: string;
  initialItems: LineItem[];
  initialNotes: string;
  status: "DRAFT" | "SENT" | "ACCEPTED";
}) {
  const [items, setItems] = useState<LineItem[]>(
    initialItems.length ? initialItems : [{ label: "", amount: 0 }],
  );
  const [notes, setNotes] = useState(initialNotes);
  const [savePending, startSave] = useTransition();
  const [sendPending, startSend] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const total = items.reduce((acc, i) => acc + (Number(i.amount) || 0), 0);

  function updateItem(i: number, patch: Partial<LineItem>) {
    setItems((prev) =>
      prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)),
    );
  }
  function addItem() {
    setItems((prev) => [...prev, { label: "", amount: 0 }]);
  }
  function removeItem(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  function save() {
    setMessage(null);
    setError(null);
    startSave(async () => {
      const res = await updateProposal(proposalId, items, notes);
      if (res.error) setError(res.error);
      else setMessage("Saved.");
    });
  }

  function send() {
    setMessage(null);
    setError(null);
    startSend(async () => {
      // Persist latest edits first, then send.
      const saved = await updateProposal(proposalId, items, notes);
      if (saved.error) {
        setError(saved.error);
        return;
      }
      const res = await sendProposal(proposalId);
      if (res.error) setError(res.error);
      else setMessage("Proposal sent to the client.");
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <Label>Price line items</Label>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={item.label}
                placeholder="Description"
                onChange={(e) => updateItem(i, { label: e.target.value })}
                className="flex-1"
              />
              <Input
                type="number"
                value={item.amount || ""}
                placeholder="0"
                onChange={(e) =>
                  updateItem(i, { amount: Number(e.target.value) })
                }
                className="w-36"
              />
              <button
                type="button"
                onClick={() => removeItem(i)}
                aria-label="Remove line"
                className="rounded-lg p-2 text-muted hover:bg-espresso/5 hover:text-red-700"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-2"
          onClick={addItem}
        >
          <Plus className="size-4" /> Add line
        </Button>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-sand/60 px-4 py-3">
        <span className="text-sm uppercase tracking-wide text-muted">Total</span>
        <span className="font-display text-2xl text-espresso">
          {formatCurrency(total)}
        </span>
      </div>

      <div>
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything the client should know…"
        />
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}
      {message && <p className="text-sm text-emerald-700">{message}</p>}

      <div className="flex flex-wrap gap-3">
        <Button onClick={save} disabled={savePending || sendPending}>
          {savePending ? "Saving…" : "Save"}
        </Button>
        <Button asChild variant="outline">
          <a
            href={`/api/proposals/${proposalId}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FileDown className="size-4" /> Preview PDF
          </a>
        </Button>
        <Button onClick={send} variant="clay" disabled={sendPending || savePending}>
          <Send className="size-4" />
          {sendPending
            ? "Sending…"
            : status === "DRAFT"
              ? "Send to client"
              : "Resend"}
        </Button>
      </div>
    </div>
  );
}
