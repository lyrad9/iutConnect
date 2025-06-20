"use client";
import React from "react";
import { EditProfilUserModalContextProvider } from "../hooks/edit-profil.modal.store";

export const EditProfilUserModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EditProfilUserModalContextProvider>
      {children}
    </EditProfilUserModalContextProvider>
  );
};

export default EditProfilUserModalProvider;
