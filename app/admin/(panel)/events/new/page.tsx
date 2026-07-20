import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/session";
import { PageHeader } from "@/components/admin/PageHeader";
import { EventForm } from "@/components/admin/EventForm";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function NewEventPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string }>;
}) {
  await requirePermission("events");
  const { clientId } = await searchParams;

  let fixedClient = undefined;
  if (clientId) {
    const c = await prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true, name: true, displayId: true },
    });
    if (!c) notFound();
    fixedClient = c;
  }

  const clients = fixedClient
    ? undefined
    : await prisma.client.findMany({
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, displayId: true },
      });

  return (
    <>
      <Link
        href={fixedClient ? `/admin/clients/${fixedClient.id}` : "/admin/events"}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-espresso"
      >
        <ArrowLeft className="size-4" /> Back
      </Link>
      <PageHeader title="New event" description="Link an event to a client." />
      <Card>
        <CardContent className="pt-6">
          <EventForm clients={clients} fixedClient={fixedClient} />
        </CardContent>
      </Card>
    </>
  );
}
