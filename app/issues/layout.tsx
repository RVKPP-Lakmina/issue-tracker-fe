"use client";

import { ReactNode } from "react";
import { IssuesSidebar } from "@/components/issues/IssuesSidebar";
import { UserHeader } from "@/components/issues/UserHeader";
import { useSidebarStore } from "@/hooks/app-sidebar-hooks";

export default function IssuesLayout({ children }: { children: ReactNode }) {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="h-screen overflow-hidden bg-muted/30 flex flex-col w-full">
      <UserHeader />
      <IssuesSidebar />
      <main
        className={[
          "mt-20 h-[calc(100vh-5rem)] overflow-y-auto transition-all duration-300 ease-in-out",
          "ml-0",
          isCollapsed ? "lg:ml-25" : "lg:ml-64",
        ].join(" ")}
      >
        <div className=" mx-auto px-4 py-6 md:px-6">{children}</div>
      </main>
    </div>
  );
}
