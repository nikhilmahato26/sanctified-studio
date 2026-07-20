"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  UserCog,
  Wallet,
  Image as ImageIcon,
  LogOut,
  Tags,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/app/admin/actions";

const items = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads & clients", icon: Users },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/employees", label: "Employees", icon: UserCog },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/finance", label: "Finance", icon: Wallet },
  { href: "/admin/categories", label: "Categories", icon: Tags },
];

export function Sidebar({ user }: { user: { role: string; permissions?: string[] } }) {
  const pathname = usePathname();

  const filteredItems = items.filter((item) => {
    if (user.role === "ADMIN") return true;
    if (item.href === "/admin/dashboard") return true;
    if (item.href === "/admin/leads" || item.href === "/admin/clients") return user.permissions?.includes("clients");
    if (item.href === "/admin/events" || item.href === "/admin/categories") return user.permissions?.includes("events");
    if (item.href === "/admin/gallery") return user.permissions?.includes("gallery");
    if (item.href === "/admin/finance") return user.permissions?.includes("finance");
    return false;
  });

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-line bg-cream md:sticky md:top-0 md:h-screen md:w-64 md:self-start md:border-b-0 md:border-r">
      <div className="px-6 py-5">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-3 px-2 py-4"
        >
          <Image 
            src="/logo.png" 
            alt="Sanctified Studio" 
            width={160} 
            height={50} 
            className="h-10 w-auto object-contain"
          />
        </Link>
        <p className="text-xs text-muted">Admin</p>
      </div>

      <nav className="flex flex-row gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:overflow-visible md:pb-0">
        {filteredItems.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-espresso text-cream"
                  : "text-espresso/80 hover:bg-espresso/5",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <form action={signOutAction} className="hidden p-3 md:block">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-espresso/80 transition-colors hover:bg-espresso/5"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </form>
    </aside>
  );
}
