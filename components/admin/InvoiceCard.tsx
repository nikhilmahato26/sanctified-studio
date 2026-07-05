"use client";

import { useState, useTransition } from "react";
import { FileDown, Send } from "lucide-react";
import {
  createInvoice,
  sendInvoice,
} from "@/app/admin/(panel)/invoices/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface InvoiceData {
  id: string;
  totalAmount: number;
  advancePaid: number;
  balanceDue: number;
  sentAt: string | null;
}

export function InvoiceCard({
  eventId,
  invoice,
  canCreate,
  proposalTotal,
  paid,
}: {
  eventId: string;
  invoice: InvoiceData | null;
  canCreate: boolean;
  proposalTotal: number;
  paid: number;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function create() {
    setError(null);
    setMessage(null);
    start(async () => {
      const res = await createInvoice(eventId);
      if (res.error) setError(res.error);
    });
  }

  function send() {
    if (!invoice) return;
    setError(null);
    setMessage(null);
    start(async () => {
      const res = await sendInvoice(invoice.id);
      if (res.error) setError(res.error);
      else setMessage("Invoice sent.");
    });
  }

  function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
    return (
      <div className="flex items-center justify-between py-1.5 text-sm">
        <span className="text-muted">{label}</span>
        <span className={strong ? "font-display text-lg text-espresso" : "text-espresso"}>
          {value}
        </span>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {invoice ? (
          <>
            <div className="rounded-xl bg-sand/60 px-4 py-3">
              <Row label="Total" value={formatCurrency(invoice.totalAmount)} />
              <Row
                label="Paid"
                value={`− ${formatCurrency(invoice.advancePaid)}`}
              />
              <div className="mt-1 border-t border-line pt-1">
                <Row
                  label="Balance due"
                  value={formatCurrency(invoice.balanceDue)}
                  strong
                />
              </div>
            </div>
            {invoice.sentAt && (
              <p className="text-sm text-emerald-700">Sent {invoice.sentAt}.</p>
            )}
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={create} disabled={pending}>
                Refresh
              </Button>
              <Button asChild size="sm" variant="outline">
                <a
                  href={`/api/invoices/${invoice.id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileDown className="size-4" /> Preview
                </a>
              </Button>
              <Button size="sm" variant="clay" onClick={send} disabled={pending}>
                <Send className="size-4" />
                {invoice.sentAt ? "Resend" : "Send"}
              </Button>
            </div>
          </>
        ) : canCreate ? (
          <>
            <div className="rounded-xl bg-sand/60 px-4 py-3">
              <Row label="Proposal total" value={formatCurrency(proposalTotal)} />
              <Row
                label="Paid"
                value={`− ${formatCurrency(paid)}`}
              />
              <div className="mt-1 border-t border-line pt-1">
                <Row
                  label="Balance due"
                  value={formatCurrency(Math.max(0, proposalTotal - paid))}
                  strong
                />
              </div>
            </div>
            <Button size="sm" onClick={create} disabled={pending}>
              {pending ? "Creating…" : "Create bill"}
            </Button>
          </>
        ) : (
          <p className="text-sm text-muted">
            Create a proposal first to bill from its total.
          </p>
        )}

        {error && <p className="text-sm text-red-700">{error}</p>}
        {message && <p className="text-sm text-emerald-700">{message}</p>}
      </CardContent>
    </Card>
  );
}
