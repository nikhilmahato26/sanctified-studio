import Link from "next/link";
import { Mail } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/customer/SocialIcons";
import { Reveal } from "@/components/customer/Reveal";
import { Button } from "@/components/ui/button";

export function EnquiryBand() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <Reveal>
        <div className="rounded-2xl bg-espresso px-8 py-14 text-center text-cream">
          <h2 className="font-display text-4xl md:text-5xl">
            Let&apos;s keep your moments.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-cream/80">
            Tell us about your day and we&apos;ll put together something just for
            you.
          </p>
          <Button asChild size="lg" variant="blush" className="mt-8">
            <Link href="/contact">Start an enquiry</Link>
          </Button>
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              className="rounded-full bg-cream/10 p-2.5 hover:bg-cream/20"
            >
              <InstagramIcon className="size-5" />
            </a>
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              className="rounded-full bg-cream/10 p-2.5 hover:bg-cream/20"
            >
              <FacebookIcon className="size-5" />
            </a>
            <a
              href="mailto:hello@sanctifiedstudio.com"
              aria-label="Email"
              className="rounded-full bg-cream/10 p-2.5 hover:bg-cream/20"
            >
              <Mail className="size-5" />
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
