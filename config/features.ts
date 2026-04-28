/**
 * Feature flags for staged module rollout.
 * Set a flag to false to hide that module from the nav and its routes.
 */
export const FEATURES = {
  roadmap: true,
  specWriter: true,
  metrics: true,
  research: true,
  sprintPlanner: true,
  stakeholderUpdates: true,
} as const;

export type FeatureFlag = keyof typeof FEATURES;
