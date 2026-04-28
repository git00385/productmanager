"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const SUPABASE_NOT_CONFIGURED =
  !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Sign up with email and password. */
export async function signUp(formData: FormData): Promise<{ error: string | null }> {
  if (SUPABASE_NOT_CONFIGURED) return { error: "Supabase is not configured yet. Add your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables." };
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) return { error: error.message };
  redirect("/roadmap");
}

/** Sign in with email and password. */
export async function signIn(formData: FormData): Promise<{ error: string | null }> {
  if (SUPABASE_NOT_CONFIGURED) return { error: "Supabase is not configured yet. Add your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables." };
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };
  redirect("/roadmap");
}

/** Sign in with Google OAuth. */
export async function signInWithGoogle(): Promise<{ error: string | null }> {
  if (SUPABASE_NOT_CONFIGURED) return { error: "Supabase is not configured yet. Add your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables." };
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) return { error: error.message };
  if (data.url) redirect(data.url);
  return { error: null };
}

/** Send a password reset email. */
export async function resetPassword(formData: FormData): Promise<{ error: string | null }> {
  if (SUPABASE_NOT_CONFIGURED) return { error: "Supabase is not configured yet. Add your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables." };
  const supabase = await createClient();
  const email = formData.get("email") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/update-password`,
  });

  if (error) return { error: error.message };
  return { error: null };
}

/** Sign out and redirect to login. */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
