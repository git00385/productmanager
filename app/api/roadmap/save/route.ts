import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { saveRoadmap } from "@/lib/db/roadmap";
import type { BacklogItem, ScoreResult } from "@/types/roadmap";

const RequestSchema = z.object({
  workspaceId: z.string().uuid(),
  title: z.string().min(1),
  items: z.array(z.unknown()),
  scoredResult: z.unknown(),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const doc = await saveRoadmap(
      parsed.data.workspaceId,
      user.id,
      parsed.data.title,
      parsed.data.items as BacklogItem[],
      parsed.data.scoredResult as ScoreResult,
      parsed.data.metadata
    );
    return Response.json({ id: doc.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
