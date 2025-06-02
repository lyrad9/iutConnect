import {
  Calendar,
  FileCheck,
  Heart,
  MessageCircle,
  PencilLine,
  UserPlus,
} from "lucide-react";
/**
 * Types de notifications avec leurs icônes et couleurs
 */
export const notificationTypes = {
  like: {
    icon: <Heart className="h-3 w-3" />,
    color: "bg-rose-100 text-rose-500 dark:bg-rose-900 dark:text-rose-300",
  },
  comment: {
    icon: <MessageCircle className="h-3 w-3" />,
    color: "bg-sky-100 text-sky-500 dark:bg-sky-900 dark:text-sky-300",
  },
  new_event: {
    icon: <Calendar className="h-3 w-3" />,
    color:
      "bg-emerald-100 text-emerald-500 dark:bg-emerald-900 dark:text-emerald-300",
  },
  new_post: {
    icon: <PencilLine className="h-3 w-3" />,
    color:
      "bg-orange-100 text-orange-500 dark:bg-orange-900 dark:text-orange-300",
  },
  new_post_in_group: {
    icon: <PencilLine className="h-3 w-3" />,
    color:
      "bg-violet-100 text-violet-500 dark:bg-violet-900 dark:text-violet-300",
  },
  // Demande d'adhésion à un groupe(qui va gérer quand la demande d'approbation sera en attente, approuvée ou rejetée)
  group_join_request: {
    icon: <UserPlus className="h-3 w-3" />,
    color:
      "bg-violet-100 text-violet-500 dark:bg-violet-900 dark:text-violet-300",
  },
  // Demande d'approbation d'une publication(qui va gérer quand la notification sera en attente, approuvée ou rejetée)
  post_approval_request: {
    icon: <FileCheck className="h-3 w-3" />,
    color:
      "bg-yellow-100 text-yellow-500 dark:bg-yellow-900 dark:text-yellow-300",
  },
};
