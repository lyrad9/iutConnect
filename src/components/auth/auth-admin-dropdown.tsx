import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuItem,
} from "@/src/components/ui/dropdown-menu";
import { User2, ChevronUp, LogOut } from "lucide-react";
import { SidebarMenuButton } from "@/src/components/ui/sidebar";
import { SmartAvatar } from "@/src/components/shared/smart-avatar";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";

export function AuthAdminDropdown() {
  // Récupérer l'utilisateur courant
  const user = useQuery(api.users.currentUser, {});

  // Gestion de la déconnexion (à adapter selon votre logique d'auth)
  const handleLogout = () => {
    // Redirige vers la page de login ou appelle une mutation de logout
    window.location.href = "/sign-up";
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton>
          <SmartAvatar
            avatar={user.profilePicture as string | undefined}
            name={user.firstName + (user.lastName ? ` ${user.lastName}` : "")}
            size="sm"
            className="mr-2"
          />
          <div className="flex flex-col items-start min-w-0">
            <span className="truncate font-medium text-sm">
              {user.firstName} {user.lastName}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {user.email}
            </span>
          </div>
          <ChevronUp className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        className="w-[--radix-popper-anchor-width]"
      >
        <DropdownMenuItem>
          <span>Account</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span>Retour au site</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
