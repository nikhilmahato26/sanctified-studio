import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/session";
import { PageHeader, EmptyState } from "@/components/admin/PageHeader";
import { ClientStatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  await requirePermission("clients");

  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { events: true } } },
  });

  return (
    <>
      <PageHeader
        title="Leads & clients"
        description="Everyone who has enquired or been added manually."
        action={
          <Button asChild>
            <Link href="/admin/clients/new">
              <Plus className="size-4" /> Add client
            </Link>
          </Button>
        }
      />

      {clients.length === 0 ? (
        <EmptyState
          title="No clients yet"
          hint="Website enquiries and manual additions will appear here."
        />
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <THead>
              <TR>
                <TH>ID</TH>
                <TH>Name</TH>
                <TH>Contact</TH>
                <TH>Source</TH>
                <TH>Events</TH>
                <TH>Status</TH>
                <TH>Added</TH>
              </TR>
            </THead>
            <TBody>
              {clients.map((c) => (
                <TR key={c.id} className="hover:bg-espresso/[0.03]">
                  <TD className="font-mono text-xs text-muted">{c.displayId}</TD>
                  <TD>
                    <Link
                      href={`/admin/clients/${c.id}`}
                      className="font-medium text-espresso hover:underline"
                    >
                      {c.name}
                    </Link>
                    {c.notes && (
                      <div className="mt-1 max-w-[250px] whitespace-pre-wrap text-xs text-muted line-clamp-3" title={c.notes}>
                        {c.notes}
                      </div>
                    )}
                  </TD>
                  <TD className="text-muted">
                    <div>{c.phone}</div>
                    <div className="text-xs">{c.email}</div>
                  </TD>
                  <TD>
                    <Badge tone={c.source === "website" ? "blue" : "neutral"}>
                      {c.source ?? "—"}
                    </Badge>
                  </TD>
                  <TD className="text-muted">{c._count.events}</TD>
                  <TD>
                    <ClientStatusBadge status={c.status} />
                  </TD>
                  <TD className="text-xs text-muted">
                    {formatDate(c.createdAt)}
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
