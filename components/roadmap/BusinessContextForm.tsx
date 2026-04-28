"use client";

import { Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FrameworkTooltip } from "./FrameworkTooltip";
import { useRoadmapStore } from "@/lib/stores/roadmapStore";
import { useRoadmapScoring } from "@/hooks/useRoadmapScoring";
import type {
  BusinessGoal,
  PrioritizationFramework,
  TimeHorizon,
} from "@/types/roadmap";

const BUSINESS_GOALS: BusinessGoal[] = [
  "Grow Revenue",
  "Improve Retention",
  "Reduce Churn",
  "Expand Market",
  "Reduce Costs",
  "Improve NPS",
  "Regulatory Compliance",
];

const FRAMEWORKS: PrioritizationFramework[] = [
  "RICE",
  "ICE",
  "MoSCoW",
  "Weighted Scoring",
  "Opportunity Scoring",
  "Value vs Effort",
];

const TIME_HORIZONS: TimeHorizon[] = [
  "Next Sprint",
  "Next Quarter",
  "Next 6 Months",
  "Next Year",
];

export function BusinessContextForm() {
  const {
    businessGoal,
    secondaryGoals,
    capacity,
    timeHorizon,
    framework,
    strategicContext,
    constraints,
    setBusinessGoal,
    setSecondaryGoals,
    setCapacity,
    setTimeHorizon,
    setFramework,
    setStrategicContext,
    setConstraints,
  } = useRoadmapStore();

  const { score, isScoring, canScore } = useRoadmapScoring();

  function toggleSecondaryGoal(goal: BusinessGoal) {
    if (secondaryGoals.includes(goal)) {
      setSecondaryGoals(secondaryGoals.filter((g) => g !== goal));
    } else {
      setSecondaryGoals([...secondaryGoals, goal]);
    }
  }

  const availableSecondary = BUSINESS_GOALS.filter((g) => g !== businessGoal);

  return (
    <div className="space-y-5">
      {/* Primary Goal */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Primary Business Goal <span className="text-destructive">*</span></Label>
        <select
          value={businessGoal ?? ""}
          onChange={(e) => setBusinessGoal((e.target.value as BusinessGoal) || null)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">Select a goal…</option>
          {BUSINESS_GOALS.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Secondary Goals */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Secondary Goals</Label>
        <div className="flex flex-wrap gap-2">
          {availableSecondary.map((goal) => {
            const active = secondaryGoals.includes(goal);
            return (
              <button
                key={goal}
                type="button"
                onClick={() => toggleSecondaryGoal(goal)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {goal}
              </button>
            );
          })}
        </div>
      </div>

      {/* Capacity */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Team Capacity</Label>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1">
            <Input
              type="number"
              min={1}
              max={100}
              value={capacity.engineers}
              onChange={(e) =>
                setCapacity({ ...capacity, engineers: Math.max(1, parseInt(e.target.value) || 1) })
              }
              className="w-20 h-8 text-sm"
            />
            <span className="text-sm text-muted-foreground">engineers</span>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <Input
              type="number"
              min={1}
              max={52}
              value={capacity.weeks}
              onChange={(e) =>
                setCapacity({ ...capacity, weeks: Math.max(1, parseInt(e.target.value) || 1) })
              }
              className="w-20 h-8 text-sm"
            />
            <span className="text-sm text-muted-foreground">weeks</span>
          </div>
        </div>
      </div>

      {/* Time Horizon */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Time Horizon</Label>
        <select
          value={timeHorizon}
          onChange={(e) => setTimeHorizon(e.target.value as TimeHorizon)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {TIME_HORIZONS.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
      </div>

      {/* Framework */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium flex items-center">
          Prioritization Framework
          <FrameworkTooltip framework={framework} />
        </Label>
        <select
          value={framework}
          onChange={(e) => setFramework(e.target.value as PrioritizationFramework)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {FRAMEWORKS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      {/* Strategic Context */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Strategic Context <span className="text-muted-foreground text-xs font-normal">(optional)</span></Label>
        <textarea
          value={strategicContext}
          onChange={(e) => setStrategicContext(e.target.value)}
          placeholder="Any additional context? E.g., upcoming fundraise, competitor threats, key customer commitments…"
          className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          rows={3}
        />
      </div>

      {/* Constraints */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Constraints <span className="text-muted-foreground text-xs font-normal">(optional)</span></Label>
        <textarea
          value={constraints}
          onChange={(e) => setConstraints(e.target.value)}
          placeholder="What can't you change? E.g., legacy architecture, regulatory deadlines, team skill gaps…"
          className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          rows={3}
        />
      </div>

      {/* Score button */}
      <Button
        type="button"
        className="w-full"
        disabled={!canScore}
        onClick={score}
      >
        {isScoring ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Scoring Backlog…
          </>
        ) : (
          <>
            <Zap className="h-4 w-4 mr-2" />
            Score My Backlog →
          </>
        )}
      </Button>
      {!canScore && !isScoring && (
        <p className="text-xs text-muted-foreground text-center">
          Add at least 3 items and select a primary goal to score.
        </p>
      )}
    </div>
  );
}
