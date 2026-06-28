import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false },
};

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user) redirect("/admin/dashboard");

  return (
    <main className="flex min-h-screen items-center justify-center bg-sand px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="font-display text-2xl text-espresso">
            Sanctified Studio
          </Link>
          <p className="mt-2 text-sm text-muted">Admin panel</p>
        </div>
        <div className="rounded-2xl border border-line bg-white/80 p-7 shadow-sm">
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-xs text-muted">
          For studio staff only.
        </p>
      </div>
    </main>
  );
}
