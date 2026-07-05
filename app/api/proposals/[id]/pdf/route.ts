import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { renderProposalPdf } from "@/lib/pdf/proposal";
import { parseTimeline, parseStringList } from "@/lib/pdf/types";
import { formatDate, formatDateRange } from "@/lib/utils";
import { EVENT_TYPE } from "@/lib/status";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await ctx.params;
  const proposal = await prisma.proposal.findUnique({
    where: { id },
    include: { event: { include: { client: true } } },
  });
  if (!proposal) return new Response("Not found", { status: 404 });

  const { event } = proposal;
  const pdf = await renderProposalPdf({
    proposalNumber: id.slice(-6).toUpperCase(),
    clientName: event.client.name,
    clientEmail: event.client.email,
    eventType: EVENT_TYPE[event.type].label,
    eventKind: event.type,
    eventDate: formatDateRange(event.eventDate, event.endDate),
    venue: event.venue,
    timeline: parseTimeline(proposal.timeline),
    deliverables: parseStringList(proposal.deliverables),
    terms: parseStringList(proposal.terms),
    total: proposal.total,
    notes: proposal.notes,
    date: formatDate(new Date()),
  });

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="proposal-${id.slice(-6)}.pdf"`,
    },
  });
}
