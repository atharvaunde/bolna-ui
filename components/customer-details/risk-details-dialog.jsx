import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

const RISK_FACTOR_LABELS = {
  savingsScore: "Low Savings Rate",
  spendingSpikeScore: "Spending Spike",
  balanceHealthScore: "Low Balance",
  subscriptionScore: "High Subscriptions",
  volatilityScore: "Spending Volatility",
};

const riskBadgeStyles = {
  LOW: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
  MEDIUM: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-300",
  HIGH: "bg-orange-500/15 text-orange-600 dark:text-orange-300",
  CRITICAL: "bg-red-500/15 text-red-600 dark:text-red-300",
};

function getRiskReason(key) {
  const reasons = {
    savingsScore: "Savings rate fell below the healthy threshold",
    spendingSpikeScore:
      "Spending increased significantly compared to previous month",
    balanceHealthScore: "Account balance dropped below safe levels",
    subscriptionScore: "Recurring subscriptions exceed 10% of monthly income",
    volatilityScore: "High variance in monthly spending patterns detected",
  };
  return reasons[key] || "Risk factor detected";
}

function getRiskExplanation(score) {
  if (score >= 90)
    return "Customer is in critical financial distress. Immediate intervention required.";
  if (score >= 70)
    return "Customer is showing significant financial stress. Multiple risk factors need attention.";
  if (score >= 40)
    return "Customer has some financial concerns. A few issues should be monitored closely.";
  return "Customer is financially healthy with minimal risk indicators.";
}

export function RiskDetailsDialog({
  riskSummary,
  isRecalculating,
  onRecalculate,
}) {
  const score = riskSummary?.riskScore ?? 0;
  const riskLevel = riskSummary?.riskLevel ?? "N/A";
  const breakdown = riskSummary?.riskBreakdown || {};

  const deductions = Object.entries(breakdown)
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({
      category: RISK_FACTOR_LABELS[key] || key,
      deduction: value,
      reason: getRiskReason(key),
    }));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <ShieldAlert className="h-4 w-4 mr-2" />
          Risk Details
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-2xl max-h-[80vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {score <= 30 && (
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            )}
            {score > 30 && score <= 60 && (
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            )}
            {score > 60 && score <= 80 && (
              <AlertCircle className="w-5 h-5 text-orange-500" />
            )}
            {score > 80 && <XCircle className="w-5 h-5 text-red-500" />}
            Customer Risk Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
            <div>
              <p className="text-sm text-muted-foreground">
                Overall Risk Score
              </p>
              <p className="text-3xl font-bold mt-1">{score}/100</p>
            </div>
            <Badge className={cn("px-4 py-2", riskBadgeStyles[riskLevel])}>
              {riskLevel}
            </Badge>
          </div>

          <div className="p-4 rounded-lg border">
            <p className="font-medium mb-2">What does this mean?</p>
            <p className="text-sm text-muted-foreground">
              {getRiskExplanation(score)}
            </p>
          </div>

          {deductions.length > 0 && (
            <div>
              <p className="font-medium mb-3">
                Risk Factors ({deductions.length} issues found)
              </p>
              <div className="space-y-2">
                {deductions.map((d, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border bg-red-50/50 dark:bg-red-950/20"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="destructive" className="text-xs">
                            +{d.deduction} pts
                          </Badge>
                          <span className="text-sm font-medium">
                            {d.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {d.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {deductions.length === 0 && (
            <div className="p-8 rounded-lg border bg-green-50/50 dark:bg-green-950/20 text-center">
              <CheckCircle className="w-10 h-10 mx-auto text-emerald-500 mb-3" />
              <p className="font-medium text-emerald-700 dark:text-emerald-400">
                No risk issues detected!
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                This customer is financially healthy with no significant risk
                factors.
              </p>
            </div>
          )}

          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
            <p className="text-sm font-medium mb-2 text-blue-900 dark:text-blue-300">
              How is the risk score calculated?
            </p>
            <div className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
              <p>• Starts at 0 — higher score means higher risk</p>
              <p>• Low savings rate: up to +30 points</p>
              <p>• Spending spike vs prior month: up to +20 points</p>
              <p>• Low account balance: up to +35 points</p>
              <p>• High subscription burden: up to +10 points</p>
              <p>• Spending volatility (CV &gt; 50%): +15 points</p>
            </div>
          </div>

          <Button
            onClick={onRecalculate}
            disabled={isRecalculating}
            variant="outline"
            className="w-full"
          >
            <RefreshCw
              className={cn("h-4 w-4 mr-2", isRecalculating && "animate-spin")}
            />
            {isRecalculating ? "Recalculating..." : "Recalculate Risk Score"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
