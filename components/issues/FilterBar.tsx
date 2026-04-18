"use client";

import { useIssueStore } from "@/lib/store/issueStore";
import { IssueStatus, IssuePriority } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const statusOptions: IssueStatus[] = [
  "open",
  "in-progress",
  "closed",
  "on-hold",
];
const priorityOptions: IssuePriority[] = ["low", "medium", "high", "critical"];

export function FilterBar() {
  const {
    searchQuery,
    statusFilters,
    priorityFilter,
    setSearchQuery,
    setStatusFilters,
    setPriorityFilter,
    clearFilters,
  } = useIssueStore();

  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  const toggleStatus = useCallback(
    (status: IssueStatus) => {
      setStatusFilters(
        statusFilters.includes(status)
          ? statusFilters.filter((s) => s !== status)
          : [...statusFilters, status],
      );
    },
    [statusFilters, setStatusFilters],
  );

  const hasActiveFilters =
    searchQuery || statusFilters.length > 0 || priorityFilter;

  return (
    <div className="space-y-4 p-6 bg-card border border-border rounded-lg">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search issues..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="pl-10 bg-secondary/50"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Status</label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => toggleStatus(status)}
                className={`px-3 py-1 text-sm rounded-full transition ${
                  statusFilters.includes(status)
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Priority
          </label>
          <Select
            value={priorityFilter || ""}
            onValueChange={(value) =>
              setPriorityFilter(value ? (value as IssuePriority) : null)
            }
          >
            <SelectTrigger className="bg-secondary/50">
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              {priorityOptions.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="w-full"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
