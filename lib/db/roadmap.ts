import { createClient } from "@/lib/supabase/server";
import type { BacklogItem, ScoreResult, ScoredItem } from "@/types/roadmap";

interface RoadmapDocument {
  id: string;
  workspaceId: string;
  createdBy: string;
  title: string;
  items: BacklogItem[];
  scoredResult: ScoreResult;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

type RawDocument = {
  id: string;
  workspace_id: string;
  created_by: string;
  title: string;
  content: Record<string, unknown>;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

function toRoadmapDocument(row: RawDocument): RoadmapDocument {
  const content = row.content as {
    items?: BacklogItem[];
    scoredResult?: ScoreResult;
  };
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    createdBy: row.created_by,
    title: row.title,
    items: content.items ?? [],
    scoredResult: content.scoredResult ?? {
      rankedItems: [] as ScoredItem[],
      summary: "",
      strategicWarnings: [],
      capacityAlert: null,
      topRecommendation: "",
    },
    metadata: row.metadata,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export async function saveRoadmap(
  workspaceId: string,
  userId: string,
  title: string,
  items: BacklogItem[],
  scoredResult: ScoreResult,
  metadata: Record<string, unknown>
): Promise<RoadmapDocument> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .insert({
      workspace_id: workspaceId,
      created_by: userId,
      module_type: "roadmap",
      title,
      content: { items, scoredResult },
      metadata,
    })
    .select()
    .single<RawDocument>();

  if (error) throw new Error(error.message);
  return toRoadmapDocument(data);
}

export async function getRoadmaps(
  workspaceId: string
): Promise<RoadmapDocument[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select()
    .eq("workspace_id", workspaceId)
    .eq("module_type", "roadmap")
    .order("updated_at", { ascending: false })
    .returns<RawDocument[]>();

  if (error) throw new Error(error.message);
  return (data ?? []).map(toRoadmapDocument);
}

export async function getRoadmap(id: string): Promise<RoadmapDocument> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select()
    .eq("id", id)
    .eq("module_type", "roadmap")
    .single<RawDocument>();

  if (error) throw new Error(error.message);
  return toRoadmapDocument(data);
}

export async function updateRoadmap(
  id: string,
  changes: {
    title?: string;
    items?: BacklogItem[];
    scoredResult?: ScoreResult;
    metadata?: Record<string, unknown>;
  }
): Promise<RoadmapDocument> {
  const supabase = await createClient();

  const update: Record<string, unknown> = {};
  if (changes.title) update.title = changes.title;
  if (changes.items !== undefined || changes.scoredResult !== undefined) {
    const { data: existing } = await supabase
      .from("documents")
      .select("content")
      .eq("id", id)
      .single<{ content: Record<string, unknown> }>();

    update.content = {
      ...(existing?.content ?? {}),
      ...(changes.items !== undefined ? { items: changes.items } : {}),
      ...(changes.scoredResult !== undefined
        ? { scoredResult: changes.scoredResult }
        : {}),
    };
  }
  if (changes.metadata) update.metadata = changes.metadata;

  const { data, error } = await supabase
    .from("documents")
    .update(update)
    .eq("id", id)
    .select()
    .single<RawDocument>();

  if (error) throw new Error(error.message);
  return toRoadmapDocument(data);
}

export async function deleteRoadmap(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}
