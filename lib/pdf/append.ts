import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument } from "pdf-lib";


/**
 * Hand-designed closing pages live here as PDFs. Drop a file per event kind
 * ("wedding.pdf", "baby-shower.pdf") and/or a shared "default.pdf" fallback.
 * Whatever pages the matching file contains are appended to the end of the
 * generated proposal. See assets/proposal-pages/README.md.
 */
const PAGES_DIR = path.join(process.cwd(), "assets", "proposal-pages");

/** Map an event kind to its file stem, e.g. WEDDING -> "wedding". */
function fileStem(kind: string): string {
  return kind.toLowerCase().replace(/_/g, "-");
}

/**
 * Load the designed closing PDF for an event kind. Prefers an event-specific
 * file (e.g. wedding.pdf), then falls back to a shared default.pdf. Returns the
 * bytes, or null when no designed file has been supplied yet.
 */
async function loadDesignedPdf(kind: string): Promise<Buffer | null> {
  for (const name of [`${fileStem(kind)}.pdf`, "default.pdf"]) {
    try {
      return await readFile(path.join(PAGES_DIR, name));
    } catch {
      // File not present — try the next candidate.
    }
  }
  return null;
}

/**
 * Appends the pages of the hand-designed PDF for `kind` to the end of an
 * already-generated proposal. When no designed file exists, the proposal is
 * returned unchanged, so this is always safe to call.
 */
export async function appendDesignedPages(
  base: Buffer,
  kind: string,
): Promise<Buffer> {
  const designed = await loadDesignedPdf(kind);
  if (!designed) return base;

  const doc = await PDFDocument.load(base);
  const extra = await PDFDocument.load(designed);
  const pages = await doc.copyPages(extra, extra.getPageIndices());
  pages.forEach((page) => doc.addPage(page));

  return Buffer.from(await doc.save());
}
