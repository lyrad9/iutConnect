"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";
import { Id } from "@/convex/_generated/dataModel";

// Types pour le contexte
type GroupModalContextType = {
  // État pour la modale de suppression de groupe
  isDeleteModalOpen: boolean;
  groupIdToDelete: Id<"forums"> | null;
  openDeleteModal: (groupId: Id<"forums">) => void;
  closeDeleteModal: () => void;

  // État pour la modale de sortie de groupe
  isLeaveModalOpen: boolean;
  groupIdToLeave: Id<"forums"> | null;
  openLeaveModal: (groupId: Id<"forums">) => void;
  closeLeaveModal: () => void;
};

// Création du contexte avec des valeurs par défaut
const GroupModalContext = createContext<GroupModalContextType>({
  isDeleteModalOpen: false,
  groupIdToDelete: null,
  openDeleteModal: () => {},
  closeDeleteModal: () => {},

  isLeaveModalOpen: false,
  groupIdToLeave: null,
  openLeaveModal: () => {},
  closeLeaveModal: () => {},
});

// Hook personnalisé pour utiliser le contexte
export const useGroupModal = () => useContext(GroupModalContext);

// Props pour le provider
interface GroupModalProviderProps {
  children: ReactNode;
}

// Provider du contexte
export const GroupModalProvider = ({ children }: GroupModalProviderProps) => {
  // État pour la modale de suppression
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [groupIdToDelete, setGroupIdToDelete] = useState<Id<"forums"> | null>(
    null
  );

  // État pour la modale de sortie
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [groupIdToLeave, setGroupIdToLeave] = useState<Id<"forums"> | null>(
    null
  );

  // Fonctions pour la modale de suppression
  const openDeleteModal = (groupId: Id<"forums">) => {
    setGroupIdToDelete(groupId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setGroupIdToDelete(null);
  };

  // Fonctions pour la modale de sortie
  const openLeaveModal = (groupId: Id<"forums">) => {
    setGroupIdToLeave(groupId);
    setIsLeaveModalOpen(true);
  };

  const closeLeaveModal = () => {
    setIsLeaveModalOpen(false);
    setGroupIdToLeave(null);
  };

  return (
    <GroupModalContext.Provider
      value={{
        isDeleteModalOpen,
        groupIdToDelete,
        openDeleteModal,
        closeDeleteModal,

        isLeaveModalOpen,
        groupIdToLeave,
        openLeaveModal,
        closeLeaveModal,
      }}
    >
      {children}
    </GroupModalContext.Provider>
  );
};
