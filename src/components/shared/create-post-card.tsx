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
import { EventForm, EventFormRef } from "./event/event-form";
import { Collaborator } from "./types";

export function CreatePostCard() {
  // États généraux
  const [isPostOrEvent, setIsPostOrEvent] = useState<"post" | "event">("post");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCollaboratorModalOpen, setIsCollaboratorModalOpen] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0); // État pour forcer le rendu

  // Références aux formulaires
  const postFormRef = useRef<PostFormRef | null>(null);
  const eventFormRef = useRef<EventFormRef | null>(null);

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
    } else if (isPostOrEvent === "event" && eventFormRef.current) {
      eventFormRef.current.reset();
    }
    setIsPostOrEvent("post");
    setIsExpanded(false);
  };

  // Gestion de la soumission
  const handleSubmit = async () => {
    if (isPostOrEvent === "post" && postFormRef.current) {
      await postFormRef.current.submit();
    } else if (isPostOrEvent === "event" && eventFormRef.current) {
      await eventFormRef.current.submit();
    }
  };

  // Vérification si le formulaire est valide
  const isFormValid = useCallback((): boolean => {
    if (isPostOrEvent === "post" && postFormRef.current) {
      return postFormRef.current.isValid();
    } else if (isPostOrEvent === "event" && eventFormRef.current) {
      return eventFormRef.current.isValid();
    }
    return false;
  }, [isPostOrEvent]); // Dépend du forceUpdate pour se mettre à jour

  // Gestion du succès après soumission
  const handleSubmitSuccess = () => {
    setIsExpanded(false);
    setIsPostOrEvent("post");
    /*  setIsSubmitting(false); */
  };
  /*   console.log("isformValide", isFormValid()); */
  return (
    <div className="mb-6 overflow-hidden rounded-xl border bg-card shadow-sm transition-all">
      <div className="p-4">
        <div className="flex gap-3">
          <Avatar className="size-10">
            <AvatarImage
              src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="User"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>

          {/* Zone de contenu qui change en fonction de post/event */}
          <div className="flex-1">
            {isPostOrEvent === "post" ? (
              <PostForm
                /* onCancel={handleCancel} */
                onSubmitSuccess={handleSubmitSuccess}
                isExpanded={isExpanded}
                handleFocus={handleFocus}
                formRef={postFormRef}
                onFormChange={handleFormChange}
                setIsSubmitting={setIsSubmitting}
              />
            ) : (
              <EventForm
                /*  onCancel={handleCancel} */
                onSubmitSuccess={handleSubmitSuccess}
                isCollaboratorModalOpen={isCollaboratorModalOpen}
                setIsCollaboratorModalOpen={setIsCollaboratorModalOpen}
                formRef={eventFormRef}
                onFormChange={handleFormChange}
                setIsSubmitting={setIsSubmitting}
              />
            )}
          </div>
        </div>
      </div>

      {/* Barre d'outils et boutons d'action */}
      {isExpanded && (
        <div className="border-t p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              <Button
                className={`${isPostOrEvent === "post" ? "bg-accent text-primary-foreground" : ""}`}
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
                className={`${isPostOrEvent === "event" ? "bg-accent text-primary-foreground" : ""}`}
                onClick={() => setIsPostOrEvent("event")}
                variant="ghost"
                size="sm"
                type="button"
              >
                <Calendar className="mr-1 size-4" />
                Événement
              </Button>
            </div>
            <div className="flex gap-2">
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
                disabled={!isFormValid() || isSubmitting}
                className="bg-primary text-white hover:bg-primary/90"
                type="button"
              >
                {isSubmitting
                  ? isPostOrEvent === "post"
                    ? "Publication..."
                    : "Création..."
                  : isPostOrEvent === "post"
                    ? "Publier"
                    : "Publier l'événement"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
