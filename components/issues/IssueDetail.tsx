"use client";

import { Issue } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useIssueStore } from "@/lib/store/issueStore";
import { Clock3, Edit, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface IssueDetailProps {
  issue: Issue;
}

export function IssueDetail({ issue }: IssueDetailProps) {
  const {
    openEditModal,
    closeDetailModal,
    openDeleteConfirm,
    openTimeLogModal,
  } = useIssueStore();

  const handleEdit = () => {
    closeDetailModal();
    openEditModal(issue);
  };

  const handleDelete = () => {
    closeDetailModal();
    openDeleteConfirm(issue);
  };

  const createdByInitials = issue.createdBy.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const assignedToInitials = issue.assignedTo?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">{issue.title}</h2>
        <p className="text-sm text-muted-foreground mt-1">ID: {issue.id}</p>
      </div>

      {/* Status and Priority */}
      <div className="flex flex-wrap gap-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">
            STATUS
          </p>
          <StatusBadge status={issue.status} />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">
            PRIORITY
          </p>
          <PriorityBadge priority={issue.priority} />
        </div>
      </div>

      {/* Description */}
      {issue.description && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">
            Description
          </h3>
          <p className="text-sm text-foreground/80 whitespace-pre-wrap">
            {issue.description}
          </p>
        </div>
      )}

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            PROJECT
          </p>
          <p className="text-sm text-foreground">
            {issue.project?.name || "Not linked to a project"}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            PARENT TICKET
          </p>
          <p className="text-sm text-foreground">
            {issue.parentIssue
              ? `${issue.parentIssue.title} (${issue.parentIssue.status})`
              : "No parent ticket"}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            CREATED BY
          </p>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={issue.createdBy.avatar} />
              <AvatarFallback className="text-xs">
                {createdByInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-foreground">
                {issue.createdBy.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {issue.createdBy.email}
              </p>
            </div>
          </div>
        </div>

        {issue.assignedTo && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              ASSIGNED TO
            </p>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={issue.assignedTo.avatar} />
                <AvatarFallback className="text-xs">
                  {assignedToInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {issue.assignedTo.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {issue.assignedTo.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Timestamps */}
      <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground border-t border-border pt-4">
        <div>
          <p className="font-medium mb-1">Created</p>
          <p>
            {new Date(issue.createdAt).toLocaleDateString()} (
            {formatDistanceToNow(new Date(issue.createdAt), {
              addSuffix: true,
            })}
            )
          </p>
        </div>
        <div>
          <p className="font-medium mb-1">Last Updated</p>
          <p>
            {new Date(issue.updatedAt).toLocaleDateString()} (
            {formatDistanceToNow(new Date(issue.updatedAt), {
              addSuffix: true,
            })}
            )
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button variant="secondary" onClick={() => openTimeLogModal(issue)}>
          <Clock3 className="h-4 w-4 mr-2" />
          Log Time
        </Button>
        <Button
          variant="outline"
          onClick={handleDelete}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
        <Button onClick={handleEdit} className="bg-primary hover:bg-primary/90">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>
    </div>
  );
}
