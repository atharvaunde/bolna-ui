"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCustomerStore } from "@/lib/stores/customerStore";
import { DataTable } from "@/components/data-table";
import { customerColumns } from "@/components/customers/table-columns";
import { CustomerHeader } from "@/components/customers/customer-header";
import { CustomerFilters } from "@/components/customers/customer-filters";
import { KBPreviewDialog } from "@/components/customers/kb-preview-dialog";

export function CustomersPage() {
  const router = useRouter();
  const {
    customers,
    pagination,
    isLoading,
    fetchCustomers,
    isGeneratingKB,
    isPreviewingKB,
    kbPreviewData,
    generateKnowledgebase,
    previewKnowledgebase,
  } = useCustomerStore();

  const [paginationState, setPaginationState] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [kbPreviewOpen, setKbPreviewOpen] = useState(false);

  useEffect(() => {
    const params = {
      page: paginationState.pageIndex + 1,
      limit: paginationState.pageSize,
    };
    if (searchQuery) params.name = searchQuery;
    if (riskFilter && riskFilter !== "ALL") params.riskLevel = riskFilter;

    fetchCustomers(params);
  }, [paginationState.pageIndex, paginationState.pageSize]);

  const handleSearch = () => {
    const params = {
      page: 1,
      limit: paginationState.pageSize,
    };
    if (searchQuery) params.name = searchQuery;
    if (riskFilter && riskFilter !== "ALL") params.riskLevel = riskFilter;

    setPaginationState((prev) => ({ ...prev, pageIndex: 0 }));
    fetchCustomers(params);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleRiskFilterChange = (value) => {
    setRiskFilter(value);
    const params = {
      page: 1,
      limit: paginationState.pageSize,
    };
    if (searchQuery) params.name = searchQuery;
    if (value && value !== "ALL") params.riskLevel = value;

    setPaginationState((prev) => ({ ...prev, pageIndex: 0 }));
    fetchCustomers(params);
  };

  const handleRefresh = () => {
    const params = {
      page: paginationState.pageIndex + 1,
      limit: paginationState.pageSize,
    };
    if (searchQuery) params.name = searchQuery;
    if (riskFilter && riskFilter !== "ALL") params.riskLevel = riskFilter;
    fetchCustomers(params);
  };

  const handlePaginationChange = (newPagination) => {
    setPaginationState(newPagination);
  };

  const handleGenerateKB = async () => {
    await generateKnowledgebase();
  };

  const handlePreviewKB = async () => {
    await previewKnowledgebase();
    setKbPreviewOpen(true);
  };

  const handleRowClick = (customer) => {
    router.push(`/customers/${customer._id}`);
  };

  return (
    <div className="p-6 w-full h-full space-y-4">
      <CustomerHeader
        onPreview={handlePreviewKB}
        onGenerate={handleGenerateKB}
        onRefresh={handleRefresh}
        isPreviewingKB={isPreviewingKB}
        isGeneratingKB={isGeneratingKB}
        isLoading={isLoading}
      />

      <CustomerFilters
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        riskFilter={riskFilter}
        onRiskFilterChange={handleRiskFilterChange}
        onSearch={handleSearch}
      />

      <DataTable
        columns={customerColumns}
        data={customers}
        isLoading={isLoading}
        onRowClick={handleRowClick}
        serverSide={true}
        pageCount={pagination?.totalPages || 1}
        onPaginationChange={handlePaginationChange}
        pageIndex={paginationState.pageIndex}
        pageSize={paginationState.pageSize}
      />

      <KBPreviewDialog
        open={kbPreviewOpen}
        onOpenChange={setKbPreviewOpen}
        markdown={kbPreviewData?.markdown ?? ""}
        meta={
          kbPreviewData
            ? {
                customersProcessed: kbPreviewData.customersProcessed,
                markdownSizeKB: kbPreviewData.markdownSizeKB,
              }
            : null
        }
        isGenerating={isGeneratingKB}
        onGenerate={handleGenerateKB}
      />
    </div>
  );
}

export default CustomersPage;
