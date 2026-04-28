import { Header } from "@/components/shared/Header";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata = { title: "Roadmap — PM Agent" };

/** Roadmap module — AI-powered prioritization and planning. */
export default function RoadmapPage() {
  return (
    <>
      <Header title="Roadmap" />
      <ComingSoon
        module="Roadmap Intelligence"
        description="AI-powered prioritization that aligns your roadmap with business goals, user needs, and team capacity — automatically."
        icon="🗺️"
      />
    </>
  );
}
