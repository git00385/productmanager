import { Header } from "@/components/shared/Header";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata = { title: "Sprint Planner — PM Agent" };

export default function SprintPlannerPage() {
  return (
    <>
      <Header title="Sprint Planner" />
      <ComingSoon
        module="Sprint Planner"
        description="Scope work, estimate capacity, and draft sprint goals — with full awareness of team availability and priorities."
        icon="🏃"
      />
    </>
  );
}
