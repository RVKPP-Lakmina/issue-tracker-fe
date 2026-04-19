"use client";

import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/issues/FilterBar";
import { IssueTable } from "@/components/issues/IssueTable";
import { DashboardStats } from "@/components/issues/DashboardStats";
import { IssueModals } from "@/components/issues/IssueModals";
import { useIssueStore } from "@/lib/store/issueStore";
import { useIssues } from "@/lib/hooks/useApi";
import { Plus, Download } from "lucide-react";

export default function IssuesPage() {
  const {
    openCreateModal,
    searchQuery,
    statusFilters,
    priorityFilter,
    projectFilter,
  } = useIssueStore();

  // Fetch issues with filters
  const { data: response, isLoading } = useIssues({
    search: searchQuery || undefined,
    status: statusFilters.length > 0 ? statusFilters : undefined,
    priority: priorityFilter || undefined,
    projectId: projectFilter || undefined,
  });

  const issues = response?.data || [];

  const handleExport = (format: "json" | "csv") => {
    if (format === "json") {
      const json = JSON.stringify(issues, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `issues-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
    } else {
      // CSV export
      const headers = [
        "ID",
        "Title",
        "Status",
        "Priority",
        "Assigned To",
        "Created",
      ];
      const rows = issues.map((i) => [
        i.id,
        i.title,
        i.status,
        i.priority,
        i.assignedTo?.name || "Unassigned",
        new Date(i.createdAt).toLocaleDateString(),
      ]);

      const csv = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `issues-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="rounded-2xl border border-border bg-card/90 px-6 py-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Issue Tracker
              </h1>
              <p className="text-muted-foreground mt-1">
                Welcome back. Track, prioritize, and resolve issues quickly.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleExport("csv")}
                size="sm"
                title="Export issues"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                onClick={openCreateModal}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Issue
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <DashboardStats issues={issues} isLoading={isLoading} />

        {/* Filter Bar */}
        <FilterBar />

        {/* Issues Table */}
        <IssueTable issues={issues} isLoading={isLoading} />
      </div>

      {/* Modals */}
      <IssueModals />
    </>
  );
}
