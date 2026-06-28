import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Photo } from "@/components/customer/Photo";

interface ServiceCardProps {
  title: string;
  description: string;
  href: string;
  accent: "sage" | "blush";
  label: string;
}

export function ServiceCard({
  title,
  description,
  href,
  accent,
  label,
}: ServiceCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group block overflow-hidden rounded-2xl border border-line transition-shadow hover:shadow-md",
        accent === "sage" ? "bg-sage/20" : "bg-blush/25",
      )}
    >
      <Photo tone={accent} label={label} aspect="aspect-[16/10]" className="rounded-none" />
      <div className="p-7">
        <h3 className="font-display text-3xl text-espresso">{title}</h3>
        <p className="mt-3 text-muted">{description}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-espresso">
          Explore
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
