import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  EventTypeBadge,
  ProposalStatusBadge,
} from "@/components/admin/StatusBadge";
import { ProposalEditor } from "@/components/admin/ProposalEditor";
import { parseTimeline, parseStringList } from "@/lib/pdf/types";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProposalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("finance");
  const { id } = await params;

  const proposal = await prisma.proposal.findUnique({
    where: { id },
    include: { event: { include: { client: true } } },
  });
  if (!proposal) notFound();

  const { event } = proposal;

  return (
    <>
      <Link
        href={`/admin/events/${event.id}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-espresso"
      >
        <ArrowLeft className="size-4" /> Back to event
      </Link>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-espresso">Proposal</h1>
          <p className="mt-1 text-sm text-muted">
            For {event.client.name} ·{" "}
            <span className="font-mono text-xs">
              No. {id.slice(-6).toUpperCase()}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <EventTypeBadge type={event.type} />
          <ProposalStatusBadge status={proposal.status} />
        </div>
      </div>

      {proposal.sentAt && (
        <p className="mb-4 text-sm text-emerald-700">
          Sent to {event.client.email} on {formatDate(proposal.sentAt)}.
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Proposal builder</CardTitle>
        </CardHeader>
        <CardContent>
          <ProposalEditor
            proposalId={proposal.id}
            initialTimeline={parseTimeline(proposal.timeline)}
            initialDeliverables={parseStringList(proposal.deliverables)}
            initialTerms={parseStringList(proposal.terms)}
            initialTotal={proposal.total}
            initialNotes={proposal.notes ?? ""}
            status={proposal.status}
          />
        </CardContent>
      </Card>
    </>
  );
}
