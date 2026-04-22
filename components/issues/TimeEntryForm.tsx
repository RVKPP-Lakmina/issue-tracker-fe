"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTimeEntry } from "@/lib/hooks/useApi";
import { TimeEntryFormData } from "@/lib/types";
import { useIssueStore } from "@/lib/store/issueStore";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/error";

const timeEntrySchema = z.object({
  issueId: z.string().min(1, "Issue is required"),
  date: z.string().min(1, "Date is required"),
  hours: z.coerce
    .number()
    .min(0.25, "Hours must be at least 0.25")
    .max(24, "Hours cannot exceed 24"),
  activity: z.enum([
    "requirements-definition",
    "basic-design",
    "implementation",
    "review",
    "api-test",
    "system-test",
    "acceptance-test",
    "release",
    "investigation",
    "meeting",
    "project-management",
    "other",
  ]),
  comment: z
    .string()
    .trim()
    .min(3, "Comment must be at least 3 characters")
    .max(1000, "Comment is too long"),
});

type TimeEntryFormSchema = z.infer<typeof timeEntrySchema>;

interface TimeEntryFormProps {
  issueId: string;
  onSuccess?: () => void;
}

const activityOptions: Array<{
  value: TimeEntryFormData["activity"];
  label: string;
}> = [
  { value: "requirements-definition", label: "Requirements definition" },
  { value: "basic-design", label: "Basic design" },
  { value: "implementation", label: "Implementation" },
  { value: "review", label: "Review" },
  { value: "api-test", label: "API connection integration (API) test" },
  { value: "system-test", label: "System test" },
  { value: "acceptance-test", label: "Acceptance test" },
  { value: "release", label: "Release" },
  { value: "investigation", label: "Investigation" },
  { value: "meeting", label: "Meeting" },
  { value: "project-management", label: "Project management" },
  { value: "other", label: "Other" },
];

export function TimeEntryForm({ issueId, onSuccess }: TimeEntryFormProps) {
  const { closeTimeLogModal } = useIssueStore();
  const { mutate: createTimeEntry, isPending } = useCreateTimeEntry();

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<TimeEntryFormSchema>({
    resolver: zodResolver(timeEntrySchema),
    defaultValues: {
      issueId,
      date: new Date().toISOString().split("T")[0],
      hours: 1,
      activity: "implementation",
      comment: "",
    },
  });

  const selectedActivity = watch("activity");

  const onSubmit = (data: TimeEntryFormSchema) => {
    createTimeEntry(data, {
      onSuccess: () => {
        toast.success("Time entry logged successfully.");
        closeTimeLogModal();
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, "Failed to log time entry."));
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register("issueId")} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Date *</label>
          <Input type="date" {...register("date")} disabled={isPending} />
          {errors.date && (
            <p className="text-xs text-destructive">{errors.date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Hours *</label>
          <Input
            type="number"
            min="0.25"
            step="0.25"
            placeholder="e.g. 2"
            {...register("hours")}
            disabled={isPending}
          />
          {errors.hours && (
            <p className="text-xs text-destructive">{errors.hours.message}</p>
          )}
        </div>
      </div>

      <SelectField
        label="Activity *"
        value={selectedActivity}
        onValueChange={(value) =>
          setValue("activity", value as TimeEntryFormSchema["activity"], {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
        options={activityOptions}
        placeholder="Select activity"
        disabled={isPending}
      />
      {errors.activity && (
        <p className="text-xs text-destructive">{errors.activity.message}</p>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Comment *</label>
        <Textarea
          rows={3}
          placeholder="What did you work on?"
          {...register("comment")}
          disabled={isPending}
        />
        {errors.comment && (
          <p className="text-xs text-destructive">{errors.comment.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={closeTimeLogModal}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Log time"}
        </Button>
      </div>
    </form>
  );
}
