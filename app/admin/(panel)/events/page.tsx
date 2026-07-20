import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/session";
import { PageHeader, EmptyState } from "@/components/admin/PageHeader";
import {
  EventStatusBadge,
  EventTypeBadge,
  ProposalStatusBadge,
} from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  await requirePermission("events");

  const events = await prisma.event.findMany({
    orderBy: { eventDate: "asc" },
    include: { client: true, proposal: true, invoice: true },
  });

  return (
    <>
      <PageHeader
        title="Events"
        description="Every shoot, with its proposal and billing status."
        action={
          <Button asChild>
            <Link href="/admin/events/new">
              <Plus className="size-4" /> New event
            </Link>
          </Button>
        }
      />

      {events.length === 0 ? (
        <EmptyState
          title="No events yet"
          hint="Create an event from a client's page or here."
        />
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <THead>
              <TR>
                <TH>Date</TH>
                <TH>Client</TH>
                <TH>Type</TH>
                <TH>Status</TH>
                <TH>Proposal</TH>
                <TH>Invoice</TH>
                <TH />
              </TR>
            </THead>
            <TBody>
              {events.map((e) => (
                <TR key={e.id} className="hover:bg-espresso/[0.03]">
                  <TD className="whitespace-nowrap">{formatDate(e.eventDate)}</TD>
                  <TD>
                    <Link
                      href={`/admin/clients/${e.clientId}`}
                      className="text-espresso hover:underline"
                    >
                      {e.client.name}
                    </Link>
                  </TD>
                  <TD>
                    <EventTypeBadge type={e.type} />
                  </TD>
                  <TD>
                    <EventStatusBadge status={e.status} />
                  </TD>
                  <TD>
                    {e.proposal ? (
                      <ProposalStatusBadge status={e.proposal.status} />
                    ) : (
                      <span className="text-xs text-muted">—</span>
                    )}
                  </TD>
                  <TD>
                    {e.invoice ? (
                      <Badge tone="green">Created</Badge>
                    ) : (
                      <span className="text-xs text-muted">—</span>
                    )}
                  </TD>
                  <TD>
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/admin/events/${e.id}`}>Open</Link>
                    </Button>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      )}
    </>
  );
}
