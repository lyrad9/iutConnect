import { Skeleton } from "@/src/components/ui/skeleton";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/src/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { AvatarGroupSkeleton } from "@/src/components/shared/avatar-groups-skeletons";

export default function LoadingPendingRequests() {
  return (
    <Card className="overflow-hidden pt-0">
      <div className="flex flex-col md:flex-row">
        {/* Cover photo (mobile) */}
        <div className="relative h-32 w-full md:hidden bg-muted">
          <Skeleton className="h-full w-full object-cover rounded-b-none" />
          {/* Privacy badge */}
          <div className="absolute top-2 right-2">
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
        </div>

        {/* Profile avatar (mobile) */}
        <div className="md:hidden relative -mt-6 mx-auto h-16 w-16">
          <Skeleton className="h-16 w-16 rounded-full border-4 border-background" />
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar (desktop) */}
              <div className="hidden md:block">
                <Skeleton className="h-12 w-12 rounded-full border border-muted" />
              </div>

              <div className="flex-1 space-y-2">
                {/* Group name */}
                <Skeleton className="h-5 w-48 rounded" />
                {/* Meta info */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-12 rounded" />
                  <Skeleton className="h-3 w-28 rounded" />
                  <Skeleton className="h-3 w-12 rounded" />
                </div>
              </div>
            </div>

            {/* Menu actions (statique) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <span className="flex items-center opacity-50">
                    {/* Eye icon placeholder */} Voir
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive opacity-50">
                  {/* Action placeholder */}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Footer: Members + Button */}
          <div className="mt-4 flex items-center justify-between">
            <AvatarGroupSkeleton count={3} />
            {/*  <Skeleton className="h-4 w-24 rounded" /> */}
            <Button variant="outline" size="sm">
              Afficher le groupe
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
