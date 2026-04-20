"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProjects, useTimeEntries, useUsers } from "@/lib/hooks/useApi";
import { Download, Clock3 } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { SelectField } from "@/components/ui/select-field";

const allOption = "__ALL__";

const activityOptions = [
  { value: "requirements-definition", label: "Requirements definition" },
  { value: "basic-design", label: "Basic design" },
  { value: "implementation", label: "Implementation" },
  { value: "review", label: "Review" },
  { value: "api-test", label: "API test" },
  { value: "system-test", label: "System test" },
  { value: "acceptance-test", label: "Acceptance test" },
  { value: "release", label: "Release" },
  { value: "investigation", label: "Investigation" },
  { value: "meeting", label: "Meeting" },
  { value: "project-management", label: "Project management" },
  { value: "other", label: "Other" },
] as const;

export default function ReportsPage() {
  const [userId, setUserId] = useState(allOption);
  const [projectId, setProjectId] = useState(allOption);
  const [activity, setActivity] = useState(allOption);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { data: users = [] } = useUsers();
  const { data: projectsResponse } = useProjects();
  const projects = projectsResponse?.data || [];

  const { data: timeEntriesResponse, isLoading } = useTimeEntries({
    userId: userId === allOption ? undefined : userId,
    projectId: projectId === allOption ? undefined : projectId,
    activity:
      activity === allOption
        ? undefined
        : (activity as (typeof activityOptions)[number]["value"]),
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    pageSize: 100,
  });

  const entries = timeEntriesResponse?.data || [];

  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);

  const handleExportCsv = () => {
    const headers = [
      "Date",
      "User",
      "Project",
      "Issue",
      "Activity",
      "Comment",
      "Hours",
    ];

    const rows = entries.map((entry) => [
      new Date(entry.date).toLocaleDateString(),
      entry.user?.name || "Unknown",
      entry.issue?.project?.name || "-",
      entry.issue?.title || entry.issueId,
      entry.activity,
      entry.comment,
      entry.hours.toFixed(2),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `spent-time-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageWrapper
      title="Reports"
      description="Generate detailed reports on time spent by users across projects and activities."
      headerRightContent={
        <Button onClick={handleExportCsv} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <SelectField
            value={userId}
            onValueChange={setUserId}
            placeholder="All users"
            options={[
              { value: allOption, label: "All users" },
              ...users.map((user) => ({ value: user.id, label: user.name })),
            ]}
          />

          <SelectField
            value={projectId}
            onValueChange={setProjectId}
            placeholder="All projects"
            options={[
              { value: allOption, label: "All projects" },
              ...projects.map((project) => ({
                value: project.id,
                label: project.name,
              })),
            ]}
          />

          <SelectField
            value={activity}
            onValueChange={setActivity}
            placeholder="All activities"
            options={[
              { value: allOption, label: "All activities" },
              ...activityOptions.map((option) => ({
                value: option.value,
                label: option.label,
              })),
            ]}
          />

          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Time Entries ({entries.length})</CardTitle>
          <div className="text-sm font-medium text-foreground">
            Total Hours: {totalHours.toFixed(2)}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">
              Loading time entries...
            </p>
          ) : entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No time entries found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="py-2 pr-2">Date</th>
                    <th className="py-2 pr-2">User</th>
                    <th className="py-2 pr-2">Project</th>
                    <th className="py-2 pr-2">Issue</th>
                    <th className="py-2 pr-2">Activity</th>
                    <th className="py-2 pr-2">Comment</th>
                    <th className="py-2 pr-2 text-right">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className="border-b border-border/60">
                      <td className="py-2 pr-2">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      <td className="py-2 pr-2">
                        {entry.user?.name || "Unknown"}
                      </td>
                      <td className="py-2 pr-2">
                        {entry.issue?.project?.name || "-"}
                      </td>
                      <td className="py-2 pr-2">
                        {entry.issue?.title || entry.issueId}
                      </td>
                      <td className="py-2 pr-2">{entry.activity}</td>
                      <td
                        className="py-2 pr-2 max-w-[320px] truncate"
                        title={entry.comment}
                      >
                        {entry.comment}
                      </td>
                      <td className="py-2 pr-2 text-right">
                        {entry.hours.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
