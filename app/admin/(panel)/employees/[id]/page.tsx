import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { EventTypeBadge } from "@/components/admin/StatusBadge";
import { EmptyState } from "@/components/admin/PageHeader";
import { PayoutPaidButton } from "@/components/admin/PayoutPaidButton";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "clay";
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
        <p
          className={cn(
            "mt-2 font-display text-3xl",
            accent === "clay" ? "text-clay" : "text-espresso",
          )}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

export default async function EmployeeProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const employee = await prisma.employee.findUnique({
    where: { id },
    include: {
      assignments: {
        orderBy: { event: { eventDate: "desc" } },
        include: {
          payout: true,
          event: { include: { client: true } },
        },
      },
    },
  });
  if (!employee) notFound();

  const paid = employee.assignments
    .filter((a) => a.payout?.isPaid)
    .reduce((sum, a) => sum + (a.payout?.amount ?? 0), 0);
  const pending = employee.assignments
    .filter((a) => a.payout && !a.payout.isPaid)
    .reduce((sum, a) => sum + (a.payout?.amount ?? 0), 0);

  return (
    <>
      <Link
        href="/admin/employees"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-espresso"
      >
        <ArrowLeft className="size-4" /> Back to employees
      </Link>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl text-espresso">
              {employee.name}
            </h1>
            <Badge tone="neutral">{employee.role}</Badge>
          </div>
          <p className="mt-1 font-mono text-xs text-muted">
            {employee.displayId} · {employee.email} · {employee.phone}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Total paid" value={formatCurrency(paid)} />
        <SummaryCard
          label="Pending"
          value={formatCurrency(pending)}
          accent="clay"
        />
        <SummaryCard
          label="Events worked"
          value={String(employee.assignments.length)}
        />
      </div>

      <Card className="mt-8 overflow-hidden">
        <CardHeader>
          <CardTitle>Payout history</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {employee.assignments.length === 0 ? (
            <div className="px-6 pb-6">
              <EmptyState
                title="No events yet"
                hint="Assign this employee to an event to record a payout."
              />
            </div>
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Event</TH>
                  <TH>Date</TH>
                  <TH className="text-right">Amount</TH>
                  <TH>Status</TH>
                  <TH />
                </TR>
              </THead>
              <TBody>
                {employee.assignments.map((a) => (
                  <TR key={a.id}>
                    <TD>
                      <Link
                        href={`/admin/events/${a.event.id}`}
                        className="font-medium text-espresso hover:underline"
                      >
                        {a.event.client.name}
                      </Link>
                      <div className="mt-1">
                        <EventTypeBadge type={a.event.type} />
                      </div>
                    </TD>
                    <TD className="text-muted">
                      {formatDate(a.event.eventDate)}
                    </TD>
                    <TD className="text-right font-medium">
                      {formatCurrency(a.payoutAmount)}
                    </TD>
                    <TD>
                      {a.payout?.isPaid ? (
                        <div>
                          <Badge tone="green">Paid</Badge>
                          {a.payout.paidAt && (
                            <div className="mt-1 text-xs text-muted">
                              {formatDate(a.payout.paidAt)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Badge tone="amber">Unpaid</Badge>
                      )}
                    </TD>
                    <TD className="text-right">
                      {a.payout && (
                        <PayoutPaidButton
                          payoutId={a.payout.id}
                          eventId={a.event.id}
                          isPaid={a.payout.isPaid}
                        />
                      )}
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
