import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export default function LoadingOwnedGroups() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start text-muted-foreground h-auto py-2"
      asChild
    >
      <div className="flex items-start gap-2">
        {/* Avatar Skeleton */}
        <Skeleton className="h-6 w-6 flex-shrink-0 rounded-full" />

        {/* Texte Skeleton */}
        <div className="flex flex-col items-start">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="mt-1 h-3 w-16 rounded" />
        </div>
      </div>
    </Button>
  );
}

export function LoadingEvents() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start text-muted-foreground h-auto py-2"
      asChild
    >
      <div className="flex items-start gap-2">
        {/* Event Photo Skeleton */}
        <Skeleton className="h-6 w-6 flex-shrink-0 rounded-full" />

        {/* Event Details Skeleton */}
        <div className="flex flex-col items-start">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="mt-1 h-3 w-20 rounded" />
        </div>
      </div>
    </Button>
  );
}
