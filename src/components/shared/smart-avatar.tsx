"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { cn, getInitials } from "@/src/lib/utils";
/* 
type EntityWithAvatar = {
  name: string;
  profilePicture?: string | null;
}; */

export type SmartAvatarProps = {
  avatar?: string;
  name?: string;
  className?: string;
  fallbackClassName?: string;
  size?: "sm" | "md" | "lg" | "xl";
  /*  showFallback?: boolean; */
};

/**
 * Composant avatar intelligent qui gère automatiquement l'affichage
 * d'un avatar pour un utilisateur ou un groupe avec fallback approprié
 */
export function SmartAvatar({
  avatar,
  name,
  className,
  fallbackClassName,
  size = "md",
  /*  showFallback = true, */
}: SmartAvatarProps) {
  // Définir les tailles
  const sizeClasses = {
    sm: "size-8",
    md: "size-10",
    lg: "size-12",
    xl: "size-16",
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage
        src={name ? avatar : avatar ? avatar : "/placeholder.svg"}
        alt={name}
      />
      {name && (
        <AvatarFallback
          className={cn(
            "bg-primary dark:bg-white text-white dark:text-primary font-bold",
            fallbackClassName
          )}
        >
          {getInitials(name)}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
