"use client";

import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { PostForm, PostFormRef } from "./post-form";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId?: string;
  onSuccess?: () => void;
}

/**
 * Modal pour la création d'une publication
 * Contient un formulaire de publication avec gestion d'état
 */
export function PostModal({
  isOpen,
  onClose,
  groupId,
  onSuccess,
}: PostModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<PostFormRef | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Gestion de la soumission du formulaire
  const handleSubmitPost = () => {
    if (formRef.current && formRef.current.isValid()) {
      formRef.current.submit();
    }
  };

  // Fermeture de la modal après succès
  const handleSuccess = () => {
    setIsExpanded(false);
    if (onSuccess) {
      onSuccess();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Créer une publication</DialogTitle>
        </DialogHeader>

        <div className="p-4">
          <PostForm
            onSubmitSuccess={handleSuccess}
            isExpanded={isExpanded}
            handleFocus={() => setIsExpanded(true)}
            formRef={formRef}
            setIsSubmitting={setIsSubmitting}
            /*  groupId={groupId} */
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
      </DialogContent>
    </Dialog>
  );
}
