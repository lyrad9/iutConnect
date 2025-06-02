"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Search,
  Heart,
  MessageCircle,
  FileText,
  Calendar,
  Settings,
  Bell,
} from "lucide-react";

const notifications = [
  {
    id: 1,
    emetteur: {
      name: "Alice Martin",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    type: "like",
    message: "Alice a aimé votre photo",
    timestamp: "2024-01-20T10:30:00Z",
    read: false,
  },
  {
    id: 2,
    emetteur: {
      name: "Pierre Dubois",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    type: "comment",
    message: "Pierre a commenté votre publication",
    timestamp: "2024-01-20T09:15:00Z",
    read: true,
  },
  {
    id: 3,
    emetteur: {
      name: "Marie Leroy",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    type: "post",
    message: "Marie a publié une nouvelle publication",
    timestamp: "2024-01-20T08:45:00Z",
    read: false,
  },
  {
    id: 4,
    emetteur: {
      name: "Jean Moreau",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    type: "event",
    message: "Jean a créé un nouvel événement",
    timestamp: "2024-01-19T16:20:00Z",
    read: true,
  },
  {
    id: 5,
    emetteur: {
      name: "Sophie Bernard",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    type: "administratif",
    message:
      "Sophie vous a envoyé une demande d'inscription dans la plateforme",
    timestamp: "2024-01-19T14:10:00Z",
    read: false,
  },
  {
    id: 6,
    emetteur: {
      name: "Lucas Petit",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    type: "post",
    message: "Lucas a partagé un événement",
    timestamp: "2024-01-19T11:30:00Z",
    read: true,
  },
];

export function NotificationsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const getNotificationIcon = (type: string) => {
    const iconConfig = {
      like: { icon: Heart, className: "text-red-500" },
      comment: { icon: MessageCircle, className: "text-blue-500" },
      post: { icon: FileText, className: "text-green-500" },
      event: { icon: Calendar, className: "text-purple-500" },
      administratif: { icon: Settings, className: "text-orange-500" },
    };

    const config = iconConfig[type as keyof typeof iconConfig];
    if (!config) return <Settings className="h-4 w-4 text-gray-500" />;

    const Icon = config.icon;
    return <Icon className={`h-4 w-4 ${config.className}`} />;
  };

  const getNotificationTypeBadge = (type: string) => {
    const badgeConfig = {
      like: { label: "J'aime", className: "bg-red-100 text-red-800" },
      comment: { label: "Commentaire", className: "bg-blue-100 text-blue-800" },
      post: { label: "Publication", className: "bg-green-100 text-green-800" },
      event: { label: "Événement", className: "bg-purple-100 text-purple-800" },
      administratif: {
        label: "Administratif",
        className: "bg-orange-100 text-orange-800",
      },
    };

    const config = badgeConfig[type as keyof typeof badgeConfig];
    if (!config) return <Badge variant="secondary">{type}</Badge>;

    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "À l'instant";
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Il y a ${diffInDays}j`;
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.emetteur.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesType =
      typeFilter === "all" || notification.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "read" && notification.read) ||
      (statusFilter === "unread" && !notification.read);
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: notifications.length,
    unread: notifications.filter((n) => !n.read).length,
    byType: {
      like: notifications.filter((n) => n.type === "like").length,
      comment: notifications.filter((n) => n.type === "comment").length,
      post: notifications.filter((n) => n.type === "post").length,
      event: notifications.filter((n) => n.type === "event").length,
      administratif: notifications.filter((n) => n.type === "administratif")
        .length,
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion des notifications
        </h1>
        <p className="text-muted-foreground">
          Surveillez et gérez les notifications de votre réseau social
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Non lues
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.unread}
                </p>
              </div>
              <Badge className="bg-red-100 text-red-800">{stats.unread}</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  J'aimes
                </p>
                <p className="text-2xl font-bold">{stats.byType.like}</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Commentaires
                </p>
                <p className="text-2xl font-bold">{stats.byType.comment}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des notifications</CardTitle>
          <CardDescription>
            {filteredNotifications.length} notification(s) trouvée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtres et recherche */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans les notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="like">J'aime</SelectItem>
                <SelectItem value="comment">Commentaire</SelectItem>
                <SelectItem value="post">Publication</SelectItem>
                <SelectItem value="event">Événement</SelectItem>
                <SelectItem value="administratif">Administratif</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="read">Lues</SelectItem>
                <SelectItem value="unread">Non lues</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions en lot */}
          <div className="flex items-center gap-2 mb-4">
            <Button size="sm" variant="outline">
              Marquer tout comme lu
            </Button>
            <Button size="sm" variant="outline">
              Supprimer les lues
            </Button>
          </div>

          {/* Liste des notifications */}
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${
                  !notification.read
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <Avatar>
                  <AvatarImage
                    src={notification.emetteur.avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback>
                    {notification.emetteur.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getNotificationIcon(notification.type)}
                      <span className="font-medium">
                        {notification.emetteur.name}
                      </span>
                      {getNotificationTypeBadge(notification.type)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-700">
                    {notification.message}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredNotifications.length === 0 && (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Aucune notification trouvée
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
