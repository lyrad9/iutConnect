import { Skeleton } from "@/src/components/ui/skeleton";
import { Avatar } from "@/src/components/ui/avatar";
import { cn } from "@/src/lib/utils";

interface AvatarGroupSkeletonProps {
  count?: number;
  avatarSize?: string;
  className?: string;
}

export function AvatarGroupSkeleton({
  count = 3,
  avatarSize = "h-8 w-8",
  className,
}: AvatarGroupSkeletonProps) {
  const skeletons = Array.from({ length: count }).map((_, i) => (
    <Skeleton
      key={i}
      className={cn(avatarSize, "rounded-full ring-1 ring-background")}
    />
  ));

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex -space-x-1.5">{skeletons}</div>
    </div>
  );
}
