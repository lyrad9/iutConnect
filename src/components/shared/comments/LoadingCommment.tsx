import { Skeleton } from "@/src/components/ui/skeleton";

export function LoadingComment() {
  return (
    <div className="flex flex-col gap-4">
      {[...Array(3)].map((_, idx) => (
        <div key={idx} className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-3 w-3/4 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
