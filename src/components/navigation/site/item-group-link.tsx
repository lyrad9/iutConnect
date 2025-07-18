import React from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { getInitials } from "@/src/lib/utils";

/**
 * Composant pour un lien de groupe dans la barre latérale
 */
export function GroupLink({
  id,
  name,
  avatar,
  memberCount,
}: {
  id: string;
  name: string;
  avatar?: string | null;
  memberCount: number;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start text-muted-foreground h-auto py-2"
      asChild
    >
      <Link href={`/groups/${id}`} className="flex items-start gap-2">
        <Avatar className="h-6 w-6 flex-shrink-0">
          <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <span>{name}</span>
          <span className="text-xs text-muted-foreground">
            {memberCount} membres
          </span>
        </div>
      </Link>
    </Button>
  );
}
