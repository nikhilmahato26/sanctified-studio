import { prisma } from "@/lib/prisma";

import { formatDate } from "@/lib/utils";

export interface FinanceQuery {
  month: number; // 1-12
  year: number;
}

export interface EmployeeBreakdown {
  employeeId: string;
  displayId: string;
  name: string;
  paid: number;
}

export interface EventBreakdown {
  eventId: string;
  label: string;
  revenue: number;
  cost: number;
  net: number;
}

export interface FinanceSummary {
  month: number;
  year: number;
  totalReceived: number;
  totalPaid: number;
  net: number;
  perEmployee: EmployeeBreakdown[];
  perEvent: EventBreakdown[];
}

/** Aggregates finance for a given month/year. Payments by receivedAt, payouts by paidAt. */
export async function getFinance({
  month,
  year,
}: FinanceQuery): Promise<FinanceSummary> {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const [payments, paidPayouts] = await Promise.all([
    prisma.payment.findMany({
      where: { receivedAt: { gte: start, lt: end } },
      include: { event: { include: { client: true } } },
    }),
    prisma.payout.findMany({
      where: { isPaid: true, paidAt: { gte: start, lt: end } },
      include: {
        employee: true,
        assignment: { include: { event: { include: { client: true } } } },
      },
    }),
  ]);

  const totalReceived = payments.reduce((a, p) => a + p.amount, 0);
  const totalPaid = paidPayouts.reduce((a, p) => a + p.amount, 0);

  // Per-employee
  const empMap = new Map<string, EmployeeBreakdown>();
  for (const p of paidPayouts) {
    const cur = empMap.get(p.employeeId) ?? {
      employeeId: p.employeeId,
      displayId: p.employee.displayId,
      name: p.employee.name,
      paid: 0,
    };
    cur.paid += p.amount;
    empMap.set(p.employeeId, cur);
  }

  // Per-event (revenue from payments, cost from paid payouts)
  const eventMap = new Map<
    string,
    { label: string; revenue: number; cost: number }
  >();
  function labelFor(event: {
    client: { name: string };
    type: string;
    eventDate: Date;
  }) {
    return `${event.client.name} · ${event.type} · ${formatDate(
      event.eventDate,
    )}`;
  }
  for (const p of payments) {
    const cur = eventMap.get(p.eventId) ?? {
      label: labelFor(p.event),
      revenue: 0,
      cost: 0,
    };
    cur.revenue += p.amount;
    eventMap.set(p.eventId, cur);
  }
  for (const p of paidPayouts) {
    const ev = p.assignment.event;
    const cur = eventMap.get(ev.id) ?? {
      label: labelFor(ev),
      revenue: 0,
      cost: 0,
    };
    cur.cost += p.amount;
    eventMap.set(ev.id, cur);
  }

  const perEmployee = [...empMap.values()].sort((a, b) => b.paid - a.paid);
  const perEvent: EventBreakdown[] = [...eventMap.entries()]
    .map(([eventId, v]) => ({
      eventId,
      label: v.label,
      revenue: v.revenue,
      cost: v.cost,
      net: v.revenue - v.cost,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  return {
    month,
    year,
    totalReceived,
    totalPaid,
    net: totalReceived - totalPaid,
    perEmployee,
    perEvent,
  };
}
