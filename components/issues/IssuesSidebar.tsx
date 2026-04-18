"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useSidebarStore } from "@/hooks/app-sidebar-hooks";
import { SidebarContent } from "./app-sidebar-content";

/**
 * Responsive sidebar with mobile drawer and desktop collapsible panel.
 *
 * Uses a Zustand store (`useSidebarStore`) for collapse state persistence
 * and renders `SidebarContent` for navigation items.
 */
export function IssuesSidebar(): React.ReactNode {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapse } = useSidebarStore();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  React.useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <TooltipProvider delayDuration={0}>
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-background text-foreground shadow-md border border-border lg:hidden hover:bg-accent transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed left-0 top-0 z-40 h-full w-72 bg-card shadow-xl transform transition-transform duration-300 lg:hidden border-r border-border ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent
          isMobile={true}
          isCollapsed={isCollapsed}
          pathname={pathname}
        />
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:block fixed left-0 top-[80px] z-30 h-[calc(100vh-80px)] border-r border-border bg-card transition-all duration-300 ${
          isCollapsed ? "w-[104px]" : "w-64"
        }`}
      >
        <button
          type="button"
          onClick={toggleCollapse}
          className="absolute top-6 -right-3 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-all hover:bg-accent hover:shadow-lg"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        <SidebarContent
          isMobile={false}
          isCollapsed={isCollapsed}
          pathname={pathname}
        />
      </div>
    </TooltipProvider>
  );
}
