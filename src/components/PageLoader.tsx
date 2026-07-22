import { Sparkles } from "lucide-react";

export function PageLoader() {
  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="size-12 bg-primary rounded-xl flex items-center justify-center animate-pulse">
          <Sparkles className="size-6 text-white" />
        </div>
        <div className="flex gap-1">
          <span className="size-2 bg-primary rounded-full animate-bounce" />
          <span className="size-2 bg-primary rounded-full animate-bounce delay-100" />
          <span className="size-2 bg-primary rounded-full animate-bounce delay-200" />
        </div>
      </div>
    </div>
  );
}
