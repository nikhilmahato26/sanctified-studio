"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

interface Category {
  id: string;
  name: string;
}

export function EnquiryForm({ categories = [] }: { categories?: Category[] }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong.");
      }
      setStatus("done");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-line bg-white/70 p-8 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-sage/30">
          <Check className="size-6 text-espresso" />
        </div>
        <h3 className="mt-4 font-display text-2xl text-espresso">
          Thank you — we&apos;ll be in touch.
        </h3>
        <p className="mt-2 text-muted">
          Your enquiry has reached us. We usually reply within a day or two.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-line bg-white/70 p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="name">Your name</Label>
          <Input id="name" name="name" required placeholder="Jane Doe" />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            required
            placeholder="+91 98274 11116"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@email.com"
          />
        </div>
        <div>
          <Label htmlFor="eventType">Event type</Label>
          <Select id="eventType" name="eventType" defaultValue={categories[0]?.name || "Wedding"}>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))
            ) : (
              <option value="Wedding">Wedding</option>
            )}
          </Select>
        </div>
        <div>
          <Label htmlFor="preferredDate">Preferred date(s)</Label>
          <Input id="preferredDate" name="preferredDate" type="text" placeholder="DD/MM/YYYY" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Tell us a little about your day…"
          />
        </div>
      </div>

      {status === "error" && (
        <p className="mt-4 text-sm text-red-700">{error}</p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={status === "loading"}>
          {status === "loading" ? "Sending…" : "Send enquiry"}
        </Button>
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted underline hover:text-espresso"
          >
            Or message us on WhatsApp
          </a>
        )}
      </div>
    </form>
  );
}
