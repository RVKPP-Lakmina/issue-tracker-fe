"use client";

import React, { useMemo, useState } from "react";
import { Issue } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/issues/StatusBadge";
import { PriorityBadge } from "@/components/issues/PriorityBadge";

interface GanttChartProps {
  issues: Issue[];
  onCreateClick: () => void;
  onIssueClick: (issue: Issue) => void;
}

export function GanttChart({
  issues,
  onCreateClick,
  onIssueClick,
}: GanttChartProps) {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7); // 7 days ago
    return date;
  });

  const endDate = useMemo(() => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + 60); // 60 days view
    return date;
  }, [startDate]);

  // Generate day headers
  const dayHeaders = useMemo(() => {
    const headers = [];
    const current = new Date(startDate);
    while (current.getTime() <= endDate.getTime()) {
      headers.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return headers;
  }, [startDate, endDate]);

  // Calculate position and width for each issue
  const ganttItems = useMemo(() => {
    return issues
      .map((issue) => {
        const issueStart = new Date(issue.createdAt);
        issueStart.setHours(0, 0, 0, 0);

        // Use updatedAt as end date, or createdAt + 7 days
        const issueEnd = new Date(issue.updatedAt || issue.createdAt);
        issueEnd.setHours(23, 59, 59, 999);
        // Minimum 7 days duration for visibility
        if (
          issueEnd.getTime() - issueStart.getTime() <
          7 * 24 * 60 * 60 * 1000
        ) {
          issueEnd.setDate(issueEnd.getDate() + 7);
        }

        // Calculate position relative to chart start
        const startOffset = Math.max(
          0,
          (issueStart.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000),
        );
        const totalDuration =
          (issueEnd.getTime() - issueStart.getTime()) / (24 * 60 * 60 * 1000) +
          1;
        const viewDuration =
          (endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000) + 1;

        const percentStart = (startOffset / viewDuration) * 100;
        const percentWidth = (totalDuration / viewDuration) * 100;

        return {
          issue,
          percentStart,
          percentWidth,
          startOffset,
          duration: totalDuration,
        };
      })
      .filter(
        (item) =>
          item.percentStart < 100 || item.percentStart + item.percentWidth > 0,
      );
  }, [issues, startDate, endDate]);

  const dayWidth = useMemo(() => {
    const totalDays = dayHeaders.length;
    return 100 / totalDays;
  }, [dayHeaders.length]);

  const handlePrevWeek = () => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() - 7);
    setStartDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + 7);
    setStartDate(newDate);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: "bg-blue-500",
      "in-progress": "bg-yellow-500",
      closed: "bg-green-500",
      "on-hold": "bg-gray-500",
    };
    return colors[status] || "bg-slate-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gantt Chart</h1>
          <p className="text-sm text-muted-foreground">
            Timeline view of all issues and tasks
          </p>
        </div>
        <Button onClick={onCreateClick} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Issue
        </Button>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between bg-secondary/50 rounded-lg p-4">
        <Button variant="outline" size="sm" onClick={handlePrevWeek}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium">
          {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
        </div>
        <Button variant="outline" size="sm" onClick={handleNextWeek}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Gantt Chart Container */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          {/* Day Headers */}
          <div className="flex sticky top-0 z-10 bg-card border-b border-border">
            <div className="w-64 shrink-0 border-r border-border bg-secondary/30 p-3">
              <div className="text-xs font-semibold text-muted-foreground">
                TITLE
              </div>
            </div>
            <div className="flex flex-1 divide-x divide-border">
              {dayHeaders.map((date, idx) => (
                <div
                  key={idx}
                  className="flex-1 p-2 text-center text-xs font-medium"
                  style={{ minWidth: `${dayWidth}%` }}
                >
                  <div className="text-foreground">
                    {date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-muted-foreground text-[10px]">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gantt Rows */}
          <div className="divide-y divide-border">
            {ganttItems.length === 0 ? (
              <div className="flex items-center justify-center p-12">
                <div className="text-center">
                  <p className="text-muted-foreground">No issues to display</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onCreateClick}
                    className="mt-4"
                  >
                    Create your first issue
                  </Button>
                </div>
              </div>
            ) : (
              ganttItems.map(({ issue, percentStart, percentWidth }) => (
                <div
                  key={issue.id}
                  className="flex hover:bg-accent/50 transition-colors"
                >
                  {/* Issue Info */}
                  <div className="w-64 shrink-0 border-r border-border p-3 overflow-hidden">
                    <div
                      className="cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => onIssueClick(issue)}
                    >
                      <h3 className="font-medium text-sm truncate text-foreground">
                        {issue.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusBadge status={issue.status} />
                        <PriorityBadge priority={issue.priority} />
                      </div>
                    </div>
                  </div>

                  {/* Timeline Bar */}
                  <div className="relative flex-1 p-2">
                    <div className="absolute inset-y-0 left-0 right-0 pointer-events-none">
                      <div
                        className={`h-full flex items-center`}
                        style={{ marginLeft: `${percentStart}%` }}
                      >
                        <div
                          className={`h-8 rounded ${getStatusColor(
                            issue.status,
                          )} opacity-80 hover:opacity-100 transition-opacity cursor-pointer shadow-md flex items-center px-2`}
                          style={{
                            width: `${percentWidth}%`,
                            minWidth: "60px",
                          }}
                          onClick={() => onIssueClick(issue)}
                          title={`${issue.title} - ${new Date(
                            issue.createdAt,
                          ).toLocaleDateString()} to ${new Date(
                            issue.updatedAt || issue.createdAt,
                          ).toLocaleDateString()}`}
                        >
                          <span className="text-xs font-medium text-white truncate">
                            {issue.title.substring(0, 20)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="h-12" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { status: "open", label: "Open" },
          { status: "in-progress", label: "In Progress" },
          { status: "closed", label: "Closed" },
          { status: "on-hold", label: "On Hold" },
        ].map(({ status, label }) => (
          <div key={status} className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded ${getStatusColor(status)}`} />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
