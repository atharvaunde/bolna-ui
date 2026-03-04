import { FinancialSummaryCharts } from "./financial-summary-charts";

export function DashboardTab({ financialSummary, isLoadingFinancialSummary }) {
  return (
    <div className="space-y-4">
      <FinancialSummaryCharts
        financialSummary={financialSummary}
        isLoading={isLoadingFinancialSummary}
      />
    </div>
  );
}
