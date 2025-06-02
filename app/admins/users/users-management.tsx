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
import { Checkbox } from "@/src/components/ui/checkbox";
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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/src/components/ui/drawer";
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
  UserCheck,
  UserX,
  Shield,
  MessageSquare,
  Eye,
  Send,
} from "lucide-react";
import { Textarea } from "@/src/components/ui/textarea";

const users = [
  {
    id: 1,
    name: "Alice Martin",
    email: "alice.martin@univ.fr",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "actif",
    role: "Étudiant",
    matricule: "ETU2024001",
    dateInscription: "2024-01-15",
    filiere: "Informatique",
    classe: "L3",
    bio: "Passionnée par le développement web et l'intelligence artificielle.",
  },
  {
    id: 2,
    name: "Pierre Dubois",
    email: "pierre.dubois@univ.fr",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "actif",
    role: "Professeur",
    matricule: "PROF2024001",
    dateInscription: "2024-01-10",
    departement: "Informatique",
    bio: "Professeur en algorithmique et structures de données.",
  },
  {
    id: 3,
    name: "Marie Leroy",
    email: "marie.leroy@univ.fr",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "en attente",
    role: "Étudiant",
    matricule: "ETU2024002",
    dateInscription: "2024-01-20",
    filiere: "Mathématiques",
    classe: "M1",
    bio: "Étudiante en mathématiques appliquées.",
  },
  {
    id: 4,
    name: "Jean Moreau",
    email: "jean.moreau@univ.fr",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "inactif",
    role: "Staff",
    matricule: "STAFF2024001",
    dateInscription: "2024-01-05",
    service: "Administration",
    bio: "Responsable des services administratifs.",
  },
];

export function UsersManagement() {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messageContent, setMessageContent] = useState("");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSelectUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length
        ? []
        : filteredUsers.map((user) => user.id)
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "actif":
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case "inactif":
        return <Badge className="bg-red-100 text-red-800">Inactif</Badge>;
      case "en attente":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Étudiant":
        return (
          <Badge variant="outline" className="text-blue-600">
            Étudiant
          </Badge>
        );
      case "Professeur":
        return (
          <Badge variant="outline" className="text-green-600">
            Professeur
          </Badge>
        );
      case "Staff":
        return (
          <Badge variant="outline" className="text-purple-600">
            Staff
          </Badge>
        );
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion des utilisateurs
        </h1>
        <p className="text-muted-foreground">
          Gérez les utilisateurs de votre réseau social universitaire
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            {filteredUsers.length} utilisateur(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtres et recherche */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="Étudiant">Étudiant</SelectItem>
                <SelectItem value="Professeur">Professeur</SelectItem>
                <SelectItem value="Staff">Staff</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="inactif">Inactif</SelectItem>
                <SelectItem value="en attente">En attente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions en lot */}
          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">
                {selectedUsers.length} utilisateur(s) sélectionné(s)
              </span>
              <Button size="sm" variant="outline">
                <UserCheck className="h-4 w-4 mr-2" />
                Activer
              </Button>
              <Button size="sm" variant="outline">
                <UserX className="h-4 w-4 mr-2" />
                Désactiver
              </Button>
              <Button size="sm" variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Promouvoir Admin
              </Button>
              <Button size="sm" variant="outline">
                <Send className="h-4 w-4 mr-2" />
                Envoyer Email
              </Button>
            </div>
          )}

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedUsers.length === filteredUsers.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Date d&apos;inscription</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleSelectUser(user.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage
                            src={user.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {user.matricule}
                    </TableCell>
                    <TableCell>{user.dateInscription}</TableCell>
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
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Voir le profil
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Valider
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserX className="h-4 w-4 mr-2" />
                            Suspendre
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="h-4 w-4 mr-2" />
                            Promouvoir Admin
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

      {/* Sheet pour le profil utilisateur */}
      {selectedUser && (
        <Sheet open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <SheetContent className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Profil utilisateur</SheetTitle>
              <SheetDescription>
                Informations détaillées de {selectedUser.name}
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-6 mt-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={selectedUser.avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback>
                    {selectedUser.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    {getStatusBadge(selectedUser.status)}
                    {getRoleBadge(selectedUser.role)}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Informations générales</h4>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Matricule:</span>
                      <span className="font-mono">
                        {selectedUser.matricule}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Date d&apos;inscription:
                      </span>
                      <span>{selectedUser.dateInscription}</span>
                    </div>
                    {selectedUser.filiere && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Filière:</span>
                        <span>{selectedUser.filiere}</span>
                      </div>
                    )}
                    {selectedUser.classe && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Classe:</span>
                        <span>{selectedUser.classe}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedUser.bio && (
                  <div>
                    <h4 className="font-medium">Biographie</h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {selectedUser.bio}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      Suspendre l&apos;utilisateur
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Suspendre l&apos;utilisateur</DialogTitle>
                      <DialogDescription>
                        Êtes-vous sûr de vouloir suspendre {selectedUser.name} ?
                        Cette action peut être annulée.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Annuler</Button>
                      <Button variant="destructive">Suspendre</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Envoyer un message
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>
                        Envoyer un message à {selectedUser.name}
                      </DrawerTitle>
                      <DrawerDescription>
                        Rédigez votre message ci-dessous
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4">
                      <Textarea
                        placeholder="Tapez votre message ici..."
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    <DrawerFooter>
                      <Button>Envoyer</Button>
                      <DrawerClose asChild>
                        <Button variant="outline">Annuler</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>

                <Button variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Accéder au profil
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
