export const APP_CONFIG = {
  name: "PM Agent",
  description: "AI-powered product management for modern teams",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://productmanager-umber.vercel.app",
  version: "0.1.0",
} as const;
