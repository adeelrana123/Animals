// theme/colors.ts

const PRIMARY_LIGHT_COLORS = {
  Primary: '#FFA500',
  Secondary: '#003366',
  Accent: '#FF5733',
  Background: '#F5F5F5',
  TextPrimary: '#333333',
  TextSecondary: '#F5F5F5',
  IconText: '#F5F5F5',
  black: '#000000',
  TextPrimarywhite: '#F5F5F5',
  white: '#FFFFFF',
};

const PRIMARY_DARK_COLORS = {
  Primary: '#FFA500',
  Secondary: '#003366',
  Accent: '#00D9FF',
  Background: '#1C1C1C',
  TextPrimary: '#F5F5F5',
  TextSecondary: '#333333',
  IconText: '#F5F5F5',
  TextPrimarywhite: '#F5F5F5',
  white: '#FFFFFF',
};

const theme = {
  light: PRIMARY_LIGHT_COLORS,
  dark: PRIMARY_DARK_COLORS,
};

export { theme, PRIMARY_LIGHT_COLORS as appTheme, PRIMARY_DARK_COLORS as appDarkTheme };
