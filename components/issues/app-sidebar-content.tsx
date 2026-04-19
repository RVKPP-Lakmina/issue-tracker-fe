"use client";

import Link from "next/link";
import {
  ListTodo,
  KanbanSquare,
  BarChart3,
  GanttChart,
  Settings,
  CircleHelp,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const mainNavItems = [
  // {
  //   title: "All Issues",
  //   href: "/issues",
  //   icon: ListTodo,
  // },
  // {
  //   title: "Projects",
  //   href: "/issues/projects",
  //   icon: KanbanSquare,
  // },
  // {
  //   title: "Gantt Chart",
  //   href: "/issues/gantt",
  //   icon: GanttChart,
  // },
  {
    title: "Spent Time",
    href: "/issues/reports",
    icon: BarChart3,
  },
];

const footerNavItems = [
  {
    title: "Settings",
    href: "/issues/settings",
    icon: Settings,
  },
  {
    title: "Help",
    href: "/issues/help",
    icon: CircleHelp,
  },
];

interface SidebarContentProps {
  isMobile: boolean;
  isCollapsed: boolean;
  pathname: string;
}

export function SidebarContent({
  isMobile,
  isCollapsed,
  pathname,
}: SidebarContentProps) {
  const NavItem = ({ item }: { item: (typeof mainNavItems)[0] }) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;

    if (isCollapsed && !isMobile) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={item.href}
              className={`flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon className="h-5 w-5" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="ml-2">
            {item.title}
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <Link
        href={item.href}
        prefetch={false}
        className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-colors ${
          isActive
            ? "bg-blue-600 text-white font-semibold"
            : "text-slate-700 hover:bg-slate-100"
        }`}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <span className="text-sm">{item.title}</span>
      </Link>
    );
  };

  return (
    <nav className="flex flex-col h-full px-4 py-6">
      {/* Main Menu Label */}
      {(!isCollapsed || isMobile) && (
        <div className="mb-4 px-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Main Menu
          </h3>
        </div>
      )}

      {/* Main Navigation Items */}
      <div className="flex-1 space-y-1 overflow-y-auto">
        {mainNavItems.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </div>

      {/* Separator */}
      <div className="my-4 border-t border-slate-200" />

      {/* Footer Navigation Items */}
      <div className="space-y-1">
        {footerNavItems.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </div>
    </nav>
  );
}
