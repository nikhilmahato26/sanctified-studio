import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Ensures there is an authenticated admin. Returns the session user.
 * Redirects to the login page when not signed in — use in server actions
 * and server components within the admin panel.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  return session.user;
}
