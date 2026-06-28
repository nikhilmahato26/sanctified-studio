import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { renderInvoicePdf } from "@/lib/pdf/invoice";
import { formatDate } from "@/lib/utils";
import { EVENT_TYPE } from "@/lib/status";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  const { id } = await ctx.params;
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { event: { include: { client: true } } },
  });
  if (!invoice) return new Response("Not found", { status: 404 });

  const { event } = invoice;
  const pdf = await renderInvoicePdf({
    invoiceNumber: id.slice(-6).toUpperCase(),
    clientName: event.client.name,
    clientEmail: event.client.email,
    eventType: EVENT_TYPE[event.type].label,
    eventDate: formatDate(event.eventDate),
    totalAmount: invoice.totalAmount,
    advancePaid: invoice.advancePaid,
    balanceDue: invoice.balanceDue,
    date: formatDate(new Date()),
  });

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="invoice-${id.slice(-6)}.pdf"`,
    },
  });
}
