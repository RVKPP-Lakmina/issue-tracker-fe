import { IssueStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

const statusColors: Record<IssueStatus, string> = {
  'open': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'closed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'on-hold': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

const statusLabels: Record<IssueStatus, string> = {
  'open': 'Open',
  'in-progress': 'In Progress',
  'closed': 'Closed',
  'on-hold': 'On Hold',
};

interface StatusBadgeProps {
  status: IssueStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={`${statusColors[status]} border-0`}>
      {statusLabels[status]}
    </Badge>
  );
}
