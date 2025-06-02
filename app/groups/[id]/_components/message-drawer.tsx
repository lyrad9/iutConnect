"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
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
import { Input } from "@/src/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { PaperclipIcon, SendIcon, SmileIcon } from "lucide-react";
import { ScrollArea } from "@/src/components/ui/scroll-area";

interface MessageDrawerProps {
  recipient: {
    name: string;
    avatar: string;
    status?: string;
  };
  children: React.ReactNode;
}

export function MessageDrawer({ recipient, children }: MessageDrawerProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      // Logique pour envoyer le message
      console.log("Message envoyé:", message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="h-[80vh] max-h-[80vh]">
        <DrawerHeader className="border-b">
          <div className="flex items-center">
            <Avatar className="size-10">
              <AvatarImage
                src={recipient.avatar || "/placeholder.svg"}
                alt={recipient.name}
              />
              <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <DrawerTitle>{recipient.name}</DrawerTitle>
              <DrawerDescription>
                {recipient.status || "En ligne"}
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>
        <ScrollArea className="flex-1 p-4 h-[calc(80vh-180px)]">
          <div className="space-y-4">
            <Message
              content="Bonjour ! Comment puis-je vous aider concernant le groupe ?"
              timestamp="14:30"
              isMe={false}
              sender={recipient.name}
              avatar={recipient.avatar}
            />

            <Message
              content="J'ai une question concernant le prochain événement du groupe. Pouvez-vous me donner plus de détails ?"
              timestamp="14:35"
              isMe={true}
            />

            <Message
              content="Bien sûr ! L'événement aura lieu ce vendredi à 18h dans le bâtiment des sciences, salle 305. Nous aurons une présentation sur l'intelligence artificielle suivie d'un atelier pratique."
              timestamp="14:37"
              isMe={false}
              sender={recipient.name}
              avatar={recipient.avatar}
            />

            <Message
              content="Parfait, merci pour ces informations ! Est-ce que je dois apporter mon ordinateur portable ?"
              timestamp="14:40"
              isMe={true}
            />

            <Message
              content="Oui, ce serait préférable pour participer à l'atelier pratique. N'hésitez pas si vous avez d'autres questions !"
              timestamp="14:42"
              isMe={false}
              sender={recipient.name}
              avatar={recipient.avatar}
            />
          </div>
        </ScrollArea>
        <DrawerFooter className="border-t pt-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <PaperclipIcon className="size-5" />
              <span className="sr-only">Joindre un fichier</span>
            </Button>
            <Input
              placeholder="Écrivez votre message..."
              className="flex-1"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button variant="ghost" size="icon">
              <SmileIcon className="size-5" />
              <span className="sr-only">Ajouter un emoji</span>
            </Button>
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              <SendIcon className="size-5" />
              <span className="sr-only">Envoyer</span>
            </Button>
          </div>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full mt-2">
              Fermer
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface MessageProps {
  content: string;
  timestamp: string;
  isMe: boolean;
  sender?: string;
  avatar?: string;
}

function Message({ content, timestamp, isMe, sender, avatar }: MessageProps) {
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div className={`flex gap-2 max-w-[80%] ${isMe && "flex-row-reverse"}`}>
        {!isMe && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatar || "/placeholder.svg"} alt={sender} />
            <AvatarFallback>{sender?.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        <div>
          {!isMe && <p className="text-xs font-medium mb-1">{sender}</p>}
          <div
            className={`rounded-lg p-3 ${isMe ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            <p className="text-sm">{content}</p>
          </div>
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {timestamp}
          </p>
        </div>
      </div>
    </div>
  );
}
