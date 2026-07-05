import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { getFinance } from "@/lib/finance";
import { PageHeader, EmptyState } from "@/components/admin/PageHeader";
import { FinanceFilter } from "@/components/admin/FinanceFilter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "net";
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
        <p
          className={cn(
            "mt-2 font-display text-3xl",
            accent === "net" ? "text-clay" : "text-espresso",
          )}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

export default async function FinancePage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const now = new Date();
  const month = Number(sp.month) || now.getMonth() + 1;
  const year = Number(sp.year) || now.getFullYear();

  const data = await getFinance({ month, year });

  return (
    <>
      <PageHeader
        title="Finance"
        description="Money in, money out — by month."
        action={<FinanceFilter month={month} year={year} />}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Total received"
          value={formatCurrency(data.totalReceived)}
        />
        <SummaryCard
          label="Paid to employees"
          value={formatCurrency(data.totalPaid)}
        />
        <SummaryCard label="Net" value={formatCurrency(data.net)} accent="net" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Per employee</CardTitle>
          </CardHeader>
          <CardContent>
            {data.perEmployee.length === 0 ? (
              <EmptyState title="No payouts this month" />
            ) : (
              <Table>
                <THead>
                  <TR>
                    <TH>Employee</TH>
                    <TH className="text-right">Paid</TH>
                  </TR>
                </THead>
                <TBody>
                  {data.perEmployee.map((e) => (
                    <TR key={e.employeeId}>
                      <TD>
                        <Link
                          href={`/admin/employees/${e.employeeId}`}
                          className="text-espresso hover:underline"
                        >
                          {e.name}
                        </Link>
                        <div className="font-mono text-xs text-muted">
                          {e.displayId}
                        </div>
                      </TD>
                      <TD className="text-right font-medium">
                        {formatCurrency(e.paid)}
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Per event</CardTitle>
          </CardHeader>
          <CardContent>
            {data.perEvent.length === 0 ? (
              <EmptyState title="No activity this month" />
            ) : (
              <Table>
                <THead>
                  <TR>
                    <TH>Event</TH>
                    <TH className="text-right">Revenue</TH>
                    <TH className="text-right">Cost</TH>
                    <TH className="text-right">Net</TH>
                  </TR>
                </THead>
                <TBody>
                  {data.perEvent.map((e) => (
                    <TR key={e.eventId}>
                      <TD className="max-w-44">
                        <span className="text-espresso">{e.label}</span>
                      </TD>
                      <TD className="text-right">
                        {formatCurrency(e.revenue)}
                      </TD>
                      <TD className="text-right text-muted">
                        {formatCurrency(e.cost)}
                      </TD>
                      <TD className="text-right font-medium">
                        {formatCurrency(e.net)}
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
