import {
  GraduationCap,
  Music,
  Trophy,
  PartyPopper,
  Briefcase,
} from "lucide-react";

// Types d'événements avec leurs couleurs et icônes associées
export const eventTypes = {
  academic: {
    content: "Académique",
    color: "bg-blue-100 dark:bg-blue-900",
    textColor: "text-blue-600 dark:text-blue-300",
    icon: <GraduationCap className="h-3 w-3" />,
  },
  cultural: {
    content: "Arts & Culture",
    color: "bg-purple-100 dark:bg-purple-900",
    textColor: "text-purple-600 dark:text-purple-300",
    icon: <Music className="h-3 w-3" />,
  },
  sports: {
    content: "Sports",
    color: "bg-green-100 dark:bg-green-900",
    textColor: "text-green-600 dark:text-green-300",
    icon: <Trophy className="h-3 w-3" />,
  },
  social: {
    content: "Social",
    color: "bg-amber-100 dark:bg-amber-900",
    textColor: "text-amber-600 dark:text-amber-300",
    icon: <PartyPopper className="h-3 w-3" />,
  },
  professional: {
    content: "Professionnel",
    color: "bg-slate-100 dark:bg-slate-800",
    textColor: "text-slate-600 dark:text-slate-300",
    icon: <Briefcase className="h-3 w-3" />,
  },
};
