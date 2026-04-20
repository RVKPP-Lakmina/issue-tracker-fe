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
import { useProjects } from "@/lib/hooks/useApi";
import { useDebounce } from "../../lib/hooks/useDebounce";

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
    projectFilter,
    setSearchQuery,
    setStatusFilters,
    setPriorityFilter,
    setProjectFilter,
    clearFilters,
  } = useIssueStore();
  const { data: projectsResponse, isLoading: isProjectsLoading } =
    useProjects();
  const projects = projectsResponse?.data || [];

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

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
    searchQuery || statusFilters.length > 0 || priorityFilter || projectFilter;

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Project</label>
          <Select
            value={projectFilter || "__ALL_PROJECTS__"}
            onValueChange={(value) =>
              setProjectFilter(value === "__ALL_PROJECTS__" ? null : value)
            }
            disabled={isProjectsLoading}
          >
            <SelectTrigger className="bg-secondary/50">
              <SelectValue
                placeholder={
                  isProjectsLoading ? "Loading projects..." : "All projects"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__ALL_PROJECTS__">All projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
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
