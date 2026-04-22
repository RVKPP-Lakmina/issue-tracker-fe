"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProjects, useTimeEntries, useUsers } from "@/lib/hooks/useApi";
import { Check, ChevronDown, Download, Clock3 } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { useAuthStore } from "@/lib/store/authStore";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/lib/hooks/useDebounce";

const allOption = "__ALL__";

type SearchableOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

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

function SearchableSelectField({
  label,
  value,
  onValueChange,
  placeholder,
  searchPlaceholder,
  emptyText,
  options,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  emptyText: string;
  options: SearchableOption[];
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 250);

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    if (!query) {
      return options;
    }

    return options.filter((option) => {
      return option.label.toLowerCase().includes(query);
    });
  }, [debouncedSearch, options]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) {
            setSearch("");
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            <span
              className={cn(
                "truncate text-left",
                selectedOption ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-(--radix-popover-trigger-width) p-0"
          align="start"
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={searchPlaceholder}
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      onValueChange(option.value);
                      setOpen(false);
                      setSearch("");
                    }}
                    disabled={option.disabled}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default function ReportsPage() {
  const [userId, setUserId] = useState(allOption);
  const [projectId, setProjectId] = useState(allOption);
  const [activity, setActivity] = useState(allOption);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const currentUserId = useAuthStore((state) => state.user?.id);
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
        <Accordion type="single" collapsible defaultValue="filters">
          <AccordionItem value="filters" className="border-b-0">
            <CardHeader className="px-6 py-0">
              <AccordionTrigger className="py-0 no-underline hover:no-underline">
                <div className="flex w-full items-center justify-between gap-4">
                  <div className="text-left">
                    <CardTitle>Filters</CardTitle>
                    <p className="mt-1 text-sm font-normal text-muted-foreground">
                      Narrow results by user, project, activity, and date range.
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              <CardContent className="space-y-4 pt-0">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <SearchableSelectField
                    label="User"
                    value={userId}
                    onValueChange={setUserId}
                    placeholder="All users"
                    searchPlaceholder="Search users..."
                    emptyText="No users found"
                    options={[
                      { value: allOption, label: "All users" },
                      ...users.map((user) => ({
                        value: user.id,
                        label: user.id === currentUserId ? "ME" : user.name,
                      })),
                    ]}
                  />

                  <SearchableSelectField
                    label="Project"
                    value={projectId}
                    onValueChange={setProjectId}
                    placeholder="All projects"
                    searchPlaceholder="Search projects..."
                    emptyText="No projects found"
                    options={[
                      { value: allOption, label: "All projects" },
                      ...projects.map((project) => ({
                        value: project.id,
                        label: project.name,
                      })),
                    ]}
                  />

                  <SearchableSelectField
                    label="Activity"
                    value={activity}
                    onValueChange={setActivity}
                    placeholder="All activities"
                    searchPlaceholder="Search activities..."
                    emptyText="No activities found"
                    options={[
                      { value: allOption, label: "All activities" },
                      ...activityOptions.map((option) => ({
                        value: option.value,
                        label: option.label,
                      })),
                    ]}
                  />

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Date From
                      </label>
                      <Input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Date To
                      </label>
                      <Input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
                        {entry?.project?.name || "-"}
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
