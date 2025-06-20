import {
  Calendar,
  FileCheck,
  Heart,
  MessageCircle,
  MessageSquareText,
  PencilLine,
  UserPlus,
  Users,
} from "lucide-react";
/**
 * Types de notifications avec leurs icônes et couleurs
 */
export const notificationTypes = {
  like: {
    icon: <Heart className="h-3 w-3" />,
    color: "bg-rose-100 text-rose-500 dark:bg-rose-900 dark:text-rose-300",
    borderColor: "border-rose-400 dark:border-rose-200",
  },
  comment: {
    icon: <MessageCircle className="h-3 w-3" />,
    color: "bg-sky-100 text-sky-500 dark:bg-sky-900 dark:text-sky-300",
    borderColor: "border-sky-400 dark:border-sky-200",
  },
  event: {
    icon: <Calendar className="h-3 w-3" />,
    color:
      "bg-emerald-100 text-emerald-500 dark:bg-emerald-900 dark:text-emerald-300",
    borderColor: "border-emerald-400 dark:border-emerald-200",
  },
  post: {
    icon: <PencilLine className="h-3 w-3" />,
    color:
      "bg-orange-100 text-orange-500 dark:bg-orange-900 dark:text-orange-300",
    borderColor: "border-orange-400 dark:border-orange-200",
  },
  /*   new_post_in_group: {
    icon: <PencilLine className="h-3 w-3" />,
    color:
      "bg-violet-100 text-violet-500 dark:bg-violet-900 dark:text-violet-300",
  }, */
  // créer un groupe, demande de validation d'une publication
  group: {
    icon: <Users className="h-3 w-3" />,
    color: "bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300",
    borderColor: "border-blue-400 dark:border-blue-200",
  },
  // Demande d'adhésion à un groupe
  request: {
    icon: <UserPlus className="h-3 w-3" />,
    color:
      "bg-violet-100 text-violet-500 dark:bg-violet-900 dark:text-violet-300",
    borderColor: "border-violet-400 dark:border-violet-200",
  },
  post_by_group: {
    icon: <MessageSquareText className="h-3 w-3" />,
    color: "bg-green-100 text-green-500 dark:bg-green-900 dark:text-green-300",
    borderColor: "border-green-400 dark:border-green-200",
  },
};
// Notfication de type évènement(nouvelle participation, création d'un évènement, etc.)
// Notifications de type groupe("demande d'approbation, nouvelle publication, demande de validation d'une publication)
// Notification de type like
// Notification de type commentaire(sur un post ou évènement)
