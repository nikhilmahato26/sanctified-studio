import Link from "next/link";
import { Mail } from "lucide-react";
import { InstagramIcon, YoutubeIcon } from "@/components/customer/SocialIcons";
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
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="https://www.instagram.com/sanctified_studios_jbp?igsh=amh1dW5uamM3bWlr"
              title="Wedding Instagram"
              className="flex items-center gap-2 rounded-full bg-cream/10 px-4 py-2 text-sm text-cream transition-colors hover:bg-cream/20"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon className="size-4" />
              Wedding
            </a>
            <a
              href="https://www.instagram.com/sanctified_baby_studio?igsh=YTgyNjNydzM5cmRz"
              title="Baby & Maternity Instagram"
              className="flex items-center gap-2 rounded-full bg-cream/10 px-4 py-2 text-sm text-cream transition-colors hover:bg-cream/20"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon className="size-4" />
              Baby & Maternity
            </a>
            <a
              href="https://youtube.com/@sanctified_studio?si=87tqM_VHcJOSW2UG"
              title="YouTube"
              className="flex items-center gap-2 rounded-full bg-cream/10 px-4 py-2 text-sm text-cream transition-colors hover:bg-cream/20"
              target="_blank"
              rel="noopener noreferrer"
            >
              <YoutubeIcon className="size-4" />
              YouTube
            </a>
            <a
              href="mailto:sanctifiedstudiojbp@gmail.com"
              title="Email"
              className="flex items-center gap-2 rounded-full bg-cream/10 px-4 py-2 text-sm text-cream transition-colors hover:bg-cream/20"
            >
              <Mail className="size-4" />
              Email
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
