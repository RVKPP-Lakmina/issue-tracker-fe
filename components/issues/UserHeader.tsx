"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { useLogout } from "@/lib/hooks/useApi";
import { CircleHelp, Globe, LogOut, Settings, UserRound } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clearAuthToken } from "@/lib/auth/token";
import { useEffect, useState } from "react";

export function UserHeader() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { mutate: signOut } = useLogout();
  const [isClient, setIsClient] = useState(false);
  const [language, setLanguage] = useState("English");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = () => {
    signOut(undefined, {
      onSuccess: () => {
        logout();
        clearAuthToken();
        router.push("/signin");
      },
    });
  };

  if (!isClient) {
    return null;
  }

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";
  const firstName = user?.name?.split(" ")[0] || "User";

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-20 border-b border-border bg-card">
      <div className="h-full w-full px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <span className="text-white text-sm font-bold">IT</span>
            </div>
            <h1 className="text-lg font-bold text-foreground hidden sm:block">
              Issue Tracker
            </h1>
          </div>
        </div>

        {user ? (
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex cursor-pointer items-center gap-2 rounded-full outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <span className="relative inline-flex">
                    <Avatar className="h-9 w-9">
                      <AvatarImage alt={firstName} src={user.avatar} />
                      <AvatarFallback>{firstName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="absolute -right-1 -bottom-1 size-3 rounded-full border-2 border-background bg-yellow-500" />
                  </span>
                  <h2 className="text-sm font-medium">{firstName}</h2>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="text-primary">
                  {firstName}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/issues/settings")}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/issues/help")}>
                  <CircleHelp className="h-4 w-4" />
                  Help
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <UserRound className="h-4 w-4" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
                >
                  <Globe className="h-4 w-4" />
                  {language}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => setLanguage("English")}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("Spanish")}>
                  Spanish
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("French")}>
                  French
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold text-foreground">User</span>
          </div>
        )}
      </div>
    </header>
  );
}
