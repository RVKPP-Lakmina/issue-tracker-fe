"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/lib/store/authStore";
import { useSignUp } from "@/lib/hooks/useApi";
import Link from "next/link";
import { Eye, EyeOff, Check, X } from "lucide-react";

const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const router = useRouter();
  const { setUser, setAccessToken } = useAuthStore();
  const { mutate: signUp, isPending } = useSignUp();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const password = watch("password");
  const hasMinLength = password?.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password || "");
  const hasNumber = /[0-9]/.test(password || "");

  const onSubmit = (data: SignUpFormData) => {
    setError(null);
    signUp(
      {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: (response) => {
          setAccessToken(response.token);
          setUser(response.user);
          router.push("/issues");
        },
        onError: (error: any) => {
          setError(
            error.response?.data?.message ||
              "Failed to sign up. Please try again.",
          );
        },
      },
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto p-8 border-0 shadow-lg">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground mt-2">
            Join Issue Tracker and start managing issues
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Full Name
            </label>
            <Input
              {...register("name")}
              type="text"
              placeholder="John Doe"
              className="bg-secondary/50"
              disabled={isPending}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className="bg-secondary/50"
              disabled={isPending}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Password
            </label>
            <div className="relative">
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="bg-secondary/50 pr-10"
                disabled={isPending}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-2">
                <div className="text-xs font-medium text-foreground">
                  Password strength:
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {hasMinLength ? (
                      <Check size={14} className="text-green-600" />
                    ) : (
                      <X size={14} className="text-muted-foreground" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      At least 6 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasUpperCase ? (
                      <Check size={14} className="text-green-600" />
                    ) : (
                      <X size={14} className="text-muted-foreground" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      One uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasNumber ? (
                      <Check size={14} className="text-green-600" />
                    ) : (
                      <X size={14} className="text-muted-foreground" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      One number
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="bg-secondary/50 pr-10"
                disabled={isPending}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isPending}
            size="lg"
          >
            {isPending ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </Card>
  );
}
