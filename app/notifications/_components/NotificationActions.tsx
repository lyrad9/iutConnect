import { Button } from "@/src/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export function NotificationActions({
  notificationId,
}: {
  notificationId: Id<"notifications">;
}) {
  const deleteNotification = useMutation(api.notifications.deleteNotification);
  return (
    <>
      {/* Menu d'actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-full p-0"
          >
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Plus d&apos;options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/*  <DropdownMenuItem>Marquer comme lu</DropdownMenuItem>
        <DropdownMenuItem>Signaler</DropdownMenuItem> */}
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => {
              deleteNotification({ notificationId })
                .then(() => {
                  toast.success("Notification supprimée");
                })
                .catch((error) => {
                  console.error(error);
                  toast.error(
                    "Erreur lors de la suppression de la notification"
                  );
                });
            }}
          >
            Supprimer la notification
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
