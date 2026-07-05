/** A single stage of the event timeline (e.g. one day of a wedding). */
export interface TimelineItem {
  title: string;
  /** ISO date string, e.g. "2026-11-21". Empty string when unset. */
  start: string;
  /** ISO date string, e.g. "2026-11-21". Empty string when unset. */
  end: string;
  /** Services covered during this stage. */
  services: string[];
}

/** Safely coerce the Prisma Json field into TimelineItem[]. */
export function parseTimeline(value: unknown): TimelineItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is Record<string, unknown> => typeof v === "object" && v !== null)
    .map((v) => ({
      title: String(v.title ?? ""),
      start: String(v.start ?? ""),
      end: String(v.end ?? ""),
      services: parseStringList(v.services),
    }));
}

/** Safely coerce the Prisma Json field into a list of strings. */
export function parseStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) => String(v)).filter((s) => s.trim().length > 0);
}
