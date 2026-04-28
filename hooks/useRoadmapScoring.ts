"use client";

import { useCallback } from "react";
import { useRoadmapStore } from "@/lib/stores/roadmapStore";
import type { ScoreResult } from "@/types/roadmap";

interface ScoringPayload {
  items: ReturnType<typeof useRoadmapStore.getState>["items"];
  businessGoal: NonNullable<ReturnType<typeof useRoadmapStore.getState>["businessGoal"]>;
  secondaryGoals: ReturnType<typeof useRoadmapStore.getState>["secondaryGoals"];
  capacity: ReturnType<typeof useRoadmapStore.getState>["capacity"];
  timeHorizon: ReturnType<typeof useRoadmapStore.getState>["timeHorizon"];
  framework: ReturnType<typeof useRoadmapStore.getState>["framework"];
  strategicContext: string;
  constraints: string;
}

interface UseRoadmapScoringReturn {
  score: () => Promise<void>;
  isScoring: boolean;
  canScore: boolean;
}

export function useRoadmapScoring(): UseRoadmapScoringReturn {
  const {
    items,
    businessGoal,
    secondaryGoals,
    capacity,
    timeHorizon,
    framework,
    strategicContext,
    constraints,
    isScoring,
    setIsScoring,
    setScoreResults,
    setActiveTab,
  } = useRoadmapStore();

  const canScore = items.length >= 3 && businessGoal !== null && !isScoring;

  const score = useCallback(async () => {
    if (!businessGoal) return;
    setIsScoring(true);

    try {
      const payload: ScoringPayload = {
        items,
        businessGoal,
        secondaryGoals,
        capacity,
        timeHorizon,
        framework,
        strategicContext,
        constraints,
      };

      const response = await fetch("/api/roadmap/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
      }

      const result = JSON.parse(fullText) as ScoreResult & { error?: string };

      if (result.error) throw new Error(result.error);

      setScoreResults(result);
      setActiveTab("roadmap");
    } catch (err) {
      console.error("[useRoadmapScoring]", err);
      setIsScoring(false);
    }
  }, [
    items,
    businessGoal,
    secondaryGoals,
    capacity,
    timeHorizon,
    framework,
    strategicContext,
    constraints,
    setIsScoring,
    setScoreResults,
    setActiveTab,
  ]);

  return { score, isScoring, canScore };
}
