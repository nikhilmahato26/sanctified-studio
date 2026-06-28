import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      tone: {
        neutral: "bg-espresso/10 text-espresso",
        sage: "bg-sage/30 text-espresso",
        blush: "bg-blush/40 text-espresso",
        clay: "bg-clay/20 text-clay",
        amber: "bg-amber-100 text-amber-800",
        green: "bg-emerald-100 text-emerald-800",
        red: "bg-red-100 text-red-800",
        blue: "bg-sky-100 text-sky-800",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
