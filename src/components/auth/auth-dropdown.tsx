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
  LayoutDashboard,
} from "lucide-react";
import { SmartAvatar } from "../shared/smart-avatar";
import { useState } from "react";
import { LogoutConfirmationModal } from "./logout-confirmation-modal";
import { hasDashboardAccess } from "@/src/lib/verify-role-admin";
import { UserPermission, UserRole } from "@/convex/schema";
import {
  hasAdmin,
  hasCreateEventPermissions,
  hasCreateGroupPermissions,
  hasCreatePostPermissions,
} from "@/src/lib/check-permissions";
export const AuthDropdown = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const user = useQuery(api.users.currentUser);
  const accessToDashboard = hasDashboardAccess(
    user?.role as (typeof UserRole)[number],
    user?.permissions as (typeof UserPermission)[number][]
  );
  // Vérifier si l'utilisateur est un administrateur

  const hasPermissions =
    hasCreateEventPermissions(
      user?.permissions as (typeof UserPermission)[number][]
    ) ||
    hasCreateGroupPermissions(
      user?.permissions as (typeof UserPermission)[number][]
    );
  // Déterminer les permissions spécifiques
  const canCreateGroup = hasCreateGroupPermissions(
    user?.permissions as (typeof UserPermission)[number][]
  );
  const canCreateEvent = hasCreateEventPermissions(
    user?.permissions as (typeof UserPermission)[number][]
  );

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
            <span className="text-muted-foreground truncate text-xs font-normal">
              {user?.role}
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
          {(accessToDashboard || hasPermissions) && (
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
                {accessToDashboard && (
                  <DropdownMenuItem asChild>
                    <Link href="/admins" className="">
                      <LayoutDashboard
                        size={16}
                        className="mr-2"
                        aria-hidden="true"
                      />
                      <span>Accéder au dashboard</span>
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
