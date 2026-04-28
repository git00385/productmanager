"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/** Sends a password reset email to the provided address. */
export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await resetPassword(new FormData(e.currentTarget));
    if (result?.error) {
      setError(result.error);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Reset password</CardTitle>
        <CardDescription>
          {sent
            ? "Check your email for a reset link."
            : "Enter your email and we'll send a reset link."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!sent && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@company.com" required />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending…" : "Send reset link"}
            </Button>
          </form>
        )}

        <p className="text-center text-xs text-muted-foreground">
          <Link href="/login" className="text-primary hover:underline font-medium">
            Back to sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
