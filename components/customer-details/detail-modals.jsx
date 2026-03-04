import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useRef } from "react";

export function TransactionDetailModal({ transaction, open, onClose }) {
  if (!transaction) return null;

  const balanceAfter =
    transaction.balanceAfterTransaction ?? transaction.balance;

  const fields = [
    { label: "Transaction ID", value: transaction.transactionId },
    {
      label: "Reference Number",
      value: transaction.referenceNumber || transaction.referenceId || "—",
    },
    {
      label: "Date",
      value: new Date(transaction.transactionDate).toLocaleString("en-IN"),
    },
    {
      label: "Initiated At",
      value: transaction.initiationTimestamp
        ? new Date(transaction.initiationTimestamp).toLocaleString("en-IN")
        : "—",
    },
    {
      label: "Settled At",
      value: transaction.settlementTimestamp
        ? new Date(transaction.settlementTimestamp).toLocaleString("en-IN")
        : "—",
    },
    { label: "Type", value: transaction.transactionType },
    {
      label: "Amount",
      value: `₹${transaction.amount?.toLocaleString("en-IN")}`,
    },
    {
      label: "Balance After",
      value:
        balanceAfter != null
          ? `₹${balanceAfter?.toLocaleString("en-IN")}`
          : "—",
    },
    {
      label: "Instrument",
      value: transaction.instrument?.replace(/_/g, " ") || "—",
    },
    { label: "Channel", value: transaction.channel?.replace(/_/g, " ") || "—" },
    { label: "Category", value: transaction.transactionCategory || "—" },
    { label: "Sub Category", value: transaction.subCategory || "—" },
    { label: "Merchant Name", value: transaction.merchantName || "—" },
    { label: "Merchant City", value: transaction.merchantCity || "—" },
    { label: "Merchant MCC", value: transaction.merchantCategoryCode || "—" },
    {
      label: "Product Type",
      value: transaction.productType?.replace(/_/g, " ") || "—",
    },
    { label: "Status", value: transaction.status || "—" },
    { label: "Description", value: transaction.description || "—" },
    { label: "Remarks", value: transaction.remarks || "—" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>{transaction.transactionId}</DialogDescription>
        </DialogHeader>
        <div className="space-y-1 mt-2">
          {fields.map((f) => (
            <div
              key={f.label}
              className="flex justify-between items-start gap-4 py-2 border-b last:border-0"
            >
              <span className="text-sm text-muted-foreground shrink-0">
                {f.label}
              </span>
              <span className="text-sm font-medium text-right break-all">
                {f.value}
              </span>
            </div>
          ))}
          {transaction.tags?.length > 0 && (
            <div className="flex justify-between items-start gap-4 py-2">
              <span className="text-sm text-muted-foreground">Tags</span>
              <div className="flex gap-1 flex-wrap justify-end">
                {transaction.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CallDetailModal({ call, open, onClose }) {
  const audioRef = useRef(null);

  // Stop audio when dialog closes
  useEffect(() => {
    if (!open && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [open]);

  if (!call) return null;

  const telephonyData = call.telephonyData || {};
  const recordingUrl = telephonyData.recording_url;

  const fields = [
    { label: "Execution ID", value: call.executionId },
    { label: "Status", value: call.status },
    {
      label: "Initiated At",
      value: call.initiatedAt
        ? new Date(call.initiatedAt).toLocaleString("en-IN")
        : "—",
    },
    {
      label: "Duration",
      value:
        call.conversationDuration != null
          ? `${call.conversationDuration}s`
          : telephonyData.duration
            ? `${telephonyData.duration}s`
            : "—",
    },
    {
      label: "Agent Number",
      value: call.agentNumber || telephonyData.from_number || "—",
    },
    {
      label: "Customer Phone",
      value:
        call.userNumber || call.customerPhone || telephonyData.to_number || "—",
    },
    {
      label: "Call Type",
      value: telephonyData.call_type || "—",
    },
    {
      label: "Provider",
      value: telephonyData.provider || "—",
    },
    {
      label: "Hangup By",
      value: telephonyData.hangup_by || "—",
    },
    {
      label: "Hangup Reason",
      value: telephonyData.hangup_reason || "—",
    },
    {
      label: "Answered by Voicemail",
      value:
        call.answeredByVoiceMail != null
          ? call.answeredByVoiceMail
            ? "Yes"
            : "No"
          : "—",
    },
    { label: "Summary", value: call.summary || "—" },
    { label: "Error", value: call.errorMessage || "—" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Call Details</DialogTitle>
          <DialogDescription>{call.executionId}</DialogDescription>
        </DialogHeader>
        <div className="space-y-1 mt-2">
          {fields.map((f) => (
            <div
              key={f.label}
              className="flex justify-between items-start gap-4 py-2 border-b last:border-0"
            >
              <span className="text-sm text-muted-foreground shrink-0">
                {f.label}
              </span>
              <span className="text-sm font-medium text-right break-all">
                {f.value}
              </span>
            </div>
          ))}
          {recordingUrl && (
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-2">
                Call Recording
              </p>
              <audio
                ref={audioRef}
                controls
                className="w-full"
                preload="metadata"
              >
                <source src={recordingUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
          {call.transcript && (
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-1">Transcript</p>
              <p className="text-sm whitespace-pre-wrap rounded-md bg-muted/40 p-3">
                {call.transcript}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
