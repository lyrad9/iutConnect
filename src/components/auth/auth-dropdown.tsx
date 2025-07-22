import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { redirect, useRouter } from "next/navigation";
import {
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  ChevronDownIcon,
  BookmarkPlus,
} from "lucide-react";
import { SmartAvatar } from "../shared/smart-avatar";
export const AuthDropdown = () => {
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.currentUser);
  const router = useRouter();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/*    <Button
            variant="ghost"
            className="w-auto h-auto p-0 hover:bg-transparent"
          > */}
          <div className="flex items-center gap-2 cursor-pointer">
            <SmartAvatar
              avatar={user?.profilePicture || ""}
              name={`${user?.firstName} ${user?.lastName}`}
              size="sm"
              className="rounded"
            />
            <ChevronDownIcon
              size={16}
              className="opacity-60"
              aria-hidden="true"
            />
          </div>
          {/* </Button> */}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-64">
          <DropdownMenuLabel className="flex min-w-0 flex-col">
            <span className="text-foreground truncate text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="text-muted-foreground truncate text-xs font-normal">
              {user?.email}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserIcon
                  size={16}
                  className="opacity-60 mr-2"
                  aria-hidden="true"
                />
                <span>Mon profil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/bookmarks">
                <BookmarkPlus
                  size={16}
                  className="opacity-60 mr-2"
                  aria-hidden="true"
                />
                <span>Mes favoris</span>
              </Link>
            </DropdownMenuItem>
            {/*   <DropdownMenuItem asChild>
              <Link href="/settings">
                <SettingsIcon
                  size={16}
                  className="opacity-60 mr-2"
                  aria-hidden="true"
                />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem> */}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              await signOut();
              redirect("/sign-up");
            }}
          >
            <LogOutIcon
              size={16}
              className="opacity-60 mr-2"
              aria-hidden="true"
            />
            <span className="text-red-500">Déconnexion</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
