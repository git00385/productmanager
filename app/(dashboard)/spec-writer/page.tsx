import { Header } from "@/components/shared/Header";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata = { title: "Spec Writer — PM Agent" };

/** Spec Writer module — AI-generated PRDs from rough ideas. */
export default function SpecWriterPage() {
  return (
    <>
      <Header title="Spec Writer" />
      <ComingSoon
        module="Smart Spec Writer"
        description="Turn rough ideas into polished PRDs in seconds. The agent structures your thinking and fills in the gaps."
        icon="🧠"
      />
    </>
  );
}
