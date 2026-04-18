"use client";

import { Issue } from "@/lib/types";
import { useIssueStore } from "@/lib/store/issueStore";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { Edit, Trash2, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useDeleteIssue } from "@/lib/hooks/useApi";

interface IssueTableProps {
  issues: Issue[];
  isLoading?: boolean;
}

export function IssueTable({ issues, isLoading }: IssueTableProps) {
  const {
    selectedIssueIds,
    toggleIssueSelection,
    openDetailModal,
    openEditModal,
    openDeleteConfirm,
  } = useIssueStore();

  const { mutate: deleteIssue } = useDeleteIssue();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      useIssueStore.setState({
        selectedIssueIds: new Set(issues.map((i) => i.id)),
      });
    } else {
      useIssueStore.setState({ selectedIssueIds: new Set() });
    }
  };

  const handleQuickDelete = (issue: Issue, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this issue?")) {
      deleteIssue(issue.id);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-secondary/30 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">No issues found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Try adjusting your filters or create a new issue
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="w-12 py-3">
              <Checkbox
                checked={
                  selectedIssueIds.size === issues.length && issues.length > 0
                }
                onCheckedChange={(checked) =>
                  handleSelectAll(checked as boolean)
                }
              />
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue) => (
            <TableRow
              key={issue.id + issue.title}
              className="border-b border-border hover:bg-secondary/30 cursor-pointer transition"
              onClick={() => openDetailModal(issue)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedIssueIds.has(issue.id)}
                  onCheckedChange={() => toggleIssueSelection(issue.id)}
                />
              </TableCell>
              <TableCell className="font-medium text-foreground">
                {issue.title}
              </TableCell>
              <TableCell>
                <StatusBadge status={issue.status} />
              </TableCell>
              <TableCell>
                <PriorityBadge priority={issue.priority} />
              </TableCell>
              <TableCell>
                {issue.assignedTo ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={issue.assignedTo.avatar} />
                      <AvatarFallback className="text-xs">
                        {issue.assignedTo.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-foreground">
                      {issue.assignedTo.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">
                    Unassigned
                  </span>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(issue.createdAt), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell className="text-right">
                <div
                  className="flex justify-end gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDetailModal(issue)}
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(issue)}
                    title="Edit issue"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleQuickDelete(issue, e)}
                    title="Delete issue"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
