import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as INR currency. */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format a date as e.g. "12 Aug 2026". */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * Format a start/end pair as a range, e.g. "21 Nov 2026 – 24 Nov 2026".
 * Falls back to a single date when there is no end (or it matches the start).
 */
export function formatDateRange(
  start: Date | string,
  end?: Date | string | null,
): string {
  const startStr = formatDate(start);
  if (!end) return startStr;
  const endStr = formatDate(end);
  return endStr === startStr ? startStr : `${startStr} – ${endStr}`;
}

/** Convert a Date to a "yyyy-mm-dd" string for <input type="date">. */
export function toDateInput(date: Date | string): string {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
