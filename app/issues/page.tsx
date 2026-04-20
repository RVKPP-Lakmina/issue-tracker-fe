"use client";

import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/issues/FilterBar";
import { IssueTable } from "@/components/issues/IssueTable";
import { DashboardStats } from "@/components/issues/DashboardStats";
import { IssueModals } from "@/components/issues/IssueModals";
import { useIssueStore } from "@/lib/store/issueStore";
import { useIssues } from "@/lib/hooks/useApi";
import { Plus, Download } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

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
      <PageWrapper
        title="Issue Tracker"
        description="Welcome back. Track, prioritize, and resolve issues quickly."
        headerRightContent={
          <>
            <Button
              variant="outline"
              onClick={() => handleExport("csv")}
              size="sm"
              title="Export issues"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={openCreateModal}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Issue
            </Button>
          </>
        }
      >
        {/* Dashboard Stats */}
        <DashboardStats issues={issues} isLoading={isLoading} />

        {/* Filter Bar */}
        <FilterBar />

        {/* Issues Table */}
        <IssueTable issues={issues} isLoading={isLoading} />
      </PageWrapper>

      {/* Modals */}
      <IssueModals />
    </>
  );
}
