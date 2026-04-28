import { Header } from "@/components/shared/Header";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata = { title: "Research — PM Agent" };

export default function ResearchPage() {
  return (
    <>
      <Header title="Research" />
      <ComingSoon
        module="Research Synthesizer"
        description="Ingest interviews, surveys, and support tickets. Get structured themes, quotes, and next steps instantly."
        icon="🔬"
      />
    </>
  );
}
