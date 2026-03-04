import { TransactionTrends } from "@/components/dashboard/transaction-trends";

export default function Page() {
  return (
    <div className="w-full p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of transaction trends and analytics
        </p>
      </div>
      <TransactionTrends />
    </div>
  );
}
