import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const riskBadgeStyles = {
  LOW: "border-green-200 bg-green-50 text-green-700",
  MEDIUM: "border-yellow-200 bg-yellow-50 text-yellow-700",
  HIGH: "border-orange-200 bg-orange-50 text-orange-700",
  CRITICAL: "border-red-200 bg-red-50 text-red-700",
};

export const customerColumns = [
  {
    accessorKey: "customerId",
    header: "Customer ID",
    cell: ({ row }) => (
      <span className="text-xs">{row.original.customerId}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "riskLevel",
    header: "Risk Level",
    cell: ({ row }) => {
      const level = row.original.riskLevel || "LOW";
      return (
        <Badge
          variant="outline"
          className={cn("text-xs", riskBadgeStyles[level])}
        >
          {level}
        </Badge>
      );
    },
  },
  {
    accessorKey: "riskScore",
    header: "Risk Score",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.riskScore ?? 0}</span>
    ),
  },
];
