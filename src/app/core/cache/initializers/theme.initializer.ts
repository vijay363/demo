import { ThemeService } from "../services/theme.service";

export function initThemeFactory(themeService: ThemeService) {
  return () => themeService.initTheme();
}
