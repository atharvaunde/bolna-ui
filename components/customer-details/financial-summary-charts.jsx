import { useState } from "react";
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
import { TrendingUp, Activity, Wallet } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { StatCard } from "./stat-card";

export function FinancialSummaryCharts({ financialSummary, isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-none border-border/60">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="shadow-none border-border/60">
            <CardHeader>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-56" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card className="shadow-none border-border/60">
            <CardHeader>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-56" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!financialSummary) return null;

  const { monthly, summary, categories } = financialSummary;

  const barConfig = {
    totalCredits: { label: "Credit", color: "hsl(142, 76%, 36%)" },
    totalDebits: { label: "Debit", color: "hsl(0, 84%, 60%)" },
  };

  // Prepare data for bar chart - show in actual INR
  const barData = monthly.map((m) => ({
    ...m,
    monthYear: `${m.month} ${m.year}`,
  }));

  // Prepare data for category bar chart
  const categoryColors = [
    "#2563eb", // blue
    "#16a34a", // green
    "#ea580c", // orange
    "#dc2626", // red
    "#9333ea", // purple
    "#0891b2", // cyan
    "#ca8a04", // yellow
    "#e11d48", // pink
  ];

  const categoryBarData = (categories || []).map((cat, index) => ({
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

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total Credits"
          icon={TrendingUp}
          value={
            <span className="text-emerald-600">
              {Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
              }).format(summary.totalCredits)}
            </span>
          }
        />
        <StatCard
          label="Total Debits"
          icon={Activity}
          value={
            <span className="text-red-500">
              {Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
              }).format(summary.totalDebits)}
            </span>
          }
        />
        <StatCard
          label="Net Flow"
          icon={Wallet}
          value={
            <span
              className={
                summary.netFlow >= 0 ? "text-emerald-600" : "text-red-500"
              }
            >
              {Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
              }).format(summary.netFlow)}
            </span>
          }
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Monthly Breakdown Bar Chart */}
        <Card className="shadow-none border-border/60">
          <CardHeader>
            <CardTitle>Monthly Breakdown</CardTitle>
            <CardDescription>
              Credit vs Debit amounts per month (in ₹)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barConfig}>
              <BarChart accessibilityLayer data={barData}>
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
                          name === "totalCredits" ? "Credit" : "Debit";
                        return [`₹${value.toLocaleString("en-IN")}`, label];
                      }}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="totalCredits"
                  stackId="a"
                  fill="var(--color-totalCredits)"
                  radius={[0, 0, 4, 4]}
                />
                <Bar
                  dataKey="totalDebits"
                  stackId="a"
                  fill="var(--color-totalDebits)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Category Breakdown Bar Chart */}
        <Card className="shadow-none border-border/60">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Spending by category (in ₹)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={categoryConfig}>
              <BarChart accessibilityLayer data={categoryBarData}>
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
                            {/* <span className="text-xs text-muted-foreground">
                              {props.payload.count} transactions
                            </span> */}
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
    </div>
  );
}
