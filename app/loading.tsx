import { Spinner } from "@/components/ui/spinner";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="relative w-[320px] rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="absolute -top-10 left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-2xl bg-primary shadow-lg">
          <span className="text-xl font-extrabold text-primary-foreground">
            IT
          </span>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-3">
            <Spinner className="size-5 text-primary" />
            <p className="text-base font-semibold text-foreground">
              Loading workspace
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            Preparing your issue dashboard...
          </p>

          <div className="mt-1 flex items-center gap-1.5">
            <span
              className="h-2 w-2 animate-pulse rounded-full bg-primary"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="h-2 w-2 animate-pulse rounded-full bg-primary/80"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="h-2 w-2 animate-pulse rounded-full bg-primary/60"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
