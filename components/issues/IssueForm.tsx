'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IssueFormData, Issue } from '@/lib/types';
import { useCreateIssue, useUpdateIssue } from '@/lib/hooks/useApi';
import { useIssueStore } from '@/lib/store/issueStore';

const issueFormSchema = z.object({
  title: z.string().min(1, 'Title is required').min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  status: z.enum(['open', 'in-progress', 'closed', 'on-hold']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  assignedToId: z.string().optional(),
});

type IssueFormDataSchema = z.infer<typeof issueFormSchema>;

interface IssueFormProps {
  issue?: Issue;
  onSuccess?: () => void;
}

export function IssueForm({ issue, onSuccess }: IssueFormProps) {
  const { selectedIssue, closeCreateModal, closeEditModal } = useIssueStore();
  const { mutate: createIssue, isPending: isCreating } = useCreateIssue();
  const { mutate: updateIssue, isPending: isUpdating } = useUpdateIssue();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IssueFormDataSchema>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      title: issue?.title || '',
      description: issue?.description || '',
      status: issue?.status || 'open',
      priority: issue?.priority || 'medium',
      assignedToId: issue?.assignedTo?.id || '',
    },
  });

  useEffect(() => {
    reset({
      title: issue?.title || '',
      description: issue?.description || '',
      status: issue?.status || 'open',
      priority: issue?.priority || 'medium',
      assignedToId: issue?.assignedTo?.id || '',
    });
  }, [issue, reset]);

  const onSubmit = (data: IssueFormDataSchema) => {
    if (issue) {
      updateIssue(
        { id: issue.id, data },
        {
          onSuccess: () => {
            closeEditModal();
            onSuccess?.();
          },
        }
      );
    } else {
      createIssue(data as IssueFormData, {
        onSuccess: () => {
          closeCreateModal();
          reset();
          onSuccess?.();
        },
      });
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Title *</label>
        <Input
          {...register('title')}
          placeholder="Issue title"
          className="bg-secondary/50"
          disabled={isPending}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Description</label>
        <Textarea
          {...register('description')}
          placeholder="Issue description..."
          rows={4}
          className="bg-secondary/50"
          disabled={isPending}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Status</label>
          <Select
            defaultValue={issue?.status || 'open'}
            onValueChange={(value) =>
              register('status').onChange({
                target: { value },
              } as any)
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
          <label className="text-sm font-medium text-foreground">Priority</label>
          <Select
            defaultValue={issue?.priority || 'medium'}
            onValueChange={(value) =>
              register('priority').onChange({
                target: { value },
              } as any)
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

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Assigned To</label>
        <Input
          {...register('assignedToId')}
          placeholder="User ID (optional)"
          className="bg-secondary/50"
          disabled={isPending}
        />
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
          disabled={isPending}
        >
          {isPending
            ? issue
              ? 'Updating...'
              : 'Creating...'
            : issue
              ? 'Update Issue'
              : 'Create Issue'}
        </Button>
      </div>
    </form>
  );
}
