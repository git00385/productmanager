"use client";

import { create } from "zustand";
import type {
  BacklogItem,
  BusinessGoal,
  CategoryTag,
  ChatMessage,
  EffortSize,
  ItemTier,
  PrioritizationFramework,
  ScoreResult,
  ScoredItem,
  TimeHorizon,
} from "@/types/roadmap";

interface RoadmapStore {
  // Input state
  items: BacklogItem[];
  businessGoal: BusinessGoal | null;
  secondaryGoals: BusinessGoal[];
  capacity: { engineers: number; weeks: number };
  timeHorizon: TimeHorizon;
  framework: PrioritizationFramework;
  strategicContext: string;
  constraints: string;

  // Output state
  scoredItems: ScoredItem[];
  summary: string;
  strategicWarnings: string[];
  capacityAlert: string | null;
  topRecommendation: string;
  isScoring: boolean;
  lastScoredAt: Date | null;

  // UI state
  activeTab: "prioritize" | "roadmap" | "insights";
  roadmapView: "kanban" | "timeline";
  chatHistory: ChatMessage[];

  // Actions
  addItem: (item: BacklogItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, changes: Partial<BacklogItem>) => void;
  setItems: (items: BacklogItem[]) => void;
  setBusinessGoal: (goal: BusinessGoal | null) => void;
  setSecondaryGoals: (goals: BusinessGoal[]) => void;
  setCapacity: (capacity: { engineers: number; weeks: number }) => void;
  setTimeHorizon: (horizon: TimeHorizon) => void;
  setFramework: (framework: PrioritizationFramework) => void;
  setStrategicContext: (ctx: string) => void;
  setConstraints: (constraints: string) => void;
  setIsScoring: (scoring: boolean) => void;
  setScoreResults: (result: ScoreResult) => void;
  moveItemToTier: (id: string, tier: ItemTier) => void;
  setActiveTab: (tab: "prioritize" | "roadmap" | "insights") => void;
  setRoadmapView: (view: "kanban" | "timeline") => void;
  addChatMessage: (msg: ChatMessage) => void;
  updateLastChatMessage: (content: string) => void;
  reset: () => void;
}

const DEFAULT_STATE = {
  items: [] as BacklogItem[],
  businessGoal: null as BusinessGoal | null,
  secondaryGoals: [] as BusinessGoal[],
  capacity: { engineers: 4, weeks: 6 },
  timeHorizon: "Next Quarter" as TimeHorizon,
  framework: "RICE" as PrioritizationFramework,
  strategicContext: "",
  constraints: "",
  scoredItems: [] as ScoredItem[],
  summary: "",
  strategicWarnings: [] as string[],
  capacityAlert: null as string | null,
  topRecommendation: "",
  isScoring: false,
  lastScoredAt: null as Date | null,
  activeTab: "prioritize" as const,
  roadmapView: "kanban" as const,
  chatHistory: [] as ChatMessage[],
};

export const useRoadmapStore = create<RoadmapStore>((set) => ({
  ...DEFAULT_STATE,

  addItem: (item) =>
    set((state) => ({ items: [...state.items, item] })),

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  updateItem: (id, changes) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, ...changes } : i)),
      scoredItems: state.scoredItems.map((i) =>
        i.id === id ? { ...i, ...changes } : i
      ),
    })),

  setItems: (items) => set({ items }),

  setBusinessGoal: (businessGoal) => set({ businessGoal }),

  setSecondaryGoals: (secondaryGoals) => set({ secondaryGoals }),

  setCapacity: (capacity) => set({ capacity }),

  setTimeHorizon: (timeHorizon) => set({ timeHorizon }),

  setFramework: (framework) => set({ framework }),

  setStrategicContext: (strategicContext) => set({ strategicContext }),

  setConstraints: (constraints) => set({ constraints }),

  setIsScoring: (isScoring) => set({ isScoring }),

  setScoreResults: (result) =>
    set({
      scoredItems: result.rankedItems,
      summary: result.summary,
      strategicWarnings: result.strategicWarnings,
      capacityAlert: result.capacityAlert,
      topRecommendation: result.topRecommendation,
      lastScoredAt: new Date(),
      isScoring: false,
    }),

  moveItemToTier: (id, tier) =>
    set((state) => ({
      scoredItems: state.scoredItems.map((i) =>
        i.id === id ? { ...i, tier } : i
      ),
    })),

  setActiveTab: (activeTab) => set({ activeTab }),

  setRoadmapView: (roadmapView) => set({ roadmapView }),

  addChatMessage: (msg) =>
    set((state) => ({ chatHistory: [...state.chatHistory, msg] })),

  updateLastChatMessage: (content) =>
    set((state) => {
      const history = [...state.chatHistory];
      if (history.length === 0) return {};
      history[history.length - 1] = { ...history[history.length - 1], content };
      return { chatHistory: history };
    }),

  reset: () => set({ ...DEFAULT_STATE }),
}));

// Derived helpers
export function getTierItems(items: ScoredItem[], tier: ItemTier): ScoredItem[] {
  return items
    .filter((i) => i.tier === tier)
    .sort((a, b) => a.rank - b.rank);
}

export function getQuarterItems(
  items: ScoredItem[],
  quarter: string
): ScoredItem[] {
  return items
    .filter((i) => i.suggestedQuarter === quarter)
    .sort((a, b) => a.rank - b.rank);
}

export function totalEffortPoints(items: BacklogItem[]): number {
  const points: Record<EffortSize | string, number> = {
    XS: 1, S: 2, M: 3, L: 5, XL: 8,
  };
  return items.reduce((sum, i) => sum + (i.effort ? (points[i.effort] ?? 0) : 0), 0);
}

export function fitCount(items: ScoredItem[]): number {
  return items.filter((i) => i.fitForCapacity).length;
}

// Per-category color lookup exported for component use
export const CATEGORY_BG: Record<string, string> = {
  Growth: "bg-emerald-500/15 text-emerald-400",
  Retention: "bg-blue-500/15 text-blue-400",
  Infrastructure: "bg-violet-500/15 text-violet-400",
  Debt: "bg-orange-500/15 text-orange-400",
  Compliance: "bg-red-500/15 text-red-400",
  Delight: "bg-pink-500/15 text-pink-400",
};
