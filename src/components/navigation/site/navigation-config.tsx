import React from "react";
import {
  Home,
  Users,
  Calendar,
  BookOpen,
  MessageSquare,
  Bell,
  Settings,
  User,
  Search,
} from "lucide-react";

export const NavigationItems = [
  {
    href: "/",
    icon: <Home className="size-5" />,
    label: "Fil d\\'actualité",
  },
  {
    href: "/groups",
    icon: <Users className="size-5" />,
    label: "Groupes",
  },
  {
    href: "/events",
    icon: <Calendar className="size-5" />,
    label: "Evènements",
  },
  /* {
    href: "/courses",
    icon: <BookOpen className="size-5" />,
    label: "Courses",
    notifications: 3,
  }, */
  {
    href: "/messages",
    icon: <MessageSquare className="size-5" />,
    label: "Messages",
    hasMessages: true,
  },
  {
    href: "/notifications",
    icon: <Bell className="size-5" />,
    label: "Notifications",
    hasNotifications: true,
  },
  {
    href: "/profile",
    icon: <User className="size-5" />,
    label: "Profil",
  },
  {
    href: "/settings",
    icon: <Settings className="size-5" />,
    label: "Paramètres",
  },
];
