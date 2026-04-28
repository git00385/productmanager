import { createClient } from "@/lib/supabase/server";
import type { AgentRun, ModuleType } from "@/types";

/** Insert a new agent run record and return its id. */
export async function createAgentRun(
  workspaceId: string,
  module: ModuleType,
  input: Record<string, unknown>
): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("agent_runs")
    .insert({ workspace_id: workspaceId, module, status: "pending", input, output: null })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data.id;
}

/** Mark a run as completed and store output + token usage. */
export async function completeAgentRun(
  id: string,
  output: Record<string, unknown>,
  tokenUsage: number
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("agent_runs")
    .update({ status: "completed", output, token_usage: tokenUsage })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

/** Mark a run as failed. */
export async function failAgentRun(id: string, errorMessage: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("agent_runs")
    .update({ status: "failed", output: { error: errorMessage } })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

/** Fetch recent runs for a workspace. */
export async function listAgentRuns(
  workspaceId: string,
  limit = 20
): Promise<AgentRun[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("agent_runs")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data as AgentRun[];
}
