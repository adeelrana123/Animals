import React, { useState, createContext, useEffect, useMemo } from 'react';
import { Appearance } from 'react-native';
import { getStoredStringValue } from '../untils';
import { theme } from '../objects';

const AUTO_THEME_MODE = '0';
const LIGHT_THEME_MODE = '1';
const DARK_THEME_MODE = '2';
interface AppDataContextType {
  appTheme: any; 
  activeThemeMode: string;
  setActiveThemeMode: React.Dispatch<React.SetStateAction<string>>;
}
// Provide a default value for appTheme
const defaultAppDataContext: AppDataContextType = {
  appTheme: theme.light,
  activeThemeMode: '',
  setActiveThemeMode: () => { },
};
const AppDataContext = createContext<AppDataContextType>(defaultAppDataContext);
const AppDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [appTheme, setAppTheme] = useState({});
  const [activeThemeMode, setActiveThemeMode] = useState(AUTO_THEME_MODE);

  useEffect(() => {
    getStoredStringValue('@ThemeState', setActiveThemeMode, AUTO_THEME_MODE)
  }, [])
  

  useEffect(() => {
    if (activeThemeMode === AUTO_THEME_MODE) {
      const colorScheme = Appearance.getColorScheme()
      if (colorScheme === 'dark') {
        setAppTheme(theme.dark);
      } else {
        setAppTheme(theme.light);
      }
      const subscribe = Appearance.addChangeListener(({ colorScheme }) => {
        if (colorScheme === 'dark') {
          setAppTheme(theme.dark);
        } else {
          setAppTheme(theme.light);
        }
      })
      return () => subscribe.remove()
    } else if (activeThemeMode === DARK_THEME_MODE) {
      setAppTheme(theme.dark);
    } else {
      setAppTheme(theme.light);
    }
  }, [activeThemeMode]);

  const contextValue = useMemo(
    () => ({
      appTheme,
      activeThemeMode,
      setActiveThemeMode,
    }),
    [
      appTheme,
      activeThemeMode,
      setActiveThemeMode,
    ],
  );
  return (
    <AppDataContext.Provider value={contextValue}>
      {children}
    </AppDataContext.Provider>
  );
};
export { AUTO_THEME_MODE, LIGHT_THEME_MODE, DARK_THEME_MODE, AppDataContext, AppDataProvider };