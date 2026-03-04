import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export function CustomerFilters({
  searchQuery,
  onSearchChange,
  onKeyDown,
  riskFilter,
  onRiskFilterChange,
  onSearch,
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name..."
          value={searchQuery}
          onChange={onSearchChange}
          onKeyDown={onKeyDown}
          className="pl-9"
        />
      </div>
      <Select value={riskFilter} onValueChange={onRiskFilterChange}>
        <SelectTrigger className="w-full md:w-[160px]">
          <SelectValue placeholder="Risk Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Levels</SelectItem>
          <SelectItem value="LOW">Low</SelectItem>
          <SelectItem value="MEDIUM">Medium</SelectItem>
          <SelectItem value="HIGH">High</SelectItem>
          <SelectItem value="CRITICAL">Critical</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm" onClick={onSearch}>
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </div>
  );
}
