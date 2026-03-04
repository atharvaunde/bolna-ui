import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function StatCard({ label, icon: Icon, value, description, isLoading }) {
  if (isLoading) {
    return (
      <Card className="shadow-none border-border/60">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardHeader>
          <Skeleton className="h-8 w-16 mb-1" />
          <Skeleton className="h-3 w-32" />
        </CardHeader>
      </Card>
    );
  }
  return (
    <Card className="border-border/60 bg-card/60 shadow-none">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            {label}
          </CardTitle>
          {description && (
            <Badge variant="secondary" className="bg-muted text-foreground/80">
              {description}
            </Badge>
          )}
        </div>
        <CardDescription className="text-2xl font-semibold text-foreground">
          {value ?? "-"}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
