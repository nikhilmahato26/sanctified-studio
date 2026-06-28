import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/customer/SocialIcons";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 bg-clay text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="font-display text-2xl">Sanctified Studio</p>
          <p className="mt-3 max-w-sm text-sm text-cream/80">
            Moments worth keeping. Wedding and baby shower photography, made with
            warmth and care.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-cream/70">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/weddings" className="hover:underline">
                Weddings
              </Link>
            </li>
            <li>
              <Link href="/baby-showers" className="hover:underline">
                Baby showers
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-cream/70">Reach us</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="size-4" />
              <a href="mailto:hello@sanctifiedstudio.com" className="hover:underline">
                hello@sanctifiedstudio.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4" />
              <span>+91 90000 00000</span>
            </li>
          </ul>
          <div className="mt-4 flex gap-3">
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              className="rounded-full bg-cream/10 p-2 hover:bg-cream/20"
            >
              <InstagramIcon className="size-4" />
            </a>
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              className="rounded-full bg-cream/10 p-2 hover:bg-cream/20"
            >
              <FacebookIcon className="size-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/15">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-cream/70 sm:flex-row">
          <p>© {year} Sanctified Studio. All rights reserved.</p>
          <Link href="/admin/login" className="hover:underline">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
