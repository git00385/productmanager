import { duplicateSpec } from "@/lib/db/spec-writer";
import { createClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(_req: Request, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const spec = await duplicateSpec(id);
    return Response.json(spec, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Duplicate failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
