import { Injectable } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private STORAGE_KEY = 'APP_THEME';

  constructor() {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        const saved = this.getSavedTheme();
        if (!saved || saved === 'system') {
          this.applyTheme(this.systemTheme);
        }
      });
  }


  private get systemTheme(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }


  initTheme(): void {
    const saved = this.getSavedTheme();

    if (!saved || saved === 'system') {
      this.applyTheme(this.systemTheme);
    } else {
      this.applyTheme(saved);
    }
  }

  setTheme(mode: ThemeMode): void {
    localStorage.setItem(this.STORAGE_KEY, mode);

    if (mode === 'system') {
      this.applyTheme(this.systemTheme);
    } else {
      this.applyTheme(mode);
    }
  }

  getTheme(): ThemeMode {
    return this.getSavedTheme() ?? 'system';
  }


  private getSavedTheme(): ThemeMode | null {
    return localStorage.getItem(this.STORAGE_KEY) as ThemeMode | null;
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    const html = document.documentElement;

    html.classList.remove('light', 'dark');
    html.classList.add(theme);
  }
}
