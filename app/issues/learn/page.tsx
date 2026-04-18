"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink } from "lucide-react";

const resources = [
  {
    id: 1,
    title: "Getting Started Guide",
    description:
      "Learn the basics of Issue Tracker and set up your first project",
    category: "Beginner",
  },
  {
    id: 2,
    title: "Advanced Features",
    description:
      "Master advanced features like custom workflows and automation",
    category: "Advanced",
  },
  {
    id: 3,
    title: "API Documentation",
    description: "Integrate Issue Tracker with your tools using our REST API",
    category: "Developer",
  },
  {
    id: 4,
    title: "Best Practices",
    description:
      "Follow industry best practices for issue tracking and project management",
    category: "Best Practices",
  },
];

export default function LearnPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="h-8 w-8" />
          Learning Center
        </h1>
        <p className="text-muted-foreground mt-2">
          Resources and tutorials to help you get the most out of Issue Tracker
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((resource) => (
          <Card
            key={resource.id}
            className="hover:border-primary/50 transition-colors"
          >
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {resource.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary">
                  {resource.category}
                </span>
                <Button variant="ghost" size="sm" className="gap-2">
                  Learn More
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>Can't find what you're looking for?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button variant="outline">Browse Documentation</Button>
            <Button>Contact Support</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
