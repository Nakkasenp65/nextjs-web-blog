import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="container max-w-3xl mt-12 space-y-12">
      <div className="flex flex-col items-center justify-center space-y-4">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="space-y-2 flex flex-col items-center">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      <div className="text-center space-y-6">
        <Skeleton className="h-12 w-full mx-auto" />
        <Skeleton className="h-4 w-3/4 mx-auto" />
        <div className="flex justify-center gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="aspect-video w-full rounded-2xl" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}
