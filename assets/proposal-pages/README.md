# Proposal closing pages

Drop your hand-designed PDF here and it is appended as the final page(s) of the
generated proposal automatically — no code changes needed.

## File names

The code looks for these files, in order, for each proposal:

| Event type   | Preferred file     | Fallback      |
| ------------ | ------------------ | ------------- |
| Wedding      | `wedding.pdf`      | `default.pdf` |
| Baby shower  | `baby-shower.pdf`  | `default.pdf` |

- Put a **per-event-type** file (`wedding.pdf` / `baby-shower.pdf`) if the
  closing page differs by event.
- Put a single **`default.pdf`** if the same closing page is used for everything.
- The file may contain **one page or several** — all of its pages are appended.
- If no matching file is here, proposals generate normally without a closing page.

The merge happens in `lib/pdf/append.ts`, called from the proposal PDF route.
These files are bundled into the deployment via `outputFileTracingIncludes`
in `next.config.ts`.
