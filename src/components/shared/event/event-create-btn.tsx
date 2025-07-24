import { Button } from "@/src/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { Lock, Plus } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/src/lib/utils";
import Link from "next/link";

export function EventCreateBtn({ className }: { className?: string }) {
  const user = useQuery(api.users.currentUser);

  // Vérifier si l'utilisateur a la permission de créer des événements
  const canCreateEvent =
    user?.role !== "USER" ||
    (user?.permissions && user.permissions.includes("CREATE_EVENT"));

  return (
    <>
      {canCreateEvent ? (
        <Button
          suppressHydrationWarning
          className={cn("bg-primary gap-1", className)}
          asChild
        >
          <Link href="/events/create">
            <Plus className="h-3.5 w-3.5" />
            <span>Créer un événement</span>
          </Link>
        </Button>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                suppressHydrationWarning
                className={cn(
                  "bg-primary/30 hover:bg-primary/40 gap-1 cursor-not-allowed",
                  className
                )}
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Créer un événement</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Vous n&apos;avez pas la permission de créer des événements</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
}
