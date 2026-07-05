import { PrismaClient } from "@prisma/client";
import { getFinance } from "@/lib/finance";
import { renderProposalPdf } from "@/lib/pdf/proposal";
import { renderInvoicePdf } from "@/lib/pdf/invoice";

const prisma = new PrismaClient();

let pass = 0;
let fail = 0;
function assert(name: string, cond: boolean, extra = "") {
  if (cond) {
    pass++;
    console.log(`  ✓ ${name}`);
  } else {
    fail++;
    console.log(`  ✗ ${name} ${extra}`);
  }
}

async function main() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  // Baseline finance before our scenario (so we assert deltas).
  const before = await getFinance({ month, year });

  // 1. Client (simulate qualified lead -> POSITIVE)
  const client = await prisma.client.create({
    data: {
      displayId: `CLT-VERIFY-${Date.now()}`,
      name: "Verify Couple",
      phone: "+91 90000 11111",
      email: "verify@example.com",
      status: "POSITIVE",
      source: "manual",
    },
  });

  // 2. Event
  const event = await prisma.event.create({
    data: {
      clientId: client.id,
      type: "WEDDING",
      eventDate: new Date(year, month - 1, 20),
      endDate: new Date(year, month - 1, 23),
      venue: "Garden Hall",
    },
  });

  // 3. Proposal
  const timeline = [
    {
      title: "Sangeet & Tilak",
      start: `${year}-${String(month).padStart(2, "0")}-21`,
      end: `${year}-${String(month).padStart(2, "0")}-21`,
      services: ["Traditional photography", "Cinematic film"],
    },
    {
      title: "Haldi & Wedding",
      start: `${year}-${String(month).padStart(2, "0")}-23`,
      end: `${year}-${String(month).padStart(2, "0")}-23`,
      services: ["Candid photography", "Drone"],
    },
  ];
  const deliverables = ["300 edited photos", "Cinematic film 3 min"];
  const terms = ["Avata drone cost will be extra."];
  const total = 75000;
  const proposal = await prisma.proposal.create({
    data: {
      eventId: event.id,
      timeline,
      deliverables,
      terms,
      total,
      status: "SENT",
      sentAt: new Date(),
    },
  });
  assert("proposal total persisted", proposal.total === 75000, `got ${proposal.total}`);

  // 4. Advance payment -> client ADVANCE_RECEIVED
  await prisma.payment.create({
    data: { eventId: event.id, type: "ADVANCE", amount: 30000 },
  });
  await prisma.client.update({
    where: { id: client.id },
    data: { status: "ADVANCE_RECEIVED" },
  });

  // 5. Assign two seeded employees with payouts, mark paid
  const emps = await prisma.employee.findMany({
    where: { displayId: { in: ["EMP-0001", "EMP-0002"] } },
  });
  assert("two seeded employees found", emps.length === 2);
  const payoutAmounts: Record<string, number> = {
    "EMP-0001": 20000,
    "EMP-0002": 10000,
  };
  const createdAssignmentIds: string[] = [];
  for (const emp of emps) {
    const amount = payoutAmounts[emp.displayId];
    const assignment = await prisma.eventAssignment.create({
      data: { eventId: event.id, employeeId: emp.id, payoutAmount: amount },
    });
    createdAssignmentIds.push(assignment.id);
    await prisma.payout.create({
      data: {
        assignmentId: assignment.id,
        employeeId: emp.id,
        amount,
        isPaid: true,
        paidAt: new Date(),
      },
    });
  }

  // 6. Invoice = total, advancePaid, balanceDue
  const advancePaid = 30000;
  const invoice = await prisma.invoice.create({
    data: {
      eventId: event.id,
      totalAmount: total,
      advancePaid,
      balanceDue: total - advancePaid,
    },
  });
  assert("invoice balance = total - advance", invoice.balanceDue === 45000, `got ${invoice.balanceDue}`);

  // 7. Final payment + complete
  await prisma.payment.create({
    data: { eventId: event.id, type: "FINAL", amount: invoice.balanceDue },
  });
  await prisma.event.update({ where: { id: event.id }, data: { status: "COMPLETED" } });
  await prisma.client.update({ where: { id: client.id }, data: { status: "COMPLETED" } });

  // 8. Finance deltas
  const after = await getFinance({ month, year });
  const receivedDelta = after.totalReceived - before.totalReceived;
  const paidDelta = after.totalPaid - before.totalPaid;
  assert("finance received delta = 30000 + 45000", receivedDelta === 75000, `got ${receivedDelta}`);
  assert("finance paid-to-employees delta = 30000", paidDelta === 30000, `got ${paidDelta}`);
  assert("finance net delta = 45000", after.net - before.net === 45000, `got ${after.net - before.net}`);

  const evRow = after.perEvent.find((e) => e.eventId === event.id);
  assert("per-event revenue = 75000", evRow?.revenue === 75000, `got ${evRow?.revenue}`);
  assert("per-event cost = 30000", evRow?.cost === 30000, `got ${evRow?.cost}`);
  assert("per-event net = 45000", evRow?.net === 45000, `got ${evRow?.net}`);

  const emp1 = after.perEmployee.find((e) => e.displayId === "EMP-0001");
  assert("per-employee EMP-0001 includes its 20000 payout", (emp1?.paid ?? 0) >= 20000);

  // 9. PDF rendering
  const proposalPdf = await renderProposalPdf({
    proposalNumber: "TEST01",
    clientName: client.name,
    clientEmail: client.email,
    eventType: "Wedding",
    eventKind: "WEDDING",
    eventDate: "20 Jun 2026 – 23 Jun 2026",
    venue: "Garden Hall",
    timeline,
    deliverables,
    terms,
    total,
    notes: "Thank you.",
    date: "29 Jun 2026",
  });
  assert("proposal PDF renders (PDF header)", proposalPdf.length > 1000 && proposalPdf.subarray(0, 4).toString() === "%PDF", `len ${proposalPdf.length}`);

  const invoicePdf = await renderInvoicePdf({
    invoiceNumber: "TEST01",
    clientName: client.name,
    clientEmail: client.email,
    eventType: "Wedding",
    eventDate: "20 Jun 2026",
    totalAmount: total,
    advancePaid,
    balanceDue: total - advancePaid,
    date: "29 Jun 2026",
  });
  assert("invoice PDF renders (PDF header)", invoicePdf.length > 1000 && invoicePdf.subarray(0, 4).toString() === "%PDF", `len ${invoicePdf.length}`);

  // 10. Cleanup everything we created (leave DB as seeded + website lead)
  await prisma.payout.deleteMany({ where: { assignmentId: { in: createdAssignmentIds } } });
  await prisma.eventAssignment.deleteMany({ where: { id: { in: createdAssignmentIds } } });
  await prisma.invoice.delete({ where: { id: invoice.id } });
  await prisma.payment.deleteMany({ where: { eventId: event.id } });
  await prisma.proposal.delete({ where: { id: proposal.id } });
  await prisma.event.delete({ where: { id: event.id } });
  await prisma.client.delete({ where: { id: client.id } });
  console.log("  ✓ cleanup complete");

  console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
  process.exit(fail === 0 ? 0 : 1);
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
