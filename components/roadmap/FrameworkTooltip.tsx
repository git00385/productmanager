"use client";

import { Info } from "lucide-react";
import { FRAMEWORK_TOOLTIPS } from "@/types/roadmap";
import type { PrioritizationFramework } from "@/types/roadmap";

interface FrameworkTooltipProps {
  framework: PrioritizationFramework;
}

export function FrameworkTooltip({ framework }: FrameworkTooltipProps) {
  const tip = FRAMEWORK_TOOLTIPS[framework];

  return (
    <span className="group relative inline-flex items-center">
      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help ml-1" />
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-md border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-50">
        {tip}
      </span>
    </span>
  );
}
