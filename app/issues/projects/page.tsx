"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KanbanSquare, Plus } from "lucide-react";
import { useCreateProject, useProjects } from "@/lib/hooks/useApi";
import { ProjectFormData, ProjectStatus } from "@/lib/types";

const statusOptions: ProjectStatus[] = [
  "planning",
  "active",
  "on-hold",
  "closed",
];

const statusBadgeVariant: Record<
  ProjectStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  planning: "secondary",
  active: "default",
  "on-hold": "outline",
  closed: "destructive",
};

export default function ProjectsPage() {
  const { data: projectsResponse, isLoading } = useProjects();
  const { mutate: createProject, isPending } = useCreateProject();

  const [form, setForm] = useState<ProjectFormData>({
    name: "",
    code: "",
    description: "",
    status: "active",
  });

  const projects = projectsResponse?.data || [];

  const handleCreateProject = () => {
    if (!form.name?.trim()) {
      return;
    }

    createProject(
      {
        name: form.name.trim(),
        code: form.code?.trim() || undefined,
        description: form.description?.trim() || undefined,
        status: form.status || "active",
      },
      {
        onSuccess: () => {
          setForm({
            name: "",
            code: "",
            description: "",
            status: "active",
          });
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <KanbanSquare className="h-8 w-8" />
          Projects
        </h1>
        <p className="text-muted-foreground mt-2">
          Initialize projects first. Tickets and sub-tickets can be added under
          active projects.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Project</CardTitle>
          <CardDescription>
            Closed projects will block creation of new tickets under them.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Project name"
              value={form.name || ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              disabled={isPending}
            />
            <Input
              placeholder="Project code (optional)"
              value={form.code || ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, code: e.target.value }))
              }
              disabled={isPending}
            />
          </div>

          <Textarea
            rows={3}
            placeholder="Description (optional)"
            value={form.description || ""}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            disabled={isPending}
          />

          <div className="max-w-sm">
            <Select
              value={form.status || "active"}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, status: value as ProjectStatus }))
              }
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end">
            <Button
              className="gap-2"
              onClick={handleCreateProject}
              disabled={isPending || !form.name?.trim()}
            >
              <Plus className="h-4 w-4" />
              {isPending ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">
              Loading projects...
            </CardContent>
          </Card>
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">
              No projects yet. Create your first project.
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <Card
              key={project.id}
              className="hover:border-primary/50 transition-colors"
            >
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge variant={statusBadgeVariant[project.status]}>
                    {project.status}
                  </Badge>
                </div>
                {project.code && (
                  <CardDescription className="font-mono text-xs">
                    {project.code}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {project.description || "No description"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Updated: {new Date(project.updatedAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
