import Link from "next/link";

import { SmartAvatar } from "../shared/smart-avatar";
import { Button } from "../ui/button";
import { AuthLoading, Authenticated, Unauthenticated } from "convex/react";
import { Skeleton } from "../ui/skeleton";

export default function UserProfileSIdebar({
  firstName,
  lastName,
  username,
  profilePicture,
}: {
  firstName: string;
  lastName: string;
  username?: string;
  profilePicture?: string;
}) {
  return (
    <div className="px-4 mb-6">
      <div className="flex flex-col items-center p-4 rounded-lg bg-muted/30 border border-border/50">
        <Authenticated>
          <SmartAvatar
            avatar={profilePicture || undefined}
            name={`${firstName} ${lastName}`}
            size="lg"
            className="mb-3"
          />
          <h3 className="font-medium text-base">
            {firstName} {lastName}
          </h3>
          {username && (
            <p className="text-sm text-muted-foreground">@{username}</p>
          )}
        </Authenticated>
        <AuthLoading>
          <Skeleton className="size-12 rounded-full mb-3" />
          <Skeleton className="w-20 h-4" />
        </AuthLoading>
        <Button asChild variant="outline" size="sm" className="w-full mt-3">
          <Link href="/profile">Voir mon profil</Link>
        </Button>
      </div>
    </div>
  );
}
