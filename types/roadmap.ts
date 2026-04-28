export type BusinessGoal =
  | "Grow Revenue"
  | "Improve Retention"
  | "Reduce Churn"
  | "Expand Market"
  | "Reduce Costs"
  | "Improve NPS"
  | "Regulatory Compliance";

export type TimeHorizon =
  | "Next Sprint"
  | "Next Quarter"
  | "Next 6 Months"
  | "Next Year";

export type PrioritizationFramework =
  | "RICE"
  | "ICE"
  | "MoSCoW"
  | "Weighted Scoring"
  | "Opportunity Scoring"
  | "Value vs Effort";

export type EffortSize = "XS" | "S" | "M" | "L" | "XL";

export type ItemTier =
  | "Must Have"
  | "Should Have"
  | "Could Have"
  | "Won't Have";

export type CategoryTag =
  | "Growth"
  | "Retention"
  | "Infrastructure"
  | "Debt"
  | "Compliance"
  | "Delight";

export type SuggestedQuarter = "Q1" | "Q2" | "Q3" | "Q4" | "Backlog";

export interface BacklogItem {
  id: string;
  name: string;
  description?: string;
  effort?: EffortSize;
  categoryTag?: CategoryTag;
}

export interface ScoredItem extends BacklogItem {
  score: number;
  rank: number;
  tier: ItemTier;
  frameworkScores: Record<string, number | string>;
  reasoning: string;
  suggestedQuarter: SuggestedQuarter;
  risks: string;
  fitForCapacity: boolean;
}

export interface ScoreResult {
  rankedItems: ScoredItem[];
  summary: string;
  strategicWarnings: string[];
  capacityAlert: string | null;
  topRecommendation: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export const EFFORT_POINTS: Record<EffortSize, number> = {
  XS: 1,
  S: 2,
  M: 3,
  L: 5,
  XL: 8,
};

export const FRAMEWORK_TOOLTIPS: Record<PrioritizationFramework, string> = {
  RICE: "Reach × Impact × Confidence ÷ Effort. Best for data-rich teams with user metrics.",
  ICE: "Impact × Confidence × Ease. Lightweight scoring for early-stage products.",
  MoSCoW: "Must Have / Should Have / Could Have / Won't Have. Classic for sprint planning.",
  "Weighted Scoring":
    "Customizable criteria with weights. Best when multiple factors matter equally.",
  "Opportunity Scoring":
    "Importance minus satisfaction gap. Finds underserved user needs.",
  "Value vs Effort": "Simple 2×2 matrix. Quick prioritization for executive conversations.",
};

export const CATEGORY_COLORS: Record<CategoryTag, string> = {
  Growth: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Retention: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Infrastructure: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  Debt: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  Compliance: "bg-red-500/15 text-red-400 border-red-500/30",
  Delight: "bg-pink-500/15 text-pink-400 border-pink-500/30",
};

export const TIER_COLORS: Record<ItemTier, string> = {
  "Must Have": "border-emerald-500/40 bg-emerald-500/5",
  "Should Have": "border-blue-500/40 bg-blue-500/5",
  "Could Have": "border-yellow-500/40 bg-yellow-500/5",
  "Won't Have": "border-zinc-500/40 bg-zinc-500/5",
};
