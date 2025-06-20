import { Skeleton } from "@/src/components/ui/skeleton";

export function LoadingNotifications() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-4 rounded-lg bg-background">
          <div className="flex items-start gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-46" />
                <Skeleton className="ml-auto mr-12 size-6 rounded-full" />
              </div>
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
