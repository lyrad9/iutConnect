import React from "react";
import Link from "next/link";
import { MessageSquare, UserPlus, MoreHorizontal } from "lucide-react";
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
import { mockUsers } from "@/src/components/utils/const/mock-data";

export function ProfileFriends() {
  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Friends</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Find Friends
          </Button>
          <Button size="sm">All Friends</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {mockUsers.map((user) => (
          <div
            key={user.id}
            className="rounded-xl border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <Link
                href={`/profile/${user.id}`}
                className="flex items-center gap-3"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {user.department}
                  </div>
                </div>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="size-4" />
                    <span className="sr-only">More</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Unfollow</DropdownMenuItem>
                  <DropdownMenuItem>Block</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-4 flex justify-between gap-2">
              <Button variant="outline" className="flex-1 gap-2" size="sm">
                <MessageSquare className="size-4" />
                Message
              </Button>
              <Button className="flex-1 gap-2" size="sm">
                <UserPlus className="size-4" />
                Connect
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
