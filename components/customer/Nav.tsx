"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/", label: "Home" },
  { href: "/weddings", label: "Weddings" },
  { href: "/maternity", label: "Maternity" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-cream/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="font-display text-xl tracking-tight text-espresso"
          onClick={() => setOpen(false)}
        >
          Sanctified Studio
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "text-sm transition-colors hover:text-espresso",
                  active ? "text-espresso" : "text-muted",
                )}
              >
                {l.label}
              </Link>
            );
          })}
          <Button asChild size="sm">
            <Link href="/contact">Enquire</Link>
          </Button>
        </div>

        <button
          className="md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-line/60 bg-cream md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm text-espresso hover:bg-espresso/5"
              >
                {l.label}
              </Link>
            ))}
            <Button asChild size="sm" className="mt-2 w-fit">
              <Link href="/contact" onClick={() => setOpen(false)}>
                Enquire
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
