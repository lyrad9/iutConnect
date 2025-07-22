"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { PostForm, PostFormRef } from "./post/post-form";
import { EventModal } from "./event/event-modal";
import { FileText, Calendar, Check } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface CreateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateContentModal({
  isOpen,
  onClose,
}: CreateContentModalProps) {
  const [contentType, setContentType] = useState<"post" | "event">("post");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = React.useRef<PostFormRef | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const currentUser = useQuery(api.users.currentUser);

  // Vérifier si l'utilisateur a les permissions nécessaires
  const canCreatePost =
    currentUser?.permissions.includes("CREATE_POST") ||
    currentUser?.permissions.includes("ALL") ||
    currentUser?.role === "ADMIN" ||
    currentUser?.role === "SUPERADMIN";

  const canCreateEvent =
    currentUser?.permissions.includes("CREATE_EVENT") ||
    currentUser?.permissions.includes("ALL") ||
    currentUser?.role === "ADMIN" ||
    currentUser?.role === "SUPERADMIN";

  // Si l'utilisateur n'a aucune permission, on ne devrait même pas pouvoir ouvrir cette modal
  const hasPermissions = canCreatePost || canCreateEvent;

  // Si l'utilisateur n'a que l'une des permissions, on sélectionne celle-ci par défaut
  React.useEffect(() => {
    if (canCreatePost && !canCreateEvent) {
      setContentType("post");
    } else if (!canCreatePost && canCreateEvent) {
      setContentType("event");
    }
  }, [canCreatePost, canCreateEvent]);

  const handleSubmitPost = () => {
    if (formRef.current && formRef.current.isValid()) {
      formRef.current.submit();
    }
  };

  const handleSuccess = () => {
    setIsExpanded(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Créer un contenu</DialogTitle>
        </DialogHeader>

        {!hasPermissions ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">
              Vous n&apos;avez pas les permissions nécessaires pour créer du
              contenu.
            </p>
          </div>
        ) : (
          <>
            {/* Sélection du type de contenu */}
            <div className="flex border-b">
              <Button
                variant="ghost"
                className={cn(
                  "flex-1 rounded-none border-b-2 border-transparent p-4",
                  contentType === "post" && "border-primary"
                )}
                onClick={() => setContentType("post")}
                disabled={!canCreatePost || isSubmitting}
              >
                <FileText className="mr-2 h-5 w-5" />
                Publication
                {contentType === "post" && <Check className="ml-2 h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "flex-1 rounded-none border-b-2 border-transparent p-4",
                  contentType === "event" && "border-primary"
                )}
                onClick={() => setContentType("event")}
                disabled={!canCreateEvent || isSubmitting}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Événement
                {contentType === "event" && <Check className="ml-2 h-4 w-4" />}
              </Button>
            </div>

            {/* Formulaire selon le type */}
            {contentType === "post" ? (
              <div className="p-4">
                <PostForm
                  onSubmitSuccess={handleSuccess}
                  isExpanded={isExpanded}
                  handleFocus={() => setIsExpanded(true)}
                  formRef={formRef}
                  setIsSubmitting={setIsSubmitting}
                />
                {isExpanded && (
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsExpanded(false)}
                      disabled={isSubmitting}
                    >
                      Annuler
                    </Button>
                    <Button onClick={handleSubmitPost} disabled={isSubmitting}>
                      Publier
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <EventModal
                isOpen={true}
                onClose={onClose}
                onSuccess={handleSuccess}
                setIsPostOrEvent={setContentType}
              />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
