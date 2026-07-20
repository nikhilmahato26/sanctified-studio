import Link from "next/link";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { InstagramIcon, YoutubeIcon } from "@/components/customer/SocialIcons";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 bg-clay text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Image 
            src="/logo.png" 
            alt="Sanctified Studio" 
            width={180} 
            height={50} 
            className="h-12 w-auto object-contain"
          />
          <p className="max-w-xs text-sm text-cream/80">
            We commemorate every moment of your joyous ceremonies, preserving them indefinitely.
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
              <Link href="/maternity" className="hover:underline">
                Maternity
              </Link>
            </li>
            <li>
              <Link href="/baby-shoot" className="hover:underline">
                Baby shoot
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:underline">
                Gallery
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-cream/70">Reach us</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="size-4" />
              <a href="mailto:sanctifiedstudiojbp@gmail.com" className="hover:underline">
                sanctifiedstudiojbp@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4" />
              <span>+91 98274 11116</span>
            </li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href="https://www.instagram.com/sanctified_studios_jbp?igsh=amh1dW5uamM3bWlr"
              title="Wedding Instagram"
              className="flex items-center gap-2 rounded-full bg-cream/10 px-3 py-2 hover:bg-cream/20"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon className="size-4" />
              <span className="text-xs">Wedding</span>
            </a>
            <a
              href="https://www.instagram.com/sanctified_baby_studio?igsh=YTgyNjNydzM5cmRz"
              title="Baby & Maternity Instagram"
              className="flex items-center gap-2 rounded-full bg-cream/10 px-3 py-2 hover:bg-cream/20"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon className="size-4" />
              <span className="text-xs">Baby & Maternity</span>
            </a>
            <a
              href="https://youtube.com/@sanctified_studio?si=87tqM_VHcJOSW2UG"
              title="YouTube"
              className="flex items-center gap-2 rounded-full bg-cream/10 px-3 py-2 hover:bg-cream/20"
              target="_blank"
              rel="noopener noreferrer"
            >
              <YoutubeIcon className="size-4" />
              <span className="text-xs">YouTube</span>
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
