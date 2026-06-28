import type { Prisma, PrismaClient } from "@prisma/client";

type Tx = Prisma.TransactionClient | PrismaClient;

/** Zero-pad a number to 4 digits with a prefix, e.g. nextDisplayId("CLT", 3) -> "CLT-0004" */
function format(prefix: string, count: number): string {
  return `${prefix}-${String(count + 1).padStart(4, "0")}`;
}

/** Next client display id (CLT-0001). Call inside a transaction to avoid collisions. */
export async function nextClientDisplayId(tx: Tx): Promise<string> {
  const count = await tx.client.count();
  return format("CLT", count);
}

/** Next employee display id (EMP-0001). Call inside a transaction to avoid collisions. */
export async function nextEmployeeDisplayId(tx: Tx): Promise<string> {
  const count = await tx.employee.count();
  return format("EMP", count);
}
