import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { redirect, useRouter } from "next/navigation";
export const AuthDropdown = () => {
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.currentUser);
  const router = useRouter();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="User"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/profile">View Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <p>
              {user?.firstName} {user?.lastName}
            </p>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              await signOut();
              redirect("/sign-up");

              /*    .then(() => {
                router.push("/sign-up");
              }); */
            }}
            asChild
          >
            <p className="text-red-500 cursor-pointer">Logout</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
