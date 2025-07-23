"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Calendar, AlertCircle } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/src/lib/utils";
import { EventModal } from "./event/event-modal";

interface CreateEventButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

/**
 * Bouton pour créer un événement avec vérification des permissions
 * Affiche un tooltip si l'utilisateur n'a pas les permissions
 */
export function CreateEventButton({
  variant = "default",
  size = "default",
  className,
  children,
}: CreateEventButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentUser = useQuery(api.users.currentUser);

  // Vérifier si l'utilisateur a la permission de créer un événement
  const canCreateEvent =
    currentUser?.permissions?.includes("CREATE_EVENT") ||
    currentUser?.permissions?.includes("ALL") ||
    currentUser?.role === "ADMIN" ||
    currentUser?.role === "SUPERADMIN";

  const handleClick = () => {
    if (canCreateEvent) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                variant={variant}
                size={size}
                className={cn(className)}
                onClick={handleClick}
                disabled={!canCreateEvent}
              >
                {children || (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Créer un événement
                  </>
                )}
              </Button>
            </span>
          </TooltipTrigger>
          {!canCreateEvent && (
            <TooltipContent>
              <div className="flex items-center gap-2 text-sm max-w-xs">
                <AlertCircle size={16} className="text-yellow-500" />
                <span>
                  Vous n&apos;avez pas les permissions nécessaires pour créer un
                  événement
                </span>
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      {canCreateEvent && (
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => setIsModalOpen(false)}
          setIsPostOrEvent={() => {}}
        />
      )}
    </>
  );
}
