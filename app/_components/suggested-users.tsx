"use client";

import React from "react";
import Link from "next/link";
import { MoreHorizontal, X } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { mockSuggestedUsers } from "@/src/components/utils/const/mock-data";

export function SuggestedUsers() {
  const [users, setUsers] = React.useState(mockSuggestedUsers);

  const handleRemoveUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="font-semibold">People You May Know</h3>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/suggestions">See all</Link>
        </Button>
      </div>
      <div className="p-4">
        {users.length > 0 ? (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-start justify-between">
                <div className="flex gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Link
                      href={`/profile/${user.id}`}
                      className="font-medium hover:underline"
                    >
                      {user.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {user.department}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {user.mutualConnections} mutual connections
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleRemoveUser(user.id)}
                  >
                    <X className="size-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/profile/${user.id}`}>View Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRemoveUser(user.id)}
                      >
                        Not Interested
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            No suggestions at the moment.
          </p>
        )}
      </div>
    </div>
  );
}
