import { Header } from "@/components/shared/Header";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata = { title: "Metrics — PM Agent" };

export default function MetricsPage() {
  return (
    <>
      <Header title="Metrics" />
      <ComingSoon
        module="Metrics & Insights"
        description="Surface what matters. Get instant analysis of product KPIs, trend anomalies, and actionable recommendations."
        icon="📊"
      />
    </>
  );
}
