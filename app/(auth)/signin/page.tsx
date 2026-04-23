"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignInForm } from "@/components/auth/SignInForm";
import { useAuthStore } from "@/lib/store/authStore";

export default function SignInPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/issues");
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <span className="text-white text-sm font-bold">IT</span>
            </div>
            <h2 className="text-lg font-bold text-foreground">Issue Tracker</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            Manage your issues efficiently
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}
