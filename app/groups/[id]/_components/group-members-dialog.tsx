"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
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
import { Search, UserPlus, Shield, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

// Données simulées pour les membres
const members = [
  {
    id: "1",
    name: "Prof. Alan Turing",
    role: "admin",
    department: "Département d'Informatique",
    avatar: "/placeholder.svg",
    isOnline: true,
  },
  {
    id: "2",
    name: "Dr. Ada Lovelace",
    role: "admin",
    department: "Département d'Informatique",
    avatar: "/placeholder.svg",
    isOnline: false,
  },
  {
    id: "3",
    name: "Alex Johnson",
    role: "member",
    department: "Informatique",
    avatar: "/placeholder.svg",
    isOnline: true,
  },
  {
    id: "4",
    name: "Maria Rodriguez",
    role: "member",
    department: "Sciences des données",
    avatar: "/placeholder.svg",
    isOnline: true,
  },
  {
    id: "5",
    name: "James Wilson",
    role: "member",
    department: "Génie électrique",
    avatar: "/placeholder.svg",
    isOnline: false,
  },
  {
    id: "6",
    name: "Emily Chen",
    role: "member",
    department: "Informatique",
    avatar: "/placeholder.svg",
    isOnline: false,
  },
  {
    id: "7",
    name: "Michael Brown",
    role: "member",
    department: "Mathématiques",
    avatar: "/placeholder.svg",
    isOnline: true,
  },
  {
    id: "8",
    name: "Sophia Kim",
    role: "member",
    department: "Intelligence artificielle",
    avatar: "/placeholder.svg",
    isOnline: false,
  },
  {
    id: "9",
    name: "David Garcia",
    role: "member",
    department: "Robotique",
    avatar: "/placeholder.svg",
    isOnline: true,
  },
  {
    id: "10",
    name: "Olivia Taylor",
    role: "member",
    department: "Informatique",
    avatar: "/placeholder.svg",
    isOnline: false,
  },
  // Ajoutez plus de membres pour tester le défilement
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `${i + 11}`,
    name: `Membre ${i + 11}`,
    role: "member",
    department: "Divers",
    avatar: "/placeholder.svg",
    isOnline: Math.random() > 0.5,
  })),
];

export function GroupMembersDialog() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const admins = members.filter((member) => member.role === "admin");
  const regularMembers = members.filter((member) => member.role === "member");

  const filteredMembers = [...admins, ...regularMembers].filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Voir tous les membres
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Membres du groupe</DialogTitle>
          <DialogDescription>
            {members.length} membres au total • {admins.length} administrateurs
          </DialogDescription>
        </DialogHeader>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un membre..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs defaultValue="all" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="admins">Administrateurs</TabsTrigger>
            <TabsTrigger value="online">En ligne</TabsTrigger>
          </TabsList>
          <TabsContent
            value="all"
            className="flex-1 overflow-hidden flex flex-col"
          >
            <div className="overflow-y-auto pr-2 flex-1">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <MemberItem key={member.id} member={member} />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Aucun membre trouvé
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent
            value="admins"
            className="flex-1 overflow-hidden flex flex-col"
          >
            <div className="overflow-y-auto pr-2 flex-1">
              {admins
                .filter(
                  (admin) =>
                    admin.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    admin.department
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                )
                .map((admin) => (
                  <MemberItem key={admin.id} member={admin} />
                ))}
            </div>
          </TabsContent>
          <TabsContent
            value="online"
            className="flex-1 overflow-hidden flex flex-col"
          >
            <div className="overflow-y-auto pr-2 flex-1">
              {filteredMembers
                .filter((member) => member.isOnline)
                .map((member) => (
                  <MemberItem key={member.id} member={member} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fermer
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Inviter des membres
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MemberItem({ member }: { member: (typeof members)[0] }) {
  return (
    <div className="flex items-center justify-between py-2 px-1 border-b last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="size-10">
            <AvatarImage
              src={member.avatar || "/placeholder.svg"}
              alt={member.name}
            />
            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {member.isOnline && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-background"></span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium truncate">{member.name}</p>
            {member.role === "admin" && (
              <Shield className="h-3.5 w-3.5 text-primary" />
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {member.department}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          Message
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Plus d&apos;options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Voir le profil</DropdownMenuItem>
            {member.role !== "admin" && (
              <DropdownMenuItem>Promouvoir administrateur</DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-destructive">
              Retirer du groupe
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
