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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/src/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Eye,
  Users,
  MapPin,
  Link,
  PartyPopper,
  Presentation,
  Music,
  Trophy,
} from "lucide-react";

const events = [
  {
    id: 1,
    name: "Soirée de Rentrée 2024",
    avatar: "/placeholder.svg?height=32&width=32",
    dateDebut: "2024-09-15",
    dateFin: "2024-09-15",
    lieu: "Campus Principal - Amphithéâtre A",
    type: "fête",
    participants: 245,
    description:
      "Grande soirée de rentrée pour accueillir les nouveaux étudiants",
    organisateur: "Bureau des Étudiants",
  },
  {
    id: 2,
    name: "Conférence IA & Futur",
    avatar: "/placeholder.svg?height=32&width=32",
    dateDebut: "2024-10-20",
    dateFin: "2024-10-20",
    lieu: "https://meet.google.com/abc-defg-hij",
    type: "conférence",
    participants: 156,
    description:
      "Conférence sur l'intelligence artificielle et ses applications futures",
    organisateur: "Département Informatique",
  },
  {
    id: 3,
    name: "Festival des Sciences",
    avatar: "/placeholder.svg?height=32&width=32",
    dateDebut: "2024-11-05",
    dateFin: "2024-11-07",
    lieu: "Campus Principal - Hall d'exposition",
    type: "festival",
    participants: 89,
    description:
      "Festival annuel présentant les projets scientifiques des étudiants",
    organisateur: "Faculté des Sciences",
  },
  {
    id: 4,
    name: "Tournoi de Football Inter-Universités",
    avatar: "/placeholder.svg?height=32&width=32",
    dateDebut: "2024-12-01",
    dateFin: "2024-12-03",
    lieu: "Stade Universitaire",
    type: "tournoi",
    participants: 32,
    description:
      "Tournoi de football opposant plusieurs universités de la région",
    organisateur: "Association Sportive",
  },
];

export function EventsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [lieuFilter, setLieuFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const getEventTypeBadge = (type: string) => {
    const config = {
      fête: {
        icon: PartyPopper,
        className: "bg-pink-100 text-pink-800",
        label: "Fête",
      },
      conférence: {
        icon: Presentation,
        className: "bg-blue-100 text-blue-800",
        label: "Conférence",
      },
      festival: {
        icon: Music,
        className: "bg-purple-100 text-purple-800",
        label: "Festival",
      },
      tournoi: {
        icon: Trophy,
        className: "bg-orange-100 text-orange-800",
        label: "Tournoi",
      },
    };

    const eventConfig = config[type as keyof typeof config];
    if (!eventConfig) return <Badge variant="secondary">{type}</Badge>;

    const Icon = eventConfig.icon;
    return (
      <Badge className={eventConfig.className}>
        <Icon className="h-3 w-3 mr-1" />
        {eventConfig.label}
      </Badge>
    );
  };

  const isOnlineEvent = (lieu: string) => {
    return lieu.startsWith("http");
  };

  const formatDate = (dateDebut: string, dateFin: string) => {
    const debut = new Date(dateDebut).toLocaleDateString("fr-FR");
    const fin = new Date(dateFin).toLocaleDateString("fr-FR");

    if (dateDebut === dateFin) {
      return debut;
    }
    return `${debut} - ${fin}`;
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || event.type === typeFilter;
    const matchesLieu =
      lieuFilter === "all" ||
      (lieuFilter === "online" && isOnlineEvent(event.lieu)) ||
      (lieuFilter === "onsite" && !isOnlineEvent(event.lieu));
    return matchesSearch && matchesType && matchesLieu;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion des événements
        </h1>
        <p className="text-muted-foreground">
          Gérez les événements de votre réseau social universitaire
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des événements</CardTitle>
          <CardDescription>
            {filteredEvents.length} événement(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtres et recherche */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom..."
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
                <SelectItem value="fête">Fête</SelectItem>
                <SelectItem value="conférence">Conférence</SelectItem>
                <SelectItem value="festival">Festival</SelectItem>
                <SelectItem value="tournoi">Tournoi</SelectItem>
              </SelectContent>
            </Select>
            <Select value={lieuFilter} onValueChange={setLieuFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par lieu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les lieux</SelectItem>
                <SelectItem value="onsite">Sur site</SelectItem>
                <SelectItem value="online">En ligne</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Événement</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Lieu</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage
                            src={event.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {event.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{event.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(event.dateDebut, event.dateFin)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center max-w-[200px]">
                        {isOnlineEvent(event.lieu) ? (
                          <>
                            <Link className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                            <span className="text-sm text-blue-600 truncate">
                              En ligne
                            </span>
                          </>
                        ) : (
                          <>
                            <MapPin className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                            <span className="text-sm truncate">
                              {event.lieu}
                            </span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getEventTypeBadge(event.type)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        {event.participants}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => setSelectedEvent(event)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Voir les détails
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Sheet pour les détails de l'événement */}
      {selectedEvent && (
        <Sheet
          open={!!selectedEvent}
          onOpenChange={() => setSelectedEvent(null)}
        >
          <SheetContent className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Détails de l'événement</SheetTitle>
              <SheetDescription>
                Informations détaillées de {selectedEvent.name}
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-6 mt-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={selectedEvent.avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback>
                    {selectedEvent.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedEvent.name}
                  </h3>
                  <p className="text-muted-foreground">
                    Organisé par {selectedEvent.organisateur}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {getEventTypeBadge(selectedEvent.type)}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Informations</h4>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dates:</span>
                      <span>
                        {formatDate(
                          selectedEvent.dateDebut,
                          selectedEvent.dateFin
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lieu:</span>
                      <div className="flex items-center">
                        {isOnlineEvent(selectedEvent.lieu) ? (
                          <>
                            <Link className="h-4 w-4 mr-1 text-blue-500" />
                            <span className="text-blue-600">En ligne</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="h-4 w-4 mr-1 text-green-500" />
                            <span>{selectedEvent.lieu}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Participants:
                      </span>
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {selectedEvent.participants}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedEvent.description && (
                  <div>
                    <h4 className="font-medium">Description</h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Accéder au détail de l'événement
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
