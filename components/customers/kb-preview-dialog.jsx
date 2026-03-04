import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Brain } from "lucide-react";
import { toast } from "sonner";

export function KBPreviewDialog({
  open,
  onOpenChange,
  markdown,
  meta,
  isGenerating,
  onGenerate,
}) {
  const handleCopy = () => {
    navigator.clipboard?.writeText(markdown);
    toast.success("Copied to clipboard");
  };

  const handleUpload = () => {
    onOpenChange(false);
    onGenerate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Knowledgebase Preview
          </DialogTitle>
          <DialogDescription>
            {meta
              ? `${meta.customersProcessed} customers · ${meta.markdownSizeKB}KB`
              : "Markdown document ready for Bolna upload"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto rounded-md border bg-muted/40 p-4 mt-2">
          <pre className="text-xs font-mono whitespace-pre-wrap break-words leading-relaxed">
            {markdown}
          </pre>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            Copy
          </Button>
          <Button size="sm" disabled={isGenerating} onClick={handleUpload}>
            <Brain className="h-4 w-4 mr-2" />
            {isGenerating ? "Uploading…" : "Upload to Bolna"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
