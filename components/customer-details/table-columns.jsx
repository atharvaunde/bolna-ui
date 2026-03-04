import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const productColumns = [
  {
    accessorKey: "productType",
    header: "Product Type",
    cell: ({ row }) => (
      <Badge variant="secondary" className="text-xs">
        {row.original.productType?.replace(/_/g, " ")}
      </Badge>
    ),
  },
  {
    accessorKey: "productName",
    header: "Product Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.productName}</span>
    ),
  },
  {
    accessorKey: "productNumber",
    header: "Product Number",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.productNumber}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status || "ACTIVE";
      const statusColors = {
        ACTIVE: "border-green-200 bg-green-50 text-green-700",
        INACTIVE: "border-yellow-200 bg-yellow-50 text-yellow-700",
        CLOSED: "border-red-200 bg-red-50 text-red-700",
      };
      return (
        <Badge
          variant="outline"
          className={cn("text-xs", statusColors[status])}
        >
          {status}
        </Badge>
      );
    },
  },
];

export const transactionColumns = [
  {
    accessorKey: "transactionDate",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.transactionDate);
      return (
        <span className="text-sm">
          {date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="text-sm max-w-[200px] truncate block">
        {row.original.description || "—"}
      </span>
    ),
  },
  {
    accessorKey: "transactionType",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.transactionType;
      return (
        <Badge
          variant="outline"
          className={cn(
            "text-xs",
            type === "CREDIT"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700",
          )}
        >
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.original.amount;
      const type = row.original.transactionType;
      return (
        <span
          className={cn(
            "font-mono text-sm font-medium",
            type === "CREDIT" ? "text-green-600" : "text-red-600",
          )}
        >
          {type === "CREDIT" ? "+" : "-"}₹
          {amount?.toLocaleString("en-IN") ?? "0"}
        </span>
      );
    },
  },
  {
    accessorKey: "instrument",
    header: "Instrument",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.instrument?.replace(/_/g, " ") || "—"}
      </span>
    ),
  },
  {
    accessorKey: "transactionCategory",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="secondary" className="text-xs">
        {row.original.transactionCategory || "OTHER"}
      </Badge>
    ),
  },
];

export const callColumns = [
  {
    accessorKey: "initiatedAt",
    header: "Date",
    cell: ({ row }) => {
      const d = row.original.initiatedAt
        ? new Date(row.original.initiatedAt)
        : null;
      return (
        <span className="text-sm">
          {d
            ? d.toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status || "queued";
      const statusColors = {
        completed: "border-green-200 bg-green-50 text-green-700",
        failed: "border-red-200 bg-red-50 text-red-700",
        queued: "border-yellow-200 bg-yellow-50 text-yellow-700",
        in_progress: "border-blue-200 bg-blue-50 text-blue-700",
      };
      return (
        <Badge
          variant="outline"
          className={cn(
            "text-xs capitalize",
            statusColors[status] || "border-gray-200 bg-gray-50",
          )}
        >
          {status.replace(/_/g, " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "conversationDuration",
    header: "Duration",
    cell: ({ row }) => {
      const d = row.original.conversationDuration;
      return (
        <span className="text-sm font-mono">{d != null ? `${d}s` : "—"}</span>
      );
    },
  },
  {
    accessorKey: "executionId",
    header: "Execution ID",
    cell: ({ row }) => (
      <span className="text-xs font-mono text-muted-foreground">
        {row.original.executionId}
      </span>
    ),
  },
  {
    accessorKey: "answeredByVoiceMail",
    header: "Voicemail",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.answeredByVoiceMail != null
          ? row.original.answeredByVoiceMail
            ? "Yes"
            : "No"
          : "—"}
      </span>
    ),
  },
];
