import { Header } from "@/components/shared/Header";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata = { title: "Stakeholder Updates — PM Agent" };

export default function StakeholderUpdatesPage() {
  return (
    <>
      <Header title="Stakeholder Updates" />
      <ComingSoon
        module="Stakeholder Updates"
        description="Generate crisp, tailored updates for leadership, engineers, or customers — tuned to audience and cadence."
        icon="📣"
      />
    </>
  );
}
