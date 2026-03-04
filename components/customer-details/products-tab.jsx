import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/data-table";
import { Package } from "lucide-react";
import { productColumns } from "./table-columns";

export function ProductsTab({ products, isLoading }) {
  return (
    <Card className="border-border/60 bg-card/60 shadow-none">
      <CardHeader className="flex flex-col gap-1">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Package className="size-4" /> Banking Products
        </CardTitle>
        <CardDescription>
          All active products held by this customer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {products?.length > 0 ? (
          <DataTable
            columns={productColumns}
            data={products}
            isLoading={isLoading}
          />
        ) : isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground text-sm">
            No products found for this customer.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
