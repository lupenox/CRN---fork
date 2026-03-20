import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextType = {
  mode: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  mode: 'system',
  resolvedTheme: 'light',
  setMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = useColorScheme() ?? 'light';
  const [mode, setMode] = useState<ThemeMode>('system');

  const resolvedTheme: 'light' | 'dark' =
    mode === 'system' ? systemTheme : mode;

  return (
    <ThemeContext.Provider value={{ mode, resolvedTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}