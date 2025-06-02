"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Search } from "lucide-react";

// Données simulées pour les contacts
const contacts = [
  {
    id: "1",
    name: "Alex Johnson",
    department: "Informatique",
    avatar: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Maria Rodriguez",
    department: "Sciences des données",
    avatar: "/placeholder.svg",
  },
  {
    id: "3",
    name: "James Wilson",
    department: "Génie électrique",
    avatar: "/placeholder.svg",
  },
  {
    id: "4",
    name: "Emily Chen",
    department: "Informatique",
    avatar: "/placeholder.svg",
  },
  {
    id: "5",
    name: "Michael Brown",
    department: "Mathématiques",
    avatar: "/placeholder.svg",
  },
  {
    id: "6",
    name: "Sophia Kim",
    department: "Intelligence artificielle",
    avatar: "/placeholder.svg",
  },
  {
    id: "7",
    name: "David Garcia",
    department: "Robotique",
    avatar: "/placeholder.svg",
  },
  {
    id: "8",
    name: "Olivia Taylor",
    department: "Informatique",
    avatar: "/placeholder.svg",
  },
];

export function InviteMemberDialog() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleContact = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleInvite = () => {
    // Logique pour envoyer les invitations
    console.log("Invitations envoyées à:", selectedContacts);
    setOpen(false);
    setSelectedContacts([]);
    setSearchQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Inviter</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Inviter des membres</DialogTitle>
          <DialogDescription>
            Recherchez et sélectionnez les personnes que vous souhaitez inviter
            à rejoindre ce groupe.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher par nom ou département..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Contacts ({filteredContacts.length})</Label>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent"
                  >
                    <Checkbox
                      id={`contact-${contact.id}`}
                      checked={selectedContacts.includes(contact.id)}
                      onCheckedChange={() => handleToggleContact(contact.id)}
                    />
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={contact.avatar || "/placeholder.svg"}
                        alt={contact.name}
                      />
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Label
                      htmlFor={`contact-${contact.id}`}
                      className="flex-1 cursor-pointer font-normal"
                    >
                      <div>{contact.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {contact.department}
                      </div>
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Aucun contact trouvé
                </p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleInvite}
            disabled={selectedContacts.length === 0}
          >
            Inviter ({selectedContacts.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
