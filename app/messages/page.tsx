"use client";

import React, { useState } from "react";
import {
  Search,
  Edit,
  Phone,
  Video,
  Info,
  PaperclipIcon,
  MessageSquare,
  Smile,
  SendHorizontal,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { cn } from "@/src/lib/utils";
import { mockUsers } from "@/src/components/utils/const/mock-data";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: string;
  read: boolean;
}

// Helper function to generate mock messages
const generateMessages = (contactId: string): Message[] => {
  const isEven = parseInt(contactId.replace("user", "")) % 2 === 0;

  return [
    {
      id: `msg1-${contactId}`,
      content: isEven
        ? "Hey, how's your project coming along?"
        : "Did you see the announcement about the event next week?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      sender: contactId,
      read: true,
    },
    {
      id: `msg2-${contactId}`,
      content: "I'll be in the library studying for the exam. Want to join?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      sender: "user1", // current user
      read: true,
    },
    {
      id: `msg3-${contactId}`,
      content: isEven
        ? "Sure, I'll meet you there in about an hour!"
        : "Thanks for sharing the notes from yesterday's lecture!",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      sender: contactId,
      read: true,
    },
    {
      id: `msg4-${contactId}`,
      content: isEven
        ? "By the way, are you going to the campus event this weekend?"
        : "Have you started working on the group assignment yet?",
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      sender: contactId,
      read: false,
    },
  ];
};

