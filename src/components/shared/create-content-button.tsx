"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { PlusSquare, FileText, Calendar, AlertCircle } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { PostModal } from "./post/post-modal";
import { EventModal } from "./event/event-modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface CreateContentButtonProps {
  className?: string;
  iconSize?: number;
  variant?: "primary" | "default";
}

/**
 * Bouton de création de contenu avec choix entre post et événement
 * Affiche un Popover pour choisir le type de contenu à créer
 */
export function CreateContentButton({
  className,
  iconSize = 24,
  variant = "default",
}: CreateContentButtonProps) {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const currentUser = useQuery(api.users.currentUser);

  // Vérifier les permissions de l'utilisateur
  const canCreatePost =
    currentUser?.permissions?.includes("CREATE_POST") ||
    currentUser?.permissions?.includes("ALL") ||
    currentUser?.role === "ADMIN" ||
    currentUser?.role === "SUPERADMIN";

  const canCreateEvent =
    currentUser?.permissions?.includes("CREATE_EVENT") ||
    currentUser?.permissions?.includes("ALL") ||
    currentUser?.role === "ADMIN" ||
    currentUser?.role === "SUPERADMIN";

  // Vérifier si l'utilisateur peut créer au moins un type de contenu
  const canCreateContent = canCreatePost || canCreateEvent;

  // Ouvrir directement la modal appropriée si l'utilisateur n'a qu'une seule permission
  const handleClick = () => {
    if (!canCreateContent) return;

    if (canCreatePost && !canCreateEvent) {
      setIsPostModalOpen(true);
      return;
    }

    if (!canCreatePost && canCreateEvent) {
      setIsEventModalOpen(true);
      return;
    }

    // Si l'utilisateur peut créer les deux types de contenu, afficher le Popover
    setIsPopoverOpen(true);
  };

  // Gérer le choix du type de contenu
  const handleContentTypeSelect = (type: "post" | "event") => {
    setIsPopoverOpen(false);
    if (type === "post") {
      setIsPostModalOpen(true);
    } else {
      setIsEventModalOpen(true);
    }
  };

  if (!canCreateContent) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={cn(
                "flex items-center justify-center",
                variant === "primary" &&
                  "h-12 w-12 rounded-full bg-primary text-primary-foreground",
                className
              )}
              disabled={true}
              variant={variant === "primary" ? "default" : "ghost"}
            >
              <PlusSquare
                className={cn(
                  variant === "primary" ? "" : "text-muted-foreground"
                )}
                size={iconSize}
              />
              <span className="sr-only">Créer du contenu</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle size={16} className="text-yellow-500" />
              <span>Vous n&apos;avez pas les permissions nécessaires</span>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            onClick={handleClick}
            className={cn(
              "flex items-center justify-center",
              variant === "primary" &&
                "h-12 w-12 rounded-full bg-primary text-primary-foreground",
              className
            )}
            variant={variant === "primary" ? "default" : "ghost"}
          >
            <PlusSquare size={iconSize} />
            <span className="sr-only">Créer du contenu</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-56 p-2">
          <div className="grid gap-1">
            {canCreatePost && (
              <Button
                variant="ghost"
                className="flex w-full items-center justify-start gap-2"
                onClick={() => handleContentTypeSelect("post")}
              >
                <FileText size={16} />
                <span>Créer une publication</span>
              </Button>
            )}

            {canCreateEvent && (
              <Button
                variant="ghost"
                className="flex w-full items-center justify-start gap-2"
                onClick={() => handleContentTypeSelect("event")}
              >
                <Calendar size={16} />
                <span>Créer un événement</span>
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Modals */}
      {canCreatePost && (
        <PostModal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
        />
      )}

      {canCreateEvent && (
        <EventModal
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          onSuccess={() => setIsEventModalOpen(false)}
          setIsPostOrEvent={() => {}}
        />
      )}
    </>
  );
}
