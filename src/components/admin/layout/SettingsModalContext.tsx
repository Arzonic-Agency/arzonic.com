"use client";

import React, { createContext, useContext, useRef, ReactNode } from "react";

interface SettingsModalContextType {
  dialogRef: React.RefObject<HTMLDialogElement>;
  openModal: () => void;
  closeModal: () => void;
}

const SettingsModalContext = createContext<
  SettingsModalContextType | undefined
>(undefined);

export const SettingsModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openModal = () => {
    dialogRef.current?.showModal();
  };

  const closeModal = () => {
    dialogRef.current?.close();
  };

  return (
    <SettingsModalContext.Provider value={{ dialogRef, openModal, closeModal }}>
      {children}
    </SettingsModalContext.Provider>
  );
};

export const useSettingsModal = () => {
  const context = useContext(SettingsModalContext);
  if (context === undefined) {
    throw new Error(
      "useSettingsModal must be used within a SettingsModalProvider"
    );
  }
  return context;
};
