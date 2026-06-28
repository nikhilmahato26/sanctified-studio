"use client";

import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/select";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function FinanceFilter({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  const router = useRouter();
  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => thisYear - i);

  function go(nextMonth: number, nextYear: number) {
    router.push(`/admin/finance?month=${nextMonth}&year=${nextYear}`);
  }

  return (
    <div className="flex gap-2">
      <Select
        value={month}
        onChange={(e) => go(Number(e.target.value), year)}
        className="w-40"
      >
        {MONTHS.map((m, i) => (
          <option key={m} value={i + 1}>
            {m}
          </option>
        ))}
      </Select>
      <Select
        value={year}
        onChange={(e) => go(month, Number(e.target.value))}
        className="w-28"
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </Select>
    </div>
  );
}
