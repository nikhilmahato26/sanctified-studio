import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { createProposal } from "@/app/admin/(panel)/proposals/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  EventStatusBadge,
  EventTypeBadge,
  ProposalStatusBadge,
} from "@/components/admin/StatusBadge";
import { EventStatusControl } from "@/components/admin/EventStatusControl";
import { PaymentForm } from "@/components/admin/PaymentForm";
import { EventAssignments } from "@/components/admin/EventAssignments";
import { InvoiceCard } from "@/components/admin/InvoiceCard";
import { PAYMENT_TYPE } from "@/lib/status";
import { formatCurrency, formatDate, formatDateRange } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      client: true,
      proposal: true,
      invoice: true,
      payments: { orderBy: { receivedAt: "desc" } },
      assignments: { include: { employee: true, payout: true } },
    },
  });
  if (!event) notFound();

  const employees = await prisma.employee.findMany({
    orderBy: { displayId: "asc" },
    select: { id: true, name: true, displayId: true, role: true },
  });

  const totalReceived = event.payments.reduce((a, p) => a + p.amount, 0);

  return (
    <>
      <Link
        href={`/admin/clients/${event.clientId}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-espresso"
      >
        <ArrowLeft className="size-4" /> Back to client
      </Link>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl text-espresso">
              {event.client.name}
            </h1>
            <EventTypeBadge type={event.type} />
            <EventStatusBadge status={event.status} />
          </div>
          <p className="mt-1 text-sm text-muted">
            {formatDateRange(event.eventDate, event.endDate)}
            {event.venue ? ` · ${event.venue}` : ""}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Proposal */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Proposal</CardTitle>
              {event.proposal && (
                <ProposalStatusBadge status={event.proposal.status} />
              )}
            </CardHeader>
            <CardContent>
              {event.proposal ? (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-muted">
                    Total{" "}
                    <span className="font-medium text-espresso">
                      {formatCurrency(event.proposal.total)}
                    </span>
                    {event.proposal.sentAt
                      ? ` · sent ${formatDate(event.proposal.sentAt)}`
                      : " · draft"}
                  </p>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/proposals/${event.proposal.id}`}>
                      Open builder
                    </Link>
                  </Button>
                </div>
              ) : (
                <form action={createProposal.bind(null, event.id)}>
                  <p className="mb-3 text-sm text-muted">
                    No proposal yet. Create one to edit the price page and send
                    it.
                  </p>
                  <Button type="submit" size="sm">
                    Create proposal
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Employee assignments + payouts */}
          <EventAssignments
            eventId={event.id}
            assignments={event.assignments.map((a) => ({
              id: a.id,
              employeeName: a.employee.name,
              employeeDisplayId: a.employee.displayId,
              payoutAmount: a.payoutAmount,
              isPaid: a.payout?.isPaid ?? false,
              payoutId: a.payout?.id ?? null,
            }))}
            employees={employees}
          />
        </div>

        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Event status</CardTitle>
            </CardHeader>
            <CardContent>
              <EventStatusControl id={event.id} status={event.status} />
            </CardContent>
          </Card>

          {/* Payments */}
          <Card>
            <CardHeader>
              <CardTitle>Payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-sand/60 px-4 py-3">
                <span className="text-xs uppercase tracking-wide text-muted">
                  Received
                </span>
                <span className="font-display text-xl text-espresso">
                  {formatCurrency(totalReceived)}
                </span>
              </div>

              {event.payments.length > 0 && (
                <ul className="divide-y divide-line text-sm">
                  {event.payments.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="text-muted">
                        {PAYMENT_TYPE[p.type].label} ·{" "}
                        {formatDate(p.receivedAt)}
                      </span>
                      <span className="font-medium text-espresso">
                        {formatCurrency(p.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <PaymentForm eventId={event.id} />
            </CardContent>
          </Card>

          {/* Invoice */}
          <InvoiceCard
            eventId={event.id}
            invoice={
              event.invoice
                ? {
                    id: event.invoice.id,
                    totalAmount: event.invoice.totalAmount,
                    advancePaid: event.invoice.advancePaid,
                    balanceDue: event.invoice.balanceDue,
                    sentAt: event.invoice.sentAt
                      ? formatDate(event.invoice.sentAt)
                      : null,
                  }
                : null
            }
            canCreate={Boolean(event.proposal)}
            proposalTotal={event.proposal?.total ?? 0}
            paid={totalReceived}
          />
        </div>
      </div>
    </>
  );
}
