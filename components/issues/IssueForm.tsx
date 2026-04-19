"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IssueFormData, Issue } from "@/lib/types";
import {
  useCreateIssue,
  useUpdateIssue,
  useUsers,
  useProjects,
  useIssues,
} from "@/lib/hooks/useApi";
import { useIssueStore } from "@/lib/store/issueStore";
import { useAuthStore } from "@/lib/store/authStore";

const issueFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  status: z.enum(["open", "in-progress", "closed", "on-hold"]),
  priority: z.enum(["low", "medium", "high", "critical"]),
  projectId: z.string().optional(),
  parentIssueId: z.string().optional(),
  assignedToId: z.string().optional(),
});

type IssueFormDataSchema = z.infer<typeof issueFormSchema>;

interface IssueFormProps {
  issue?: Issue;
  onSuccess?: () => void;
}

export function IssueForm({ issue, onSuccess }: IssueFormProps) {
  const { closeCreateModal, closeEditModal } = useIssueStore();
  const { user: currentUser } = useAuthStore();
  const { data: users = [], isLoading: isUsersLoading } = useUsers();
  const { data: projectsResponse, isLoading: isProjectsLoading } =
    useProjects();
  const { mutate: createIssue, isPending: isCreating } = useCreateIssue();
  const { mutate: updateIssue, isPending: isUpdating } = useUpdateIssue();
  const projects = projectsResponse?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IssueFormDataSchema>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      title: issue?.title || "",
      description: issue?.description || "",
      status: issue?.status || "open",
      priority: issue?.priority || "medium",
      projectId: issue?.projectId || issue?.project?.id || "",
      parentIssueId: issue?.parentIssueId || issue?.parentIssue?.id || "",
      assignedToId: issue?.assignedTo?.id || "",
    },
  });

  useEffect(() => {
    reset({
      title: issue?.title || "",
      description: issue?.description || "",
      status: issue?.status || "open",
      priority: issue?.priority || "medium",
      projectId: issue?.projectId || issue?.project?.id || "",
      parentIssueId: issue?.parentIssueId || issue?.parentIssue?.id || "",
      assignedToId: issue?.assignedTo?.id || "",
    });
  }, [issue, reset]);

  const selectedProjectId = watch("projectId") || "";
  const selectedParentIssueId = watch("parentIssueId") || "";

  const { data: parentIssuesResponse, isLoading: isParentIssuesLoading } =
    useIssues({
      projectId: selectedProjectId || undefined,
      pageSize: 200,
    });

  const parentIssues = (parentIssuesResponse?.data || []).filter(
    (candidate) => candidate.id !== issue?.id,
  );

  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId,
  );
  const selectedParentIssue = parentIssues.find(
    (parentIssue) => parentIssue.id === selectedParentIssueId,
  );

  const blockedByProject = !issue && selectedProject?.status === "closed";
  const blockedByParent = !issue && selectedParentIssue?.status === "closed";
  const blockedCreationReason = blockedByProject
    ? "This project is closed. You cannot create new tickets under a closed project."
    : blockedByParent
      ? "This parent ticket is closed. You cannot create sub-tickets under a closed ticket."
      : null;

  const onSubmit = (data: IssueFormDataSchema) => {
    if (blockedCreationReason) {
      return;
    }

    const normalizedData: IssueFormData = {
      ...data,
      description: data.description ?? "",
      projectId: data.projectId?.trim() ? data.projectId : undefined,
      parentIssueId: data.parentIssueId?.trim()
        ? data.parentIssueId
        : undefined,
      assignedToId: data.assignedToId?.trim() ? data.assignedToId : undefined,
    };

    if (issue) {
      updateIssue(
        { id: issue.id, data: normalizedData },
        {
          onSuccess: () => {
            closeEditModal();
            onSuccess?.();
          },
        },
      );
    } else {
      createIssue(normalizedData, {
        onSuccess: () => {
          closeCreateModal();
          reset();
          onSuccess?.();
        },
      });
    }
  };

  const isPending = isCreating || isUpdating;
  const selectedStatus = watch("status");
  const selectedPriority = watch("priority");
  const selectedProjectValue = watch("projectId") || "__NO_PROJECT__";
  const selectedParentIssueValue = watch("parentIssueId") || "__NO_PARENT__";
  const selectedAssignedToId = watch("assignedToId") || "__UNASSIGNED__";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Title *</label>
        <Input
          {...register("title")}
          placeholder="Issue title"
          className="bg-secondary/50"
          disabled={isPending}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Description
        </label>
        <Textarea
          {...register("description")}
          placeholder="Issue description..."
          rows={4}
          className="bg-secondary/50"
          disabled={isPending}
        />
        {errors.description && (
          <p className="text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Status</label>
          <Select
            value={selectedStatus}
            onValueChange={(value) =>
              setValue("status", value as IssueFormDataSchema["status"], {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            disabled={isPending}
          >
            <SelectTrigger className="bg-secondary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Priority
          </label>
          <Select
            value={selectedPriority}
            onValueChange={(value) =>
              setValue("priority", value as IssueFormDataSchema["priority"], {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            disabled={isPending}
          >
            <SelectTrigger className="bg-secondary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Project</label>
          <Select
            value={selectedProjectValue}
            onValueChange={(value) => {
              const nextProjectId = value === "__NO_PROJECT__" ? "" : value;
              setValue("projectId", nextProjectId, {
                shouldDirty: true,
                shouldValidate: true,
              });

              // Reset parent issue when project changes.
              setValue("parentIssueId", "", {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
            disabled={isPending || isProjectsLoading}
          >
            <SelectTrigger className="bg-secondary/50">
              <SelectValue
                placeholder={
                  isProjectsLoading ? "Loading projects..." : "Select project"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__NO_PROJECT__">No project</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                  {project.status === "closed" ? " (Closed)" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Parent Ticket
          </label>
          <Select
            value={selectedParentIssueValue}
            onValueChange={(value) =>
              setValue(
                "parentIssueId",
                value === "__NO_PARENT__" ? "" : value,
                {
                  shouldDirty: true,
                  shouldValidate: true,
                },
              )
            }
            disabled={isPending || isParentIssuesLoading || !selectedProjectId}
          >
            <SelectTrigger className="bg-secondary/50">
              <SelectValue
                placeholder={
                  !selectedProjectId
                    ? "Select a project first"
                    : isParentIssuesLoading
                      ? "Loading tickets..."
                      : "Select parent ticket"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__NO_PARENT__">No parent ticket</SelectItem>
              {parentIssues.map((parentIssue) => (
                <SelectItem key={parentIssue.id} value={parentIssue.id}>
                  {parentIssue.title}
                  {parentIssue.status === "closed" ? " (Closed)" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {blockedCreationReason && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {blockedCreationReason}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Assigned To
        </label>
        <Select
          value={selectedAssignedToId}
          onValueChange={(value) =>
            setValue("assignedToId", value === "__UNASSIGNED__" ? "" : value, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          disabled={isPending || isUsersLoading}
        >
          <SelectTrigger className="bg-secondary/50">
            <SelectValue
              placeholder={
                isUsersLoading ? "Loading users..." : "Select assignee"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__UNASSIGNED__">Unassigned</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
                {currentUser?.id === user.id ? " (ME)" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (issue) {
              closeEditModal();
            } else {
              closeCreateModal();
            }
          }}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90"
          disabled={isPending || !!blockedCreationReason}
        >
          {isPending
            ? issue
              ? "Updating..."
              : "Creating..."
            : issue
              ? "Update Issue"
              : "Create Issue"}
        </Button>
      </div>
    </form>
  );
}
