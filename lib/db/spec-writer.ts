import { createClient } from "@/lib/supabase/server";
import type { SpecDocument, SpecInput, SpecMetadata } from "@/types/spec-writer";

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

function toSpecDocument(row: RawDocument): SpecDocument {
  const meta = row.metadata as unknown as SpecMetadata;
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    createdBy: row.created_by,
    title: row.title,
    content: (row.content as unknown as { markdown: string }).markdown ?? "",
    input: {
      featureIdea: meta.featureIdea ?? "",
      productContext: meta.productContext,
      targetUsers: meta.targetUsers,
      scope: meta.scope,
      tone: meta.tone,
      sections: meta.sections,
    },
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

/** Persist a new spec to the documents table. */
export async function saveSpec(
  workspaceId: string,
  userId: string,
  title: string,
  content: string,
  metadata: SpecMetadata
): Promise<SpecDocument> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .insert({
      workspace_id: workspaceId,
      created_by: userId,
      module_type: "spec-writer",
      title,
      content: { markdown: content },
      metadata,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return toSpecDocument(data as RawDocument);
}

/** Fetch all specs for a workspace, newest first. */
export async function getSpecs(workspaceId: string): Promise<SpecDocument[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("module_type", "spec-writer")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as RawDocument[]).map(toSpecDocument);
}

/** Fetch a single spec by id. */
export async function getSpec(id: string): Promise<SpecDocument> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return toSpecDocument(data as RawDocument);
}

/** Update title and/or content of an existing spec. */
export async function updateSpec(
  id: string,
  title: string,
  content: string
): Promise<SpecDocument> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .update({ title, content: { markdown: content } })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return toSpecDocument(data as RawDocument);
}

/** Delete a spec permanently. */
export async function deleteSpec(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("documents").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/** Duplicate a spec, appending "(Copy)" to the title. */
export async function duplicateSpec(id: string): Promise<SpecDocument> {
  const original = await getSpec(id);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .insert({
      workspace_id: original.workspaceId,
      created_by: original.createdBy,
      module_type: "spec-writer",
      title: `${original.title} (Copy)`,
      content: { markdown: original.content },
      metadata: {
        ...original.input,
        generatedAt: new Date().toISOString(),
      } satisfies SpecMetadata,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return toSpecDocument(data as RawDocument);
}
