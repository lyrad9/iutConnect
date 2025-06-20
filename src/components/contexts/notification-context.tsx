"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { NotificationData } from "@/app/notifications/NotificationItem";
import { DialogApprovalRequest } from "@/src/components/notifications/DialogApprovalRequest";
import { DialogContentApproval } from "@/src/components/notifications/DialogContentApproval";

type NotificationContextType = {
  openApprovalDialog: (notification: NotificationData) => void;
  openContentDialog: (notification: NotificationData) => void;
  closeDialogs: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);
  const [activeNotification, setActiveNotification] =
    useState<NotificationData | null>(null);

  const openApprovalDialog = (notification: NotificationData) => {
    setActiveNotification(notification);
    setIsApprovalDialogOpen(true);
  };

  const openContentDialog = (notification: NotificationData) => {
    setActiveNotification(notification);
    setIsContentDialogOpen(true);
  };

  const closeDialogs = () => {
    setIsApprovalDialogOpen(false);
    setIsContentDialogOpen(false);
  };

  return (
    <NotificationContext.Provider
      value={{ openApprovalDialog, openContentDialog, closeDialogs }}
    >
      {children}

      {activeNotification && (
        <>
          <DialogApprovalRequest
            open={isApprovalDialogOpen}
            onOpenChange={setIsApprovalDialogOpen}
            notification={activeNotification}
          />
          <DialogContentApproval
            open={isContentDialogOpen}
            onOpenChange={setIsContentDialogOpen}
            notification={activeNotification}
          />
        </>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}
