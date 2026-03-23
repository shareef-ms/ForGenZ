import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);

  const toggle = () => setIsDark(prev => !prev);

  const theme = {
    isDark,
    toggle,
    bg: isDark ? '#0D0D0F' : '#F5F5F7',
    surface: isDark ? '#161618' : '#FFFFFF',
    surface2: isDark ? '#1E1E22' : '#F0F0F3',
    border: isDark ? '#2A2A30' : '#E0E0E8',
    text: isDark ? '#F0EFF8' : '#1A1A2E',
    muted: isDark ? '#8B8A9E' : '#6B6B80',
    accent: '#6C5CE7',
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}