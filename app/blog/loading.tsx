import { BlogCardSkeleton } from "@/components/Skeleton";
import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="py-12">
      <div className="container px-4 sm:px-8 mb-4 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10 text-primary">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
          <div className="h-4 w-64 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>

      <div className="container px-4 sm:px-8 mb-12">
        <BlogCardSkeleton />
      </div>

      <div className="container px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
