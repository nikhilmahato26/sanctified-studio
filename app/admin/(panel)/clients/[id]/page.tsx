import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ClientStatusBadge,
  EventStatusBadge,
  EventTypeBadge,
} from "@/components/admin/StatusBadge";
import { ClientStatusControl } from "@/components/admin/ClientStatusControl";
import { ClientEditForm } from "@/components/admin/ClientEditForm";
import { EmptyState } from "@/components/admin/PageHeader";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      events: {
        orderBy: { eventDate: "asc" },
        include: { proposal: true, invoice: true },
      },
    },
  });

  if (!client) notFound();

  return (
    <>
      <Link
        href="/admin/leads"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-espresso"
      >
        <ArrowLeft className="size-4" /> Back to leads
      </Link>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl text-espresso">
              {client.name}
            </h1>
            <ClientStatusBadge status={client.status} />
          </div>
          <p className="mt-1 font-mono text-xs text-muted">
            {client.displayId} · {client.source ?? "—"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ClientStatusControl id={client.id} status={client.status} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Events</CardTitle>
              <Button asChild size="sm" variant="outline">
                <Link href={`/admin/events/new?clientId=${client.id}`}>
                  <Plus className="size-4" /> New event
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {client.events.length === 0 ? (
                <EmptyState
                  title="No events yet"
                  hint="Create an event to start a proposal."
                />
              ) : (
                <ul className="divide-y divide-line">
                  {client.events.map((e) => (
                    <li
                      key={e.id}
                      className="flex flex-wrap items-center justify-between gap-3 py-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <EventTypeBadge type={e.type} />
                          <EventStatusBadge status={e.status} />
                        </div>
                        <p className="mt-1 text-sm text-muted">
                          {formatDate(e.eventDate)}
                          {e.venue ? ` · ${e.venue}` : ""}
                        </p>
                      </div>
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/admin/events/${e.id}`}>Open</Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">
                  Phone
                </p>
                <p className="text-espresso">{client.phone}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">
                  Email
                </p>
                <p className="text-espresso">{client.email}</p>
              </div>
              {client.address && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted">
                    Address
                  </p>
                  <p className="text-espresso">{client.address}</p>
                </div>
              )}
              <div className="pt-2">
                <ClientEditForm client={client} />
              </div>
            </CardContent>
          </Card>

          {client.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-espresso/80">
                  {client.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
