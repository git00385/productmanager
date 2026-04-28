import { createClient } from "@/lib/supabase/server";
import { getSpecs, saveSpec } from "@/lib/db/spec-writer";
import { z } from "zod";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("workspaceId");

  if (!workspaceId) {
    return Response.json({ error: "workspaceId is required" }, { status: 400 });
  }

  try {
    const specs = await getSpecs(workspaceId);
    return Response.json(specs);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch specs";
    return Response.json({ error: message }, { status: 500 });
  }
}

const SaveSchema = z.object({
  workspaceId: z.string().uuid(),
  title: z.string().min(1),
  content: z.string(),
  metadata: z.object({
    scope: z.string(),
    tone: z.string(),
    sections: z.array(z.string()),
    featureIdea: z.string(),
    productContext: z.string().optional(),
    targetUsers: z.string().optional(),
    generatedAt: z.string(),
    tokenUsage: z.number().optional(),
  }),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = SaveSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const spec = await saveSpec(
      parsed.data.workspaceId,
      user.id,
      parsed.data.title,
      parsed.data.content,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parsed.data.metadata as any
    );
    return Response.json(spec, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save spec";
    return Response.json({ error: message }, { status: 500 });
  }
}
