export interface AppConfig {
  lightColors: ThemePalette;
  darkColors: ThemePalette;
}

export interface ThemePalette {
  primary: string;
  background: string;
  sidebarBg: string;
  sidebarBorder: string;
  text: string;
  textSecondary: string;
  menuHover: string;
  menuActive: string;
  cardBg: string;
  border: string;
  headerBg: string;
}
