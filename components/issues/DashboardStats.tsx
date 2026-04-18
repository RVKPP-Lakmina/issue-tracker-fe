'use client';

import { Issue } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { AlertCircle, Clock, CheckCircle, Pause } from 'lucide-react';

interface DashboardStatsProps {
  issues: Issue[];
  isLoading?: boolean;
}

export function DashboardStats({ issues, isLoading }: DashboardStatsProps) {
  const stats = [
    {
      label: 'Total Issues',
      value: issues.length,
      icon: AlertCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      label: 'Open',
      value: issues.filter(i => i.status === 'open').length,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900',
    },
    {
      label: 'In Progress',
      value: issues.filter(i => i.status === 'in-progress').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900',
    },
    {
      label: 'Closed',
      value: issues.filter(i => i.status === 'closed').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="p-6 border-0 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {isLoading ? '-' : stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
