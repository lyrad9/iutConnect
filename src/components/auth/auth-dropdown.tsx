import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/src/components/ui/dropdown-menu";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  UserIcon,
  LogOutIcon,
  ChevronDownIcon,
  Bookmark,
  Users,
  CalendarDays,
  Shield,
} from "lucide-react";
import { SmartAvatar } from "../shared/smart-avatar";
import { useState } from "react";
import { LogoutConfirmationModal } from "./logout-confirmation-modal";

export const AuthDropdown = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const user = useQuery(api.users.currentUser);

  // Vérifier si l'utilisateur est un administrateur
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPERADMIN";
  const hasPermissions = user?.permissions?.some((permission) =>
    ["CREATE_GROUP", "CREATE_EVENT"].includes(permission)
  );

  // Déterminer les permissions spécifiques
  const canCreateGroup =
    isAdmin ||
    user?.permissions?.includes("CREATE_GROUP") ||
    user?.permissions?.includes("ALL");
  const canCreateEvent =
    isAdmin ||
    user?.permissions?.includes("CREATE_EVENT") ||
    user?.permissions?.includes("ALL");

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="rounded-full flex items-center gap-2 cursor-pointer">
            <SmartAvatar
              avatar={user?.profilePicture || ""}
              name={`${user?.firstName} ${user?.lastName}`}
              size="sm"
              className="rounded-full"
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
                <Bookmark
                  size={16}
                  className="opacity-60 mr-2"
                  aria-hidden="true"
                />
                <span>Mes favoris</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          {/* Section des actions d'administration */}
          {(isAdmin || hasPermissions) && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="flex items-center text-xs text-muted-foreground">
                <Shield size={14} className="mr-1" />
                Actions administrateur
              </DropdownMenuLabel>
              <DropdownMenuGroup>
                {canCreateGroup && (
                  <DropdownMenuItem asChild>
                    <Link href="/groups/create" className="">
                      <Users size={16} className="mr-2" aria-hidden="true" />
                      <span>Créer un groupe</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                {canCreateEvent && (
                  <DropdownMenuItem asChild>
                    <Link href="/events/create" className="">
                      <CalendarDays
                        size={16}
                        className="mr-2"
                        aria-hidden="true"
                      />
                      <span>Créer un évènement</span>
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsLogoutModalOpen(true)}
            className="text-red-500"
          >
            <LogOutIcon
              size={16}
              className="opacity-60 mr-2"
              aria-hidden="true"
            />
            <span>Déconnexion</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal de confirmation de déconnexion */}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
};
