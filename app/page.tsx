"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { getAuthToken } from "@/lib/auth/token";

export default function Home() {
  const router = useRouter();
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
    // if (typeof window !== "undefined") {
    //   const token = getAuthToken();
    //   if (token) {
    //     router.replace("/issues");
    //   } else {
    //     router.replace("/signin");
    //   }
    // }
  }, [router, initializeAuth]);

  return null;
}
