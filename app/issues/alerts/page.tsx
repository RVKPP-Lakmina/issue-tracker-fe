"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Clock } from "lucide-react";

const alerts = [
  {
    id: 1,
    title: "High priority issue assigned",
    type: "assignment",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    title: "Project deadline approaching",
    type: "deadline",
    time: "5 hours ago",
    read: false,
  },
  {
    id: 3,
    title: "New comment on issue #234",
    type: "comment",
    time: "1 day ago",
    read: true,
  },
  {
    id: 4,
    title: "Team member joined project",
    type: "team",
    time: "2 days ago",
    read: true,
  },
];

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Bell className="h-8 w-8" />
          Alerts & Notifications
        </h1>
        <p className="text-muted-foreground mt-2">
          Stay updated with important notifications
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>Your notification center</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-4 p-3 rounded-lg border ${
                  alert.read
                    ? "border-border bg-background"
                    : "border-primary/30 bg-primary/5"
                }`}
              >
                <div
                  className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${alert.read ? "bg-muted" : "bg-primary"}`}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium ${alert.read ? "text-muted-foreground" : "text-foreground"}`}
                  >
                    {alert.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {alert.time}
                    </span>
                  </div>
                </div>
                <Badge
                  variant={alert.read ? "secondary" : "default"}
                  className="flex-shrink-0"
                >
                  {alert.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
