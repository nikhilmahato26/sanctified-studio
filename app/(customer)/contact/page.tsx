import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { EnquiryForm } from "@/components/customer/EnquiryForm";
import { Reveal } from "@/components/customer/Reveal";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start an enquiry with Sanctified Studio.",
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <div className="grid gap-12 md:grid-cols-2">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.2em] text-clay">
            Get in touch
          </p>
          <h1 className="mt-4 font-display text-5xl leading-tight text-espresso">
            Let&apos;s talk about your day.
          </h1>
          <p className="mt-5 max-w-md text-muted">
            Share a few details and we&apos;ll come back with availability and a
            tailored quote. We reply to every enquiry personally.
          </p>

          <ul className="mt-8 space-y-4 text-espresso">
            <li className="flex items-center gap-3">
              <span className="rounded-full bg-sand p-2.5">
                <Mail className="size-4" />
              </span>
              <a href="mailto:hello@sanctifiedstudio.com" className="hover:underline">
                hello@sanctifiedstudio.com
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="rounded-full bg-sand p-2.5">
                <Phone className="size-4" />
              </span>
              +91 90000 00000
            </li>
            <li className="flex items-center gap-3">
              <span className="rounded-full bg-sand p-2.5">
                <MapPin className="size-4" />
              </span>
              By appointment
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <EnquiryForm />
        </Reveal>
      </div>
    </section>
  );
}
