import React, { ReactNode, createContext, useContext, useState } from "react";
type ModalContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  /*   isDesktop:boolean */
};

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);
interface Props {
  [propName: string]: any;
}
export const EditProfilUserModalContextProvider = (props: Props) => {
  const [open, setOpen] = useState(false);
  /*  const isDesktop = useMediaQuery("(min-width: 768px)"); */

  return <ModalContext.Provider value={{ open, setOpen }} {...props} />;
};
export const useEditProfilUserModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error(
      "useEditProfilUserModal must be used within a EditProfilUserModalProvider"
    );
  }
  return context;
};
