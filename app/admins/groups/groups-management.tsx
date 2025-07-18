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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Eye,
  Ban,
  Users,
  Lock,
  Unlock,
} from "lucide-react";
import Image from "next/image";

const salons = [
  {
    id: 1,
    name: "Informatique L3",
    avatar: "/placeholder.svg?height=32&width=32",
    members: 156,
    category: "Académique",
    status: "actif",
    description: "Salon de discussion pour les étudiants de L3 Informatique",
    coverImage: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 2,
    name: "Club Gaming",
    avatar: "/placeholder.svg?height=32&width=32",
    members: 89,
    category: "Social",
    status: "actif",
    description: "Communauté des passionnés de jeux vidéo",
    coverImage: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 3,
    name: "Équipe Football",
    avatar: "/placeholder.svg?height=32&width=32",
    members: 23,
    category: "Sport",
    status: "suspendu",
    description: "Équipe de football universitaire",
    coverImage: "/placeholder.svg?height=200&width=400",
  },
];

const forums = [
  {
    id: 1,
    name: "Forum Général",
    avatar: "/placeholder.svg?height=32&width=32",
    members: 1247,
    status: "public",
    category: "Général",
    description: "Forum de discussion générale pour tous les étudiants",
  },
  {
    id: 2,
    name: "Recherche & Innovation",
    avatar: "/placeholder.svg?height=32&width=32",
    members: 234,
    status: "privé",
    category: "Académique",
    description: "Forum dédié aux projets de recherche et innovation",
  },
  {
    id: 3,
    name: "Entraide Cours",
    avatar: "/placeholder.svg?height=32&width=32",
    members: 567,
    status: "public",
    category: "Académique",
    description: "Forum d'entraide pour les cours et examens",
  },
];

export function GroupsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("salons");

  const getStatusBadge = (
    status: string,
    type: "salon" | "forum" = "salon"
  ) => {
    if (type === "salon") {
      switch (status) {
        case "actif":
          return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
        case "suspendu":
          return <Badge className="bg-red-100 text-red-800">Suspendu</Badge>;
        default:
          return <Badge variant="secondary">{status}</Badge>;
      }
    } else {
      switch (status) {
        case "public":
          return (
            <Badge className="bg-blue-100 text-blue-800">
              <Unlock className="h-3 w-3 mr-1" />
              Public
            </Badge>
          );
        case "privé":
          return (
            <Badge className="bg-gray-100 text-gray-800">
              <Lock className="h-3 w-3 mr-1" />
              Privé
            </Badge>
          );
        default:
          return <Badge variant="secondary">{status}</Badge>;
      }
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      Académique: "bg-purple-100 text-purple-800",
      Social: "bg-pink-100 text-pink-800",
      Sport: "bg-orange-100 text-orange-800",
      Technologie: "bg-blue-100 text-blue-800",
      Général: "bg-gray-100 text-gray-800",
    };
    return (
      <Badge
        className={
          colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
        }
      >
        {category}
      </Badge>
    );
  };

  const filteredSalons = salons.filter((salon) => {
    const matchesSearch = salon.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || salon.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || salon.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredForums = forums.filter((forum) => {
    const matchesSearch = forum.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || forum.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion des groupes
        </h1>
        <p className="text-muted-foreground">
          Gérez les salons de discussion et forums de votre réseau social
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="salons">Salons de discussion</TabsTrigger>
          <TabsTrigger value="forums">Forums</TabsTrigger>
        </TabsList>

        <TabsContent value="salons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Salons de discussion</CardTitle>
              <CardDescription>
                {filteredSalons.length} salon(s) trouvé(s)
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
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrer par catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    <SelectItem value="Académique">Académique</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                    <SelectItem value="Sport">Sport</SelectItem>
                    <SelectItem value="Technologie">Technologie</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="suspendu">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Salon</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Membres</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSalons.map((salon) => (
                      <TableRow key={salon.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage
                                src={salon.avatar || "/placeholder.svg"}
                              />
                              <AvatarFallback>
                                {salon.name.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{salon.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getCategoryBadge(salon.category)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            {salon.members}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(salon.status, "salon")}
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
                                onClick={() =>
                                  setSelectedGroup({ ...salon, type: "salon" })
                                }
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Voir les détails
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Ban className="h-4 w-4 mr-2" />
                                Suspendre
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
        </TabsContent>

        <TabsContent value="forums" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Forums</CardTitle>
              <CardDescription>
                {filteredForums.length} forum(s) trouvé(s)
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="privé">Privé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Forum</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Membres</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredForums.map((forum) => (
                      <TableRow key={forum.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage
                                src={forum.avatar || "/placeholder.svg"}
                              />
                              <AvatarFallback>
                                {forum.name.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{forum.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getCategoryBadge(forum.category)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            {forum.members}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(forum.status, "forum")}
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
                                onClick={() =>
                                  setSelectedGroup({ ...forum, type: "forum" })
                                }
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Voir les détails
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Ban className="h-4 w-4 mr-2" />
                                Suspendre
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
        </TabsContent>
      </Tabs>

      {/* Sheet pour les détails du groupe */}
      {selectedGroup && (
        <Sheet
          open={!!selectedGroup}
          onOpenChange={() => setSelectedGroup(null)}
        >
          <SheetContent className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Détails du {selectedGroup.type}</SheetTitle>
              <SheetDescription>
                Informations détaillées de {selectedGroup.name}
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-6 mt-6">
              {selectedGroup.coverImage && (
                <div className="aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={selectedGroup.coverImage || "/placeholder.svg"}
                    alt="Couverture"
                    className="w-full h-full object-cover"
                    width={400}
                    height={200}
                  />
                </div>
              )}

              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={selectedGroup.avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback>
                    {selectedGroup.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedGroup.name}
                  </h3>
                  <div className="flex gap-2 mt-2">
                    {selectedGroup.category &&
                      getCategoryBadge(selectedGroup.category)}
                    {getStatusBadge(selectedGroup.status, selectedGroup.type)}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Informations</h4>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Membres:</span>
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {selectedGroup.members}
                      </span>
                    </div>
                    {selectedGroup.category && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Catégorie:
                        </span>
                        <span>{selectedGroup.category}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedGroup.description && (
                  <div>
                    <h4 className="font-medium">Description</h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {selectedGroup.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Ban className="h-4 w-4 mr-2" />
                      Suspendre le {selectedGroup.type}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Suspendre le {selectedGroup.type}
                      </DialogTitle>
                      <DialogDescription>
                        Êtes-vous sûr de vouloir suspendre {selectedGroup.name}{" "}
                        ? Cette action peut être annulée.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Annuler</Button>
                      <Button variant="destructive">Suspendre</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Accéder au profil du {selectedGroup.type}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
