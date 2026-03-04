import { Button } from "@/components/ui/button";
import { RefreshCw, Brain, Eye } from "lucide-react";

export function CustomerHeader({
  onPreview,
  onGenerate,
  onRefresh,
  isPreviewingKB,
  isGeneratingKB,
  isLoading,
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground">
          Manage and view all customer profiles
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          onClick={onPreview}
          disabled={isPreviewingKB}
          variant="outline"
          size="sm"
          className="shrink-0"
        >
          <Eye
            className={`h-4 w-4 ${isPreviewingKB ? "animate-pulse" : ""} md:mr-2`}
          />
          <span className="hidden md:inline">
            {isPreviewingKB ? "Loading…" : "Preview KB"}
          </span>
        </Button>
        <Button
          onClick={onGenerate}
          disabled={isGeneratingKB}
          variant="outline"
          size="sm"
          className="shrink-0"
        >
          <Brain
            className={`h-4 w-4 ${isGeneratingKB ? "animate-pulse" : ""} md:mr-2`}
          />
          <span className="hidden md:inline">
            {isGeneratingKB ? "Generating…" : "Generate KB"}
          </span>
        </Button>
        <Button
          onClick={onRefresh}
          disabled={isLoading}
          size="sm"
          className="shrink-0"
        >
          <RefreshCw
            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""} md:mr-2`}
          />
          <span className="hidden md:inline">Refresh</span>
        </Button>
      </div>
    </div>
  );
}
