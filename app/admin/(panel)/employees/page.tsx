import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { PageHeader, EmptyState } from "@/components/admin/PageHeader";
import { EmployeeForm } from "@/components/admin/EmployeeForm";
import { DeleteEmployeeButton } from "@/components/admin/DeleteEmployeeButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function EmployeesPage() {
  await requireAdmin();

  const employees = await prisma.employee.findMany({
    orderBy: { displayId: "asc" },
    include: { payouts: true },
  });

  const rows = employees.map((e) => {
    const paid = e.payouts
      .filter((p) => p.isPaid)
      .reduce((a, p) => a + p.amount, 0);
    const pending = e.payouts
      .filter((p) => !p.isPaid)
      .reduce((a, p) => a + p.amount, 0);
    return { ...e, paid, pending };
  });

  return (
    <>
      <PageHeader
        title="Employees"
        description="Your team and what they're owed."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {rows.length === 0 ? (
            <EmptyState title="No employees yet" hint="Add your team below." />
          ) : (
            <Card className="overflow-hidden">
              <Table>
                <THead>
                  <TR>
                    <TH>ID</TH>
                    <TH>Name</TH>
                    <TH>Role</TH>
                    <TH>Paid</TH>
                    <TH>Pending</TH>
                    <TH />
                  </TR>
                </THead>
                <TBody>
                  {rows.map((e) => (
                    <TR key={e.id}>
                      <TD className="font-mono text-xs text-muted">
                        {e.displayId}
                      </TD>
                      <TD>
                        <Link
                          href={`/admin/employees/${e.id}`}
                          className="font-medium text-espresso hover:underline"
                        >
                          {e.name}
                        </Link>
                        <div className="text-xs text-muted">{e.email}</div>
                      </TD>
                      <TD className="text-muted">{e.role}</TD>
                      <TD>{formatCurrency(e.paid)}</TD>
                      <TD>
                        {e.pending > 0 ? (
                          <Badge tone="amber">{formatCurrency(e.pending)}</Badge>
                        ) : (
                          <span className="text-xs text-muted">—</span>
                        )}
                      </TD>
                      <TD>
                        <DeleteEmployeeButton id={e.id} />
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Add employee</CardTitle>
            </CardHeader>
            <CardContent>
              <EmployeeForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
