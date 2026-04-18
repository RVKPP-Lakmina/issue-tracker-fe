import { IssuePriority } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

const priorityColors: Record<IssuePriority, string> = {
  'low': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  'medium': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'high': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  'critical': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const priorityLabels: Record<IssuePriority, string> = {
  'low': 'Low',
  'medium': 'Medium',
  'high': 'High',
  'critical': 'Critical',
};

interface PriorityBadgeProps {
  priority: IssuePriority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <Badge variant="outline" className={`${priorityColors[priority]} border-0`}>
      {priorityLabels[priority]}
    </Badge>
  );
}
