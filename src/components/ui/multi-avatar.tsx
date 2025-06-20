import { cn } from "@/src/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

export interface MultiAvatarProps {
  users: {
    id: string;
    name?: string;
    avatar?: string | null;
  }[];
  totalCount?: number;
  maxDisplayed?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
  countClassName?: string;
}

/**
 * Composant pour afficher un groupe d'avatars superposés avec le nombre total
 * @param users - Liste des utilisateurs à afficher
 * @param totalCount - Nombre total d'utilisateurs (optionnel, par défaut la longueur de users)
 * @param maxDisplayed - Nombre maximum d'avatars à afficher (par défaut 4)
 * @param size - Taille des avatars (sm: 20px, md: 24px, lg: 32px)
 * @param showCount - Afficher le nombre total ou non
 * @param className - Classes supplémentaires pour le conteneur
 * @param countClassName - Classes supplémentaires pour le texte du compteur
 */
export function MultiAvatar({
  users,
  totalCount,
  maxDisplayed = 4,
  size = "md",
  showCount = true,
  className,
  countClassName,
}: MultiAvatarProps) {
  console.log("countTotal", totalCount);
  // Limiter le nombre d'avatars affichés
  const displayedUsers = users.slice(0, maxDisplayed);
  const remainingCount = (totalCount || users.length) - displayedUsers.length;

  // Déterminer la taille des avatars
  const avatarSize = {
    sm: "size-5",
    md: "size-6",
    lg: "size-8",
  }[size];

  // Formater le nombre pour l'affichage (ex: 1000 -> 1K)
  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1).replace(/\.0$/, "")}M+`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}K+`;
    }
    return count.toString();
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("flex -space-x-1.5")}>
        {displayedUsers.map((user) => (
          <Avatar
            key={user.id}
            className={cn(avatarSize, "ring-1 ring-background")}
          >
            <AvatarImage
              src={user.avatar || "/placeholder.svg"}
              alt={user.name || "Avatar"}
            />
            <AvatarFallback>{user.name?.charAt(0) || "?"}</AvatarFallback>
          </Avatar>
        ))}
      </div>

      {showCount && totalCount && totalCount > 0 && (
        <span className={cn("text-xs text-muted-foreground", countClassName)}>
          <strong className="font-medium text-foreground">
            {formatCount(totalCount)}
            {/* {formatCount(totalCount || users.length)} */}
          </strong>{" "}
          membres
        </span>
      )}
    </div>
  );
}
