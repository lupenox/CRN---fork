import React, { createContext, useState } from 'react';

export const SideMenuContext = createContext({
  isOpen: false,
  openMenu: () => {},
  closeMenu: () => {},
  toggleMenu: () => {},
});

export function SideMenuProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen(v => !v);

  return (
    <SideMenuContext.Provider value={{ isOpen, openMenu, closeMenu, toggleMenu }}>
      {children}
    </SideMenuContext.Provider>
  );
}