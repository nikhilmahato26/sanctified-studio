import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen flex-col bg-cream md:flex-row">
      <Sidebar user={session.user as any} />
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">{children}</div>
      </main>
    </div>
  );
}
