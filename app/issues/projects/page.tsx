"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KanbanSquare, Plus, Archive } from "lucide-react";

const projects = [
  { id: 1, name: "Web Platform", status: "Active", issues: 24, team: 5 },
  { id: 2, name: "Mobile App", status: "Active", issues: 18, team: 4 },
  { id: 3, name: "API Service", status: "Planning", issues: 8, team: 3 },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <KanbanSquare className="h-8 w-8" />
            Projects
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and organize your projects
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="hover:border-primary/50 transition-colors"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <Badge
                  variant={
                    project.status === "Active" ? "default" : "secondary"
                  }
                >
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Issues</p>
                  <p className="text-2xl font-bold">{project.issues}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Team</p>
                  <p className="text-2xl font-bold">{project.team}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
