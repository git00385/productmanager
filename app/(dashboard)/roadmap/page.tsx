import { Metadata } from "next";
import { RoadmapShell } from "@/components/roadmap/RoadmapShell";
import { Header } from "@/components/shared/Header";

export const metadata: Metadata = { title: "Roadmap Intelligence — PM Agent" };

export default function RoadmapPage() {
  return (
    <>
      <Header title="Roadmap Intelligence" />
      <RoadmapShell />
    </>
  );
}
