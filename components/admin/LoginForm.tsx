"use client";

import { useActionState } from "react";
import { authenticate, type LoginState } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    authenticate,
    {},
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <Label htmlFor="email">Email or Employee ID</Label>
        <Input
          id="email"
          name="email"
          type="text"
          autoComplete="email"
          required
          placeholder="admin@sanctifiedstudio.com or EMP-0001"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
        />
      </div>

      {state.error && <p className="text-sm text-red-700">{state.error}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
