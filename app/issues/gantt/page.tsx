"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { useIssueStore } from "@/lib/store/issueStore";
import { useIssues } from "@/lib/hooks/useApi";
import { GanttChart } from "@/components/gantt/GanttChart";
import { IssueModals } from "@/components/issues/IssueModals";
import { Spinner } from "@/components/ui/spinner";

export default function GanttPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuthStore();
  const { openCreateModal, openEditModal } = useIssueStore();
  const { data: issuesData, isLoading } = useIssues();

  useEffect(() => {
    if (!isAuthLoading && (!isAuthenticated || !user)) {
      router.push("/signin");
    }
  }, [isAuthenticated, isAuthLoading, user, router]);

  if (isAuthLoading || !isAuthenticated || !user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  const issues = issuesData?.data || [];

  return (
    <>
      <GanttChart
        issues={issues}
        onCreateClick={openCreateModal}
        onIssueClick={(issue) => {
          openEditModal(issue);
        }}
      />
      <IssueModals />
    </>
  );
}
