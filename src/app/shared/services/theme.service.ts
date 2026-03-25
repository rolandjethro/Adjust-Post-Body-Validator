import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID); // Get the platform ID
  
  isDarkMode = signal<boolean>(false);

  constructor() {
    // Only run initialization if we are in the Browser
    if (isPlatformBrowser(this.platformId)) {
      this.initializeTheme();
    }

    // Effects are smart: they generally only run on the client, 
    // but we wrap the storage part just to be safe.
    effect(() => {
      const theme = this.isDarkMode() ? 'dark' : 'light';
      this.document.documentElement.setAttribute('data-bs-theme', theme);
      
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('user-theme', theme);
      }
    });
  }

  private initializeTheme() {
    const savedTheme = localStorage.getItem('user-theme');
    
    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      // Safe check for system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode.set(systemPrefersDark);
    }

    // Listen for OS theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem('user-theme')) {
        this.isDarkMode.set(e.matches);
      }
    });
  }

  toggleTheme() {
    this.isDarkMode.update(dark => !dark);
  }
}