import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { nextClientDisplayId } from "@/lib/ids";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(3, "Phone is required"),
  email: z.string().email("A valid email is required"),
  eventType: z.enum(["WEDDING", "BABY_SHOWER"]).optional(),
  preferredDate: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }

  const { name, phone, email, eventType, preferredDate, message } = parsed.data;

  // Fold the enquiry's event interest + date into the lead notes for the admin.
  const noteParts: string[] = [];
  if (eventType)
    noteParts.push(`Interest: ${eventType === "WEDDING" ? "Wedding" : "Baby shower"}`);
  if (preferredDate) noteParts.push(`Preferred date: ${preferredDate}`);
  if (message) noteParts.push(message);
  const notes = noteParts.join("\n") || null;

  try {
    const client = await prisma.$transaction(async (tx) => {
      const displayId = await nextClientDisplayId(tx);
      return tx.client.create({
        data: {
          displayId,
          name,
          phone,
          email,
          status: "LEAD",
          source: "website",
          notes,
        },
      });
    });

    return NextResponse.json(
      { ok: true, displayId: client.displayId },
      { status: 201 },
    );
  } catch (err) {
    console.error("Enquiry create failed:", err);
    return NextResponse.json(
      { error: "Could not submit your enquiry. Please try again." },
      { status: 500 },
    );
  }
}
