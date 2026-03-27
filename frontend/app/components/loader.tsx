import { Loader2 } from "lucide-react";

export const Loader = () => {
  return (
    <div className="flex min-h-[240px] items-center justify-center">
      <div className="surface-panel flex items-center gap-4 px-6 py-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <div>
          <p className="font-semibold">Loading workspace</p>
          <p className="text-sm text-muted-foreground">
            Pulling the latest projects and tasks.
          </p>
        </div>
      </div>
    </div>
  );
};
