export type SpecScope =
  | "Full PRD"
  | "One-Pager"
  | "User Stories Only"
  | "Technical Spec";

export type SpecTone =
  | "Professional"
  | "Concise"
  | "Detailed"
  | "Engineering-focused";

export type SpecSection =
  | "Problem Statement"
  | "Goals & Success Metrics"
  | "User Stories"
  | "Functional Requirements"
  | "Non-Functional Requirements"
  | "Out of Scope"
  | "Open Questions"
  | "Timeline & Milestones"
  | "Stakeholder Map";

export const ALL_SECTIONS: SpecSection[] = [
  "Problem Statement",
  "Goals & Success Metrics",
  "User Stories",
  "Functional Requirements",
  "Non-Functional Requirements",
  "Out of Scope",
  "Open Questions",
  "Timeline & Milestones",
  "Stakeholder Map",
];

export const DEFAULT_SECTIONS: SpecSection[] = [
  "Problem Statement",
  "Goals & Success Metrics",
  "User Stories",
  "Functional Requirements",
  "Non-Functional Requirements",
  "Out of Scope",
  "Open Questions",
];

export interface SpecInput {
  featureIdea: string;
  productContext?: string;
  targetUsers?: string;
  scope: SpecScope;
  tone: SpecTone;
  sections: SpecSection[];
}

export interface SpecMetadata {
  scope: SpecScope;
  tone: SpecTone;
  sections: SpecSection[];
  featureIdea: string;
  productContext?: string;
  targetUsers?: string;
  generatedAt: string;
  tokenUsage?: number;
}

export interface SpecDocument {
  id: string;
  workspaceId: string;
  title: string;
  content: string;
  input: SpecInput;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface GenerateSpecRequest {
  featureIdea: string;
  productContext?: string;
  targetUsers?: string;
  scope: SpecScope;
  tone: SpecTone;
  sections: SpecSection[];
}

export const EXAMPLE_INPUT: SpecInput = {
  featureIdea:
    "Add an AI-powered email digest feature that summarises all unread notifications from the past 24 hours into a single daily email. The email should group items by project, highlight action-required items first, and include one-click deep-links back into the app.",
  productContext:
    "PM Agent is a B2B SaaS used by product managers at mid-market companies. Users complain about notification overload and missing important updates buried in noise.",
  targetUsers: "Product managers, team leads, and project owners at B2B SaaS companies",
  scope: "Full PRD",
  tone: "Professional",
  sections: DEFAULT_SECTIONS,
};