export default function MessagesPage() {
  const [activeContact, setActiveContact] = useState(mockUsers[1]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    user2: generateMessages("user2"),
    user3: generateMessages("user3"),
    user4: generateMessages("user4"),
    user5: generateMessages("user5"),
  });

  const filteredContacts = mockUsers
    .slice(1)
    .filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      timestamp: new Date().toISOString(),
      sender: "user1", // current user
      read: true,
    };

    setMessages((prev) => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), newMsg],
    }));

    setNewMessage("");
  };

  const getLastMessage = (userId: string) => {
    const userMessages = messages[userId];
    return userMessages && userMessages.length > 0
      ? userMessages[userMessages.length - 1]
      : null;
  };

  const getUnreadCount = (userId: string) => {
    return (
      messages[userId]?.filter((msg) => !msg.read && msg.sender !== "user1")
        .length || 0
    );
  };

  return (
    <div className="sticky top-14 max-h-[calc(100svh-3.5rem)] overflow-x-hidden scrollbar-hide flex h-screen w-full flex-col border-l border-r border-muted">
      <div className="sticky top-0 z-20 border-b px-6 py-6">
        <div className=" flex items-center">
          <h1 className="text-xl lg:text-2xl font-semibold">Messages</h1>
        </div>
      </div>
      <div className="flex max-lg:flex-col flex-1 overflow-auto">
        {/* Contacts sidebar */}
        <div className="h-full sticky top-0 lg:flex max-lg:w-full w-2/5 flex-col border-r border-muted py-3">
          <div className="max-lg:z-20 max-lg:sticky max-lg:top-0 flex w-full flex-col gap-4 mb-4 px-6 ">
            <div className="flex items-center justify-between text-lg font-bold">
              <div>Mes conversations</div>
              <Button variant="ghost" size="icon">
                <Edit className="size-5" />
                <span className="sr-only">New message</span>
              </Button>
              {/* <UserListDialog /> */}
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="max-lg:hidden flex-1 overflow-y-auto py-4 px-1 max-h-[calc(100vh-4rem)] scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/30 pr-2">
            <div className="space-y-1 p-2 px-4">
              {filteredContacts.map((contact) => {
                const lastMessage = getLastMessage(contact.id);
                const unreadCount = getUnreadCount(contact.id);

                return (
                  <button
                    key={contact.id}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors",
                      activeContact.id === contact.id
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted"
                    )}
                    onClick={() => setActiveContact(contact)}
                  >
                    <Avatar className="size-10">
                      <AvatarImage src={contact.avatarUrl} alt={contact.name} />
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{contact.name}</span>
                        {lastMessage && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(lastMessage.timestamp).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        )}
                      </div>
                      {lastMessage && (
                        <div className="flex items-center justify-between overflow-hidden">
                          <p className="overflow-hidden gap-2 text-ellipsis whitespace-nowrap text-sm text-muted-foreground">
                            {lastMessage.sender === "user1" ? "You: " : ""}
                            {lastMessage.content}
                          </p>
                          {unreadCount > 0 && (
                            <span className="flex-shrink-0 ml-2 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Conversation */}
        <div className="flex h-full w-full flex-col lg:w-3/5">
          {/*  <div className="sticky top-0 z-10 w-full"> */}
          {activeContact ? (
            <>
              <div className="sticky top-0 z-10 w-full">
                <div className="flex items-center justify-between border-b px-6 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarImage
                        src={activeContact.avatarUrl}
                        alt={activeContact.name}
                      />
                      <AvatarFallback>
                        {activeContact.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{activeContact.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Active now
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon">
                      <Phone className="size-5" />
                      <span className="sr-only">Call</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="size-5" />
                      <span className="sr-only">Video call</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Info className="size-5" />
                      <span className="sr-only">Info</span>
                    </Button>
                  </div>
                </div>
              </div>
              <ScrollArea className="flex-1 p-0 overflow-hidden">
                <div className="space-y-4 px-3 py-4">
                  {messages[activeContact.id]?.map((message, index) => {
                    const isSentByMe = message.sender === "user1";

                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex",
                          isSentByMe ? "justify-end" : "justify-start"
                        )}
                      >
                        <div className="flex items-end gap-2">
                          {!isSentByMe &&
                            index > 0 &&
                            messages[activeContact.id][index - 1].sender !==
                              message.sender && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={activeContact.avatarUrl}
                                  alt={activeContact.name}
                                />
                                <AvatarFallback>
                                  {activeContact.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            )}

                          {!isSentByMe &&
                            (index === 0 ||
                              messages[activeContact.id][index - 1].sender ===
                                "user1") && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={activeContact.avatarUrl}
                                  alt={activeContact.name}
                                />
                                <AvatarFallback>
                                  {activeContact.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            )}

                          <div
                            className={cn(
                              "max-w-[80%] rounded-2xl px-4 py-2",
                              isSentByMe
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            )}
                          >
                            {/* Contenu du message */}
                            <p className="text-sm">{message.content}</p>
                            {/* Heure du message */}
                            <div
                              className={cn(
                                "mt-1 text-xs",
                                isSentByMe
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground"
                              )}
                            >
                              {new Date(message.timestamp).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                          </div>

                          {/* Avatar de l'expéditeur */}
                          {isSentByMe &&
                            index > 0 &&
                            messages[activeContact.id][index - 1].sender !==
                              message.sender && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={mockUsers[0].avatarUrl}
                                  alt="You"
                                />
                                <AvatarFallback>You</AvatarFallback>
                              </Avatar>
                            )}

                          {isSentByMe &&
                            (index === 0 ||
                              messages[activeContact.id][index - 1].sender !==
                                "user1") && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={mockUsers[0].avatarUrl}
                                  alt="You"
                                />
                                <AvatarFallback>You</AvatarFallback>
                              </Avatar>
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
              <div className="sticky bottom-0 z-10 w-full border-t p-4">
                <div className="flex items-end gap-2">
                  <Button variant="outline" size="icon" className="shrink-0">
                    <PaperclipIcon className="size-5" />
                    <span className="sr-only">Attach file</span>
                  </Button>
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="min-h-[60px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Smile className="size-5" />
                    <span className="sr-only">Emoji</span>
                  </Button>
                  <Button
                    size="icon"
                    className="shrink-0"
                    onClick={handleSendMessage}
                  >
                    <SendHorizontal className="size-5" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-4">
              <div className="rounded-full bg-primary/10 p-6">
                <MessageSquare className="size-10 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Your Messages</h3>
              <p className="mt-2 text-center text-muted-foreground">
                Select a conversation or start a new one
              </p>
              <Button className="mt-4">New Conversation</Button>
            </div>
          )}
          {/*  </div> */}
        </div>
      </div>
    </div>
  );
}
