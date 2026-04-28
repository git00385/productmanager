import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/shared/Sidebar";
import { QueryProvider } from "@/components/shared/QueryProvider";

/** Authenticated dashboard shell. All module pages render inside this layout. */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <QueryProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {children}
        </div>
      </div>
    </QueryProvider>
  );
}
