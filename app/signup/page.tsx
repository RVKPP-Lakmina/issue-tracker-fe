"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { useAuthStore } from "@/lib/store/authStore";

export default function SignUpPage() {
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
          <h2 className="text-sm font-semibold text-primary mb-2">
            ISSUE TRACKER
          </h2>
          <p className="text-muted-foreground text-sm">
            Create an account to get started
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
