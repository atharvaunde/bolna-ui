"use client";

import { useEffect, useState, use, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCustomerStore } from "@/lib/stores/customerStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Phone,
  RefreshCw,
  UserIcon,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { RiskDetailsDialog } from "@/components/customer-details/risk-details-dialog";
import { CallsTab } from "@/components/customer-details/calls-tab";
import { DashboardTab } from "@/components/customer-details/dashboard-tab";
import { TransactionsTab } from "@/components/customer-details/transactions-tab";
import { ProductsTab } from "@/components/customer-details/products-tab";

const riskBadgeStyles = {
  LOW: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
  MEDIUM: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-300",
  HIGH: "bg-orange-500/15 text-orange-600 dark:text-orange-300",
  CRITICAL: "bg-red-500/15 text-red-600 dark:text-red-300",
};

const kycBadgeStyles = {
  VERIFIED: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
  PENDING: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-300",
  EXPIRED: "bg-orange-500/15 text-orange-600 dark:text-orange-300",
  REJECTED: "bg-red-500/15 text-red-600 dark:text-red-300",
};

export function CustomerDetailsPage({ params }) {
  const resolvedParams = use(params);
  const customerId = resolvedParams.customerId;
  const router = useRouter();
  const {
    selectedCustomer,
    products,
    riskSummary,
    financialSummary,
    calls,
    isLoading,
    isLoadingProducts,
    isLoadingFinancialSummary,
    isRecalculatingRisk,
    fetchCustomerById,
    fetchProducts,
    fetchRiskSummary,
    fetchFinancialSummary,
    fetchCalls,
    recalculateRisk,
    triggerAICall,
    clearSelectedCustomer,
  } = useCustomerStore();

  const [isCallingAI, setIsCallingAI] = useState(false);

  const fetchData = async () => {
    if (!customerId) return;
    await Promise.all([
      fetchCustomerById(customerId),
      fetchProducts(customerId),
      fetchRiskSummary(customerId),
      fetchFinancialSummary(customerId),
      fetchCalls(customerId, { page: 1, limit: 20 }),
    ]);
  };

  useEffect(() => {
    fetchData();
    return () => clearSelectedCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  const handleTriggerCall = async () => {
    try {
      setIsCallingAI(true);
      await triggerAICall(customerId);
    } finally {
      setIsCallingAI(false);
    }
  };

  const isHighRisk = useMemo(
    () => ["HIGH", "CRITICAL"].includes(selectedCustomer?.riskLevel),
    [selectedCustomer?.riskLevel],
  );

  const kycStatus = selectedCustomer?.kycStatus || "PENDING";
  const segment = selectedCustomer?.segment;
  const city =
    selectedCustomer?.address?.city || selectedCustomer?.profileMetadata?.city;
  const occupation =
    selectedCustomer?.occupation ||
    selectedCustomer?.profileMetadata?.occupation;
  const onboardingDate = selectedCustomer?.onboardingDate
    ? new Date(selectedCustomer.onboardingDate).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
      })
    : null;

  if (isLoading && !selectedCustomer) {
    return (
      <div className="space-y-6 p-1">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-52" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  if (!isLoading && !selectedCustomer) {
    return (
      <div className="p-5">
        <Card className="border-border/60 shadow-none">
          <CardContent className="py-12 text-center text-muted-foreground">
            Customer not found.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 w-full h-full space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h1 className="flex items-center gap-2 text-3xl font-semibold leading-tight">
                <UserIcon className="h-7 w-7" />
                {selectedCustomer?.name || "Customer"}
              </h1>
              <Badge className={cn(kycBadgeStyles[kycStatus])}>
                KYC {kycStatus}
              </Badge>
              {selectedCustomer?.riskLevel && (
                <Badge
                  className={cn(riskBadgeStyles[selectedCustomer.riskLevel])}
                >
                  {selectedCustomer.riskLevel} Risk
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <RiskDetailsDialog
                riskSummary={riskSummary}
                isRecalculating={isRecalculatingRisk}
                onRecalculate={() => recalculateRisk(customerId)}
              />
              <Button
                onClick={handleTriggerCall}
                disabled={isCallingAI}
                size="sm"
              >
                <Phone
                  className={cn("h-4 w-4 mr-2", isCallingAI && "animate-pulse")}
                />
                {isCallingAI ? "Calling..." : "AI Call"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={fetchData}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Customer financial profile, risk assessment, and transaction
            history.
          </p>

          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline" className="border-dashed">
              ID: {selectedCustomer?.customerId || customerId}
            </Badge>
            {segment && (
              <Badge variant="outline" className="border-dashed">
                {segment}
              </Badge>
            )}
            {occupation && (
              <Badge variant="outline" className="border-dashed">
                {occupation}
              </Badge>
            )}
            {city && (
              <Badge variant="outline" className="border-dashed">
                {city}
              </Badge>
            )}
            {onboardingDate && (
              <Badge variant="outline" className="border-dashed">
                Onboarded {onboardingDate}
              </Badge>
            )}
            {selectedCustomer?.phone && (
              <Badge variant="outline" className="border-dashed">
                {selectedCustomer.phone}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {isHighRisk && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>High Risk Customer Detected</AlertTitle>
          <AlertDescription>
            This customer is classified as {selectedCustomer.riskLevel} Risk
            (Score: {selectedCustomer.riskScore}/100).
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="products">
            Products ({products?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="calls">Calls ({calls?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-4">
          <DashboardTab
            financialSummary={financialSummary}
            isLoadingFinancialSummary={isLoadingFinancialSummary}
          />
        </TabsContent>

        <TabsContent value="transactions" className="mt-4">
          <TransactionsTab customerId={customerId} />
        </TabsContent>

        <TabsContent value="products" className="mt-4">
          <ProductsTab products={products} isLoading={isLoadingProducts} />
        </TabsContent>

        <TabsContent value="calls" className="mt-4">
          <CallsTab customerId={customerId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CustomerDetailsPage;
