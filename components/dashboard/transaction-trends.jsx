"use client";

import { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Activity, Wallet, ArrowDownRight } from "lucide-react";
import { Bar, BarChart, XAxis, CartesianGrid } from "recharts";
import { useCustomerStore } from "@/lib/stores/customerStore";
import { StatCard } from "@/components/customer-details/stat-card";

export function TransactionTrends() {
  const { dashboardTrends, isLoadingDashboardTrends, fetchDashboardTrends } =
    useCustomerStore();

  useEffect(() => {
    fetchDashboardTrends();
  }, [fetchDashboardTrends]);

  if (isLoadingDashboardTrends) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <StatCard key={i} isLoading />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i} className="shadow-none border-border/60">
              <CardHeader>
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-56" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!dashboardTrends) return null;

  const { monthlyTrends, topCategories, byInstrument } = dashboardTrends;

  // Calculate summary stats
  const totalTransactions = monthlyTrends.reduce(
    (sum, m) => sum + m.totalCount,
    0,
  );
  const totalCreditVolume = monthlyTrends.reduce(
    (sum, m) => sum + m.creditVolume,
    0,
  );
  const totalDebitVolume = monthlyTrends.reduce(
    (sum, m) => sum + m.debitVolume,
    0,
  );
  const totalNetFlow = totalCreditVolume - totalDebitVolume;

  // Prepare monthly trends data
  const monthlyConfig = {
    creditVolume: { label: "Credit", color: "hsl(142, 76%, 36%)" },
    debitVolume: { label: "Debit", color: "hsl(0, 84%, 60%)" },
  };

  const monthlyData = monthlyTrends.map((m) => ({
    ...m,
    monthYear: `${m.month} ${m.year}`,
  }));

  // Prepare category data
  const categoryColors = [
    "#2563eb",
    "#16a34a",
    "#ea580c",
    "#dc2626",
    "#9333ea",
    "#0891b2",
    "#ca8a04",
    "#e11d48",
  ];

  const categoryData = topCategories.slice(0, 8).map((cat, index) => ({
    category:
      cat.category.charAt(0).toUpperCase() +
      cat.category.slice(1).toLowerCase(),
    amount: cat.totalAmount,
    count: cat.count,
    fill: categoryColors[index % categoryColors.length],
  }));

  const categoryConfig = {
    amount: {
      label: "Amount",
      color: "hsl(220, 70%, 50%)",
    },
  };

  // Prepare instrument data
  const instrumentData = byInstrument.slice(0, 8).map((inst, index) => ({
    instrument: inst.instrument
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" "),
    amount: inst.totalAmount,
    count: inst.count,
    fill: categoryColors[index % categoryColors.length],
  }));

  const instrumentConfig = {
    amount: {
      label: "Amount",
      color: "hsl(220, 70%, 50%)",
    },
  };

  return (
    <div className="p-6 w-full h-full space-y-4">
      {/* Summary Stats */}
      <div className="grid gap-4 grid-cols-4">
        <StatCard
          label="Total Transactions"
          icon={Activity}
          value={totalTransactions.toLocaleString("en-IN")}
          description="Last 12 months"
        />
        <StatCard
          label="Total Credits"
          icon={TrendingUp}
          value={
            <span className="text-emerald-600">
              {Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(totalCreditVolume)}
            </span>
          }
        />
        <StatCard
          label="Total Debits"
          icon={ArrowDownRight}
          value={
            <span className="text-red-500">
              {Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(totalDebitVolume)}
            </span>
          }
        />
        <StatCard
          label="Net Flow"
          icon={Wallet}
          value={
            <span
              className={
                totalNetFlow >= 0 ? "text-emerald-600" : "text-red-500"
              }
            >
              {Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(totalNetFlow)}
            </span>
          }
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Monthly Trends */}
        <Card className="shadow-none border-border/60">
          <CardHeader>
            <CardTitle>Monthly Transaction Volume</CardTitle>
            <CardDescription>
              Credit vs Debit volumes per month (in ₹)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={monthlyConfig}>
              <BarChart accessibilityLayer data={monthlyData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="monthYear"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => {
                        const label =
                          name === "creditVolume" ? "Credit" : "Debit";
                        return [`₹${value.toLocaleString("en-IN")}`, label];
                      }}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="creditVolume"
                  stackId="a"
                  fill="var(--color-creditVolume)"
                  radius={[0, 0, 4, 4]}
                />
                <Bar
                  dataKey="debitVolume"
                  stackId="a"
                  fill="var(--color-debitVolume)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card className="shadow-none border-border/60">
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
            <CardDescription>Spending by category (in ₹)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={categoryConfig}>
              <BarChart accessibilityLayer data={categoryData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name, props) => {
                        return [
                          <div key="amount" className="flex flex-col">
                            <span>₹{value.toLocaleString("en-IN")}</span>
                            <span className="text-xs text-muted-foreground">
                              {props.payload.count} transactions
                            </span>
                          </div>,
                          "Amount",
                        ];
                      }}
                    />
                  }
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* By Instrument */}
        <Card className="shadow-none border-border/60">
          <CardHeader>
            <CardTitle>Payment Instruments</CardTitle>
            <CardDescription>Volume by payment method (in ₹)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={instrumentConfig}>
              <BarChart accessibilityLayer data={instrumentData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="instrument"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name, props) => {
                        return [
                          <div key="amount" className="flex flex-col">
                            <span>₹{value.toLocaleString("en-IN")}</span>
                            <span className="text-xs text-muted-foreground">
                              {props.payload.count} transactions
                            </span>
                          </div>,
                          "Amount",
                        ];
                      }}
                    />
                  }
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Transaction Count Trends */}
        <Card className="shadow-none border-border/60">
          <CardHeader>
            <CardTitle>Monthly Transaction Count</CardTitle>
            <CardDescription>Credit vs Debit transaction count</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={monthlyConfig}>
              <BarChart accessibilityLayer data={monthlyData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="monthYear"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => {
                        const label =
                          name === "creditCount" ? "Credit" : "Debit";
                        return [value.toLocaleString("en-IN"), label];
                      }}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="creditCount"
                  stackId="a"
                  fill="var(--color-creditVolume)"
                  radius={[0, 0, 4, 4]}
                />
                <Bar
                  dataKey="debitCount"
                  stackId="a"
                  fill="var(--color-debitVolume)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
