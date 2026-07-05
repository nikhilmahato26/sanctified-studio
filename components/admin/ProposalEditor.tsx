"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, FileDown, Send } from "lucide-react";
import {
  updateProposal,
  sendProposal,
} from "@/app/admin/(panel)/proposals/actions";
import type { TimelineItem } from "@/lib/pdf/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";

/** Editor for a flat list of short text lines (deliverables, terms, services). */
function StringListEditor({
  items,
  onChange,
  placeholder,
  addLabel,
}: {
  items: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  addLabel: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((value, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            value={value}
            placeholder={placeholder}
            onChange={(e) =>
              onChange(items.map((v, idx) => (idx === i ? e.target.value : v)))
            }
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            aria-label="Remove"
            className="rounded-lg p-2 text-muted hover:bg-espresso/5 hover:text-red-700"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onChange([...items, ""])}
      >
        <Plus className="size-4" /> {addLabel}
      </Button>
    </div>
  );
}

export function ProposalEditor({
  proposalId,
  initialTimeline,
  initialDeliverables,
  initialTerms,
  initialTotal,
  initialNotes,
  status,
}: {
  proposalId: string;
  initialTimeline: TimelineItem[];
  initialDeliverables: string[];
  initialTerms: string[];
  initialTotal: number;
  initialNotes: string;
  status: "DRAFT" | "SENT" | "ACCEPTED";
}) {
  const [timeline, setTimeline] = useState<TimelineItem[]>(
    initialTimeline.length
      ? initialTimeline
      : [{ title: "", start: "", end: "", services: [""] }],
  );
  const [deliverables, setDeliverables] = useState<string[]>(
    initialDeliverables.length ? initialDeliverables : [""],
  );
  const [terms, setTerms] = useState<string[]>(
    initialTerms.length ? initialTerms : [""],
  );
  const [total, setTotal] = useState<number>(initialTotal);
  const [notes, setNotes] = useState(initialNotes);
  const [savePending, startSave] = useTransition();
  const [sendPending, startSend] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function updateStage(i: number, patch: Partial<TimelineItem>) {
    setTimeline((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    );
  }
  function addStage() {
    setTimeline((prev) => [
      ...prev,
      { title: "", start: "", end: "", services: [""] },
    ]);
  }
  function removeStage(i: number) {
    setTimeline((prev) => prev.filter((_, idx) => idx !== i));
  }

  const draft = { timeline, deliverables, terms, total, notes };

  function save() {
    setMessage(null);
    setError(null);
    startSave(async () => {
      const res = await updateProposal(proposalId, draft);
      if (res.error) setError(res.error);
      else setMessage("Saved.");
    });
  }

  function send() {
    setMessage(null);
    setError(null);
    startSend(async () => {
      const saved = await updateProposal(proposalId, draft);
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
    <div className="space-y-8">
      {/* Event timeline */}
      <div>
        <Label>Event timeline</Label>
        <div className="space-y-4">
          {timeline.map((stage, i) => (
            <div
              key={i}
              className="rounded-xl border border-line bg-sand/30 p-4"
            >
              <div className="mb-3 flex items-center gap-2">
                <Input
                  value={stage.title}
                  placeholder="Stage title (e.g. Sangeet & Tilak)"
                  onChange={(e) => updateStage(i, { title: e.target.value })}
                  className="flex-1 font-medium"
                />
                <button
                  type="button"
                  onClick={() => removeStage(i)}
                  aria-label="Remove stage"
                  className="rounded-lg p-2 text-muted hover:bg-espresso/5 hover:text-red-700"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="mb-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs">Start date</Label>
                  <Input
                    type="date"
                    value={stage.start}
                    onChange={(e) => updateStage(i, { start: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs">End date</Label>
                  <Input
                    type="date"
                    value={stage.end}
                    onChange={(e) => updateStage(i, { end: e.target.value })}
                  />
                </div>
              </div>

              <Label className="text-xs">Services</Label>
              <StringListEditor
                items={stage.services}
                onChange={(next) => updateStage(i, { services: next })}
                placeholder="e.g. Candid photography"
                addLabel="Add service"
              />
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-3"
          onClick={addStage}
        >
          <Plus className="size-4" /> Add stage
        </Button>
      </div>

      {/* Total price */}
      <div>
        <Label htmlFor="total">Total price</Label>
        <div className="flex items-center gap-4">
          <Input
            id="total"
            type="number"
            value={total || ""}
            placeholder="0"
            onChange={(e) => setTotal(Number(e.target.value))}
            className="w-48"
          />
          <span className="font-display text-xl text-espresso">
            {formatCurrency(total || 0)}
          </span>
        </div>
      </div>

      {/* Deliverables */}
      <div>
        <Label>Deliverables</Label>
        <StringListEditor
          items={deliverables}
          onChange={setDeliverables}
          placeholder="e.g. 300 edited photos"
          addLabel="Add deliverable"
        />
      </div>

      {/* Terms & conditions */}
      <div>
        <Label>Terms &amp; conditions</Label>
        <StringListEditor
          items={terms}
          onChange={setTerms}
          placeholder="e.g. Avata drone cost will be extra"
          addLabel="Add term"
        />
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything else the client should know…"
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
