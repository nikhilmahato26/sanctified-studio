import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "EMPLOYEE";
      permissions: string[];
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email or Employee ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const identifier = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!identifier || !password) return null;

        const admin = await prisma.admin.findUnique({ where: { email: identifier } });
        if (admin) {
          const valid = await bcrypt.compare(password, admin.password);
          if (valid) return { id: admin.id, email: admin.email, name: admin.name, role: "ADMIN", permissions: [] };
        }

        const employee = await prisma.employee.findUnique({ where: { displayId: identifier } });
        if (employee && employee.password) {
          const valid = await bcrypt.compare(password, employee.password);
          if (valid) return { id: employee.id, email: employee.email, name: employee.name, role: "EMPLOYEE", permissions: employee.permissions };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.permissions = (user as any).permissions;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "ADMIN" | "EMPLOYEE") || "ADMIN";
        session.user.permissions = (token.permissions as string[]) || [];
      }
      return session;
    },
  },
});
