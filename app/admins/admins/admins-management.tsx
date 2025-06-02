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
  UserMinus,
  Settings,
  Shield,
  ShieldCheck,
} from "lucide-react";

const admins = [
  {
    id: 1,
    name: "Sophie Bernard",
    email: "sophie.bernard@univ.fr",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "SUPERADMIN",
    permissions: ["all"],
    dateNomination: "2024-01-01",
  },
  {
    id: 2,
    name: "Lucas Petit",
    email: "lucas.petit@univ.fr",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "ADMIN",
    permissions: ["create_group", "create_event", "create_post"],
    dateNomination: "2024-02-15",
  },
  {
    id: 3,
    name: "Emma Roux",
    email: "emma.roux@univ.fr",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "ADMIN",
    permissions: ["create_user", "create_group"],
    dateNomination: "2024-03-10",
  },
];

const allPermissions = [
  { id: "create_group", label: "Créer des groupes" },
  { id: "create_event", label: "Créer des événements" },
  { id: "create_post", label: "Créer des publications" },
  { id: "create_user", label: "Créer des utilisateurs" },
  { id: "all", label: "Toutes les permissions" },
];

export function AdminsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return (
          <Badge className="bg-red-100 text-red-800">
            <ShieldCheck className="h-3 w-3 mr-1" />
            SUPERADMIN
          </Badge>
        );
      case "ADMIN":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Shield className="h-3 w-3 mr-1" />
            ADMIN
          </Badge>
        );
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const getPermissionLabel = (permissionId: string) => {
    const permission = allPermissions.find((p) => p.id === permissionId);
    return permission ? permission.label : permissionId;
  };

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || admin.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion des admins
        </h1>
        <p className="text-muted-foreground">
          Gérez les administrateurs de votre réseau social universitaire
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des administrateurs</CardTitle>
          <CardDescription>
            {filteredAdmins.length} administrateur(s) trouvé(s)
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
                <SelectItem value="ADMIN">ADMIN</SelectItem>
                <SelectItem value="SUPERADMIN">SUPERADMIN</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Administrateur</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage
                            src={admin.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {admin.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{admin.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{getRoleBadge(admin.role)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {admin.permissions.slice(0, 2).map((permission) => (
                          <Badge
                            key={permission}
                            variant="outline"
                            className="text-xs"
                          >
                            {getPermissionLabel(permission)}
                          </Badge>
                        ))}
                        {admin.permissions.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{admin.permissions.length - 2}
                          </Badge>
                        )}
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
                            onClick={() => setSelectedAdmin(admin)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Voir le profil
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Settings className="h-4 w-4 mr-2" />
                            Modifier permissions
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <UserMinus className="h-4 w-4 mr-2" />
                            Révoquer droits
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

      {/* Sheet pour le profil admin */}
      {selectedAdmin && (
        <Sheet
          open={!!selectedAdmin}
          onOpenChange={() => setSelectedAdmin(null)}
        >
          <SheetContent className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Profil administrateur</SheetTitle>
              <SheetDescription>
                Informations détaillées de {selectedAdmin.name}
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-6 mt-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={selectedAdmin.avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback>
                    {selectedAdmin.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedAdmin.name}
                  </h3>
                  <p className="text-muted-foreground">{selectedAdmin.email}</p>
                  <div className="flex gap-2 mt-2">
                    {getRoleBadge(selectedAdmin.role)}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Informations générales</h4>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Date de nomination:
                      </span>
                      <span>{selectedAdmin.dateNomination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rôle:</span>
                      <span>{selectedAdmin.role}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium">Permissions</h4>
                  <div className="mt-2 space-y-2">
                    {selectedAdmin.permissions.map((permission) => (
                      <div
                        key={permission}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox checked={true} disabled />
                        <span className="text-sm">
                          {getPermissionLabel(permission)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Modifier les permissions
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Modifier les permissions</DialogTitle>
                      <DialogDescription>
                        Sélectionnez les permissions pour {selectedAdmin.name}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {allPermissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={permission.id}
                            checked={selectedAdmin.permissions.includes(
                              permission.id
                            )}
                          />
                          <label htmlFor={permission.id} className="text-sm">
                            {permission.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Annuler</Button>
                      <Button>Sauvegarder</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <UserMinus className="h-4 w-4 mr-2" />
                      Révoquer les droits d'admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Révoquer les droits</DialogTitle>
                      <DialogDescription>
                        Êtes-vous sûr de vouloir révoquer les droits
                        d'administrateur de {selectedAdmin.name} ?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Annuler</Button>
                      <Button variant="destructive">Révoquer</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
