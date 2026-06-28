import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { Card, CardContent } from "@/components/ui/card";
import { ClientStatusBadge } from "@/components/admin/StatusBadge";
import { EmptyState } from "@/components/admin/PageHeader";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
        <p className="mt-2 font-display text-4xl text-espresso">{value}</p>
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  const user = await requireAdmin();

  const [leads, openClients, upcoming, recent] = await Promise.all([
    prisma.client.count({ where: { status: "LEAD" } }),
    prisma.client.count({
      where: { status: { in: ["POSITIVE", "PROPOSAL_SENT", "ADVANCE_RECEIVED"] } },
    }),
    prisma.event.count({ where: { status: "UPCOMING" } }),
    prisma.client.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-espresso">
          Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}.
        </h1>
        <p className="mt-1 text-sm text-muted">
          Here&apos;s what&apos;s happening at the studio.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="New leads" value={leads} />
        <StatCard label="In progress" value={openClients} />
        <StatCard label="Upcoming events" value={upcoming} />
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-espresso">Recent enquiries</h2>
          <Link
            href="/admin/leads"
            className="text-sm text-muted hover:text-espresso"
          >
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <EmptyState title="No enquiries yet" />
        ) : (
          <Card>
            <CardContent className="divide-y divide-line p-0">
              {recent.map((c) => (
                <Link
                  key={c.id}
                  href={`/admin/clients/${c.id}`}
                  className="flex items-center justify-between gap-3 px-6 py-4 hover:bg-espresso/[0.03]"
                >
                  <div>
                    <p className="font-medium text-espresso">{c.name}</p>
                    <p className="text-xs text-muted">
                      {c.displayId} · {formatDate(c.createdAt)}
                    </p>
                  </div>
                  <ClientStatusBadge status={c.status} />
                </Link>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
