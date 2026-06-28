// Exercises the real PDF route handlers through the running dev server
// (where server-only is properly aliased by Next). No server-only imports here.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const base = "http://localhost:3000";

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

const jar: Record<string, string> = {};
function store(res: Response) {
  for (const c of res.headers.getSetCookie?.() ?? []) {
    const [pair] = c.split(";");
    const idx = pair.indexOf("=");
    jar[pair.slice(0, idx)] = pair.slice(idx + 1);
  }
}
function cookieHeader() {
  return Object.entries(jar)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}

async function login(email: string, password: string) {
  const csrfRes = await fetch(`${base}/api/auth/csrf`);
  store(csrfRes);
  const { csrfToken } = await csrfRes.json();

  const body = new URLSearchParams({
    csrfToken,
    email,
    password,
    callbackUrl: `${base}/admin/dashboard`,
  });
  const res = await fetch(`${base}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      cookie: cookieHeader(),
    },
    body,
    redirect: "manual",
  });
  store(res);
  return Boolean(jar["authjs.session-token"] || jar["__Secure-authjs.session-token"]);
}

async function main() {
  // Seed scenario data
  const client = await prisma.client.create({
    data: {
      displayId: `CLT-PDF-${Date.now()}`,
      name: "PDF Test",
      phone: "+91 90000 22222",
      email: "pdf@example.com",
      status: "PROPOSAL_SENT",
      source: "manual",
    },
  });
  const event = await prisma.event.create({
    data: { clientId: client.id, type: "WEDDING", eventDate: new Date(), venue: "Hall" },
  });
  const proposal = await prisma.proposal.create({
    data: {
      eventId: event.id,
      lineItems: [{ label: "Coverage", amount: 50000 }],
      total: 50000,
      status: "SENT",
    },
  });
  const invoice = await prisma.invoice.create({
    data: { eventId: event.id, totalAmount: 50000, advancePaid: 20000, balanceDue: 30000 },
  });

  // Unauthenticated PDF request should be rejected
  const unauth = await fetch(`${base}/api/proposals/${proposal.id}/pdf`);
  assert("PDF route rejects unauthenticated (401)", unauth.status === 401, `got ${unauth.status}`);

  // Login
  const ok = await login("admin@sanctifiedstudio.com", "changeme123");
  assert("admin login establishes session cookie", ok);

  // Proposal PDF
  const pRes = await fetch(`${base}/api/proposals/${proposal.id}/pdf`, {
    headers: { cookie: cookieHeader() },
  });
  const pBuf = Buffer.from(await pRes.arrayBuffer());
  assert(
    "proposal PDF downloads as application/pdf",
    pRes.status === 200 && (pRes.headers.get("content-type") ?? "").includes("pdf"),
    `status ${pRes.status} type ${pRes.headers.get("content-type")}`,
  );
  assert("proposal PDF has %PDF header", pBuf.subarray(0, 4).toString() === "%PDF", `len ${pBuf.length}`);

  // Invoice PDF
  const iRes = await fetch(`${base}/api/invoices/${invoice.id}/pdf`, {
    headers: { cookie: cookieHeader() },
  });
  const iBuf = Buffer.from(await iRes.arrayBuffer());
  assert("invoice PDF has %PDF header", iRes.status === 200 && iBuf.subarray(0, 4).toString() === "%PDF", `status ${iRes.status} len ${iBuf.length}`);

  // Cleanup
  await prisma.invoice.delete({ where: { id: invoice.id } });
  await prisma.proposal.delete({ where: { id: proposal.id } });
  await prisma.event.delete({ where: { id: event.id } });
  await prisma.client.delete({ where: { id: client.id } });
  console.log("  ✓ cleanup complete");

  console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
  await prisma.$disconnect();
  process.exit(fail === 0 ? 0 : 1);
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
