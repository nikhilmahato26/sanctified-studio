export interface LineItem {
  label: string;
  amount: number;
}

/** Safely coerce the Prisma Json field into LineItem[]. */
export function parseLineItems(value: unknown): LineItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (v): v is { label: unknown; amount: unknown } =>
        typeof v === "object" && v !== null && "label" in v && "amount" in v,
    )
    .map((v) => ({
      label: String(v.label),
      amount: Number(v.amount) || 0,
    }));
}

export function sumLineItems(items: LineItem[]): number {
  return items.reduce((acc, i) => acc + (Number(i.amount) || 0), 0);
}
