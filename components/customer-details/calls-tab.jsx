import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { PhoneCall } from "lucide-react";
import { useCustomerStore } from "@/lib/stores/customerStore";
import { callColumns } from "./table-columns";
import { CallDetailModal } from "./detail-modals";

export function CallsTab({ customerId }) {
  const { calls, callsPagination, isLoadingCalls, fetchCalls } =
    useCustomerStore();

  const [paginationState, setPaginationState] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const [selectedCall, setSelectedCall] = useState(null);

  useEffect(() => {
    fetchCalls(customerId, {
      page: paginationState.pageIndex + 1,
      limit: paginationState.pageSize,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationState.pageIndex, paginationState.pageSize, customerId]);

  return (
    <Card className="border-border/60 bg-card/60 shadow-none">
      <CardHeader className="flex flex-col gap-1">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <PhoneCall className="size-4" /> Call History
        </CardTitle>
        <CardDescription>AI-initiated calls for this customer.</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={callColumns}
          data={calls}
          isLoading={isLoadingCalls}
          serverSide={true}
          pageCount={callsPagination?.totalPages || 1}
          onPaginationChange={setPaginationState}
          pageIndex={paginationState.pageIndex}
          pageSize={paginationState.pageSize}
          onRowClick={(rowData) => setSelectedCall(rowData)}
        />
        <CallDetailModal
          call={selectedCall}
          open={!!selectedCall}
          onClose={() => setSelectedCall(null)}
        />
      </CardContent>
    </Card>
  );
}
