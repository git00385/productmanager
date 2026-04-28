import Logo from "@/components/Logo";
import Link from "next/link";

/** Centered card layout for auth pages. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Logo size={32} />
        <span className="text-lg font-semibold text-foreground">PM Agent</span>
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
