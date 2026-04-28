/** Auto-generated shape mirrors the Supabase schema. Add columns here as migrations grow. */

export type Plan = "free" | "pro" | "enterprise";
export type WorkspaceRole = "owner" | "admin" | "member";
export type IntegrationStatus = "active" | "error" | "disconnected";
export type AgentRunStatus = "pending" | "running" | "completed" | "failed";
export type ModuleType =
  | "roadmap"
  | "spec-writer"
  | "metrics"
  | "research"
  | "sprint-planner"
  | "stakeholder-updates";

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  plan: Plan;
  created_at: string;
}

export interface Workspace {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  settings: Record<string, unknown>;
  created_at: string;
}

export interface WorkspaceMember {
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  created_at: string;
}

export interface Integration {
  id: string;
  workspace_id: string;
  provider: string;
  credentials_encrypted: string;
  status: IntegrationStatus;
  created_at: string;
}

export interface Document {
  id: string;
  workspace_id: string;
  created_by: string;
  module_type: ModuleType;
  title: string;
  content: Record<string, unknown>;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AgentRun {
  id: string;
  workspace_id: string;
  module: ModuleType;
  status: AgentRunStatus;
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  token_usage: number | null;
  created_at: string;
}
