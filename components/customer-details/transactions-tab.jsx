import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DataTable } from "@/components/data-table";
import { CreditCard, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCustomerStore } from "@/lib/stores/customerStore";
import { transactionColumns } from "./table-columns";
import { TransactionDetailModal } from "./detail-modals";

export function TransactionsTab({ customerId }) {
  const {
    transactions,
    transactionPagination,
    isLoadingTransactions,
    fetchTransactions,
    products,
  } = useCustomerStore();

  const [paginationState, setPaginationState] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);
  const [instrument, setInstrument] = useState("ALL");
  const [transactionType, setTransactionType] = useState("ALL");
  const [category, setCategory] = useState("ALL");
  const [productId, setProductId] = useState("ALL");
  const [selectedTxn, setSelectedTxn] = useState(null);

  const buildParams = (overrides = {}) => {
    const params = {
      page: paginationState.pageIndex + 1,
      limit: paginationState.pageSize,
    };
    if (startDate) params.startDate = format(startDate, "yyyy-MM-dd");
    if (endDate) params.endDate = format(endDate, "yyyy-MM-dd");
    if (instrument && instrument !== "ALL") params.instrument = instrument;
    if (transactionType && transactionType !== "ALL")
      params.transactionType = transactionType;
    if (category && category !== "ALL") params.category = category;
    if (productId && productId !== "ALL") params.productId = productId;
    return { ...params, ...overrides };
  };

  useEffect(() => {
    fetchTransactions(customerId, buildParams());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationState.pageIndex, paginationState.pageSize, customerId]);

  const handleApplyFilters = () => {
    const params = buildParams({ page: 1 });
    setPaginationState((prev) => ({ ...prev, pageIndex: 0 }));
    fetchTransactions(customerId, params);
  };

  return (
    <Card className="border-border/60 bg-card/60 shadow-none">
      <CardHeader className="flex flex-col gap-1">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <CreditCard className="size-4" /> Transaction History
        </CardTitle>
        <CardDescription>Full transaction ledger with filters.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground block">
              Start Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[150px] justify-start text-left font-normal",
                    !startDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground block">
              End Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[150px] justify-start text-left font-normal",
                    !endDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Product</label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger className="w-[170px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Products</SelectItem>
                {(products || []).map((p) => (
                  <SelectItem key={p._id} value={p._id}>
                    {p.productType?.replace(/_/g, " ")} –{" "}
                    {p.productNumber?.slice(-4)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Type</label>
            <Select value={transactionType} onValueChange={setTransactionType}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="CREDIT">Credit</SelectItem>
                <SelectItem value="DEBIT">Debit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Instrument</label>
            <Select value={instrument} onValueChange={setInstrument}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="NEFT">NEFT</SelectItem>
                <SelectItem value="IMPS">IMPS</SelectItem>
                <SelectItem value="RTGS">RTGS</SelectItem>
                <SelectItem value="CARD">Card</SelectItem>
                <SelectItem value="ATM">ATM</SelectItem>
                <SelectItem value="CHEQUE">Cheque</SelectItem>
                <SelectItem value="AUTO_DEBIT">Auto Debit</SelectItem>
                <SelectItem value="EMI_PAYMENT">EMI Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="SALARY">Salary</SelectItem>
                <SelectItem value="RENT">Rent</SelectItem>
                <SelectItem value="SHOPPING">Shopping</SelectItem>
                <SelectItem value="FOOD">Food</SelectItem>
                <SelectItem value="UTILITIES">Utilities</SelectItem>
                <SelectItem value="LOAN">Loan</SelectItem>
                <SelectItem value="INVESTMENT">Investment</SelectItem>
                <SelectItem value="TRANSFER">Transfer</SelectItem>
                <SelectItem value="TRAVEL">Travel</SelectItem>
                <SelectItem value="SUBSCRIPTION">Subscription</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button size="sm" onClick={handleApplyFilters}>
            Apply
          </Button>
        </div>

        <DataTable
          columns={transactionColumns}
          data={transactions}
          isLoading={isLoadingTransactions}
          serverSide={true}
          pageCount={transactionPagination?.totalPages || 1}
          onPaginationChange={setPaginationState}
          pageIndex={paginationState.pageIndex}
          pageSize={paginationState.pageSize}
          onRowClick={(rowData) => setSelectedTxn(rowData)}
        />

        <TransactionDetailModal
          transaction={selectedTxn}
          open={!!selectedTxn}
          onClose={() => setSelectedTxn(null)}
        />
      </CardContent>
    </Card>
  );
}
