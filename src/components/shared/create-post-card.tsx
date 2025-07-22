
"use client";
import React, { useState, useRef, useCallback } from "react";
import { Image as Photo, Calendar } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { PostForm, PostFormRef } from "./post/post-form";
import { EventModal } from "./event/event-modal";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserPermission } from "@/convex/schema";
import { SmartAvatar } from "./smart-avatar";

export function CreatePostCard() {
  // Récupérer l'utilisateur connecté pour vérifier s'il a le droit de créer un post
  const currentUser = useQuery(api.users?.currentUser);
  // États généraux
  const [isPostOrEvent, setIsPostOrEvent] = useState<"post" | "event">("post");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0); // État pour forcer le rendu

  // Référence au formulaire
  const postFormRef = useRef<PostFormRef | null>(null);

  // Gestion du focus
  const handleFocus = () => {
    setIsExpanded(true);
  };

  // Handler pour les changements de formulaire
  const handleFormChange = useCallback(() => {
    setForceUpdate((prev) => prev + 1);
  }, []);

  // Gestion de l'annulation
  const handleCancel = () => {
    if (isPostOrEvent === "post" && postFormRef.current) {
      postFormRef.current.reset();
    }
    setIsPostOrEvent("post");
    setIsExpanded(false);
  };

  // Ouvrir la modal d'événement
  const openEventModal = () => {
    setIsEventModalOpen(true);
  };

  // Gestion de la soumission
  const handleSubmit = async () => {
    console.log("submitPost");
    if (isPostOrEvent === "post" && postFormRef.current) {
      console.log("submitPostRef");
      await postFormRef.current.submit();
    }
  };

  // Vérification si le formulaire est valide
  const isFormValid = useCallback((): boolean => {
    if (isPostOrEvent === "post" && postFormRef.current) {
      return postFormRef.current.isValid();
    }
    return false;
  }, [isPostOrEvent]);

  // Gestion du succès après soumission
  const handleSubmitSuccess = () => {
    setIsExpanded(false);
    setIsPostOrEvent("post");
  };

  // Gérer la fermeture de la modal d'événement
  const handleEventModalClose = () => {
    setIsPostOrEvent("post");
    setIsEventModalOpen(false);
  };

  // Gérer le succès de création d'événement
  const handleEventCreationSuccess = () => {
    setIsExpanded(false);
    setIsPostOrEvent("post");
  };

  // Gérer le clic sur le bouton Événement
  const handleEventButtonClick = () => {
    setIsPostOrEvent("event");
    openEventModal();
  };
  if (
    currentUser?.role === "USER" &&
    // creer post et creer event
    !currentUser.permissions.includes("CREATE_POST") &&
    !currentUser.permissions.includes("CREATE_EVENT")
  ) {
    return null;
  }
  return (
    <>
      <div className="mb-6 overflow-hidden rounded-xl border bg-card shadow-sm transition-all">
        <div className="p-4">
          <div className="flex gap-3">
            <SmartAvatar
              avatar={currentUser?.profilePicture as string | undefined}
              name={${currentUser?.firstName} ${currentUser?.lastName}}
              size="md"
            />

            {/* Zone de contenu qui change en fonction de post/event */}
            <div className="flex-1">
              <PostForm
                onSubmitSuccess={handleSubmitSuccess}
                isExpanded={isExpanded}
                handleFocus={handleFocus}
                formRef={postFormRef}
                onFormChange={handleFormChange}
                setIsSubmitting={setIsSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Barre d'outils et boutons d'action */}
        {isExpanded && (
          <div className="border-t p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-2">
                <Button
                  className={${isPostOrEvent === "post" ? "bg-accent text-primary-foreground" : ""}}
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => {
                    setIsPostOrEvent("post");
                  }}
                >
                  <Photo className="mr-1 size-4" />
                  Photo
                </Button>
                <Button
                  className={${isPostOrEvent === "event" ? "bg-accent text-primary-foreground" : ""}}
                  onClick={handleEventButtonClick}
                  variant="ghost"
                  size="sm"
                  type="button"
                >
                  <Calendar className="mr-1 size-4" />
                  Événement
                </Button>
              </div>
              <div className="flex gap-2 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  type="button"
                  className="hover:bg-red-50 hover:text-red-600"
                >
                  Annuler
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={
                    !isFormValid() || (isPostOrEvent === "post" && isSubmitting)
                  }
                  className="bg-primary text-white hover:bg-primary/90"
                  type="button"
                >
                  {isSubmitting && isPostOrEvent === "post"
                    ? "Publication..."
                    : "Publier"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal pour la création d'événements */}
      <EventModal
        setIsPostOrEvent={setIsPostOrEvent}
        isOpen={isEventModalOpen}
        onClose={handleEventModalClose}
        onSuccess={handleEventCreationSuccess}
      />
    </>
  );
}