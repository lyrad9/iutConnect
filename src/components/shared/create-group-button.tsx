"use client";

import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Users, AlertCircle } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/src/lib/utils";

interface CreateGroupButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

/**
 * Bouton pour créer un groupe avec vérification des permissions
 * Affiche un tooltip si l'utilisateur n'a pas les permissions
 */
export function CreateGroupButton({
  variant = "default",
  size = "default",
  className,
  children,
}: CreateGroupButtonProps) {
  const router = useRouter();
  const currentUser = useQuery(api.users.currentUser);

  // Vérifier si l'utilisateur a la permission de créer un groupe
  const canCreateGroup =
    currentUser?.permissions?.includes("CREATE_GROUP") ||
    currentUser?.permissions?.includes("ALL") ||
    currentUser?.role === "ADMIN" ||
    currentUser?.role === "SUPERADMIN";

  const handleClick = () => {
    if (canCreateGroup) {
      router.push("/groups/create");
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button
              variant={variant}
              size={size}
              className={cn(className)}
              onClick={handleClick}
              disabled={!canCreateGroup}
            >
              {children || (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Créer un groupe
                </>
              )}
            </Button>
          </span>
        </TooltipTrigger>
        {!canCreateGroup && (
          <TooltipContent>
            <div className="flex items-center gap-2 text-sm max-w-xs">
              <AlertCircle size={16} className="text-yellow-500" />
              <span>
                Vous n&apos;avez pas les permissions nécessaires pour créer un
                groupe
              </span>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
