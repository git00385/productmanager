import { deleteSpec, getSpec, updateSpec } from "@/lib/db/spec-writer";
import { createClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: RouteContext) {
  const { id } = await params;
  try {
    const spec = await getSpec(id);
    return Response.json(spec);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Not found";
    return Response.json({ error: message }, { status: 404 });
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { title, content } = (await request.json()) as { title: string; content: string };

  try {
    const spec = await updateSpec(id, title, content);
    return Response.json(spec);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await deleteSpec(id);
    return new Response(null, { status: 204 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
