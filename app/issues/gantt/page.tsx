"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { GanttChart } from "@/components/gantt/GanttChart";
import { IssueModals } from "@/components/issues/IssueModals";

export default function GanttPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuthStore();

  useEffect(() => {
    if (!isAuthLoading && (!isAuthenticated || !user)) {
      router.push("/signin");
    }
  }, [isAuthenticated, isAuthLoading, user, router]);

  if (isAuthLoading || !isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      <GanttChart />
      <IssueModals />
    </>
  );
}
