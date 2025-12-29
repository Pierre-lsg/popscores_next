import { writable } from "svelte/store";

export type Theme = "classic" | "modern" | "high-contrast";

const STORAGE_KEY = "golf-app-theme";

function createThemeStore() {
  const saved = localStorage.getItem(STORAGE_KEY) as Theme;
  const { subscribe, set } = writable<Theme>(saved || "classic");

  return {
    subscribe,
    set: (theme: Theme) => {
      localStorage.setItem(STORAGE_KEY, theme);
      // On applique la classe directement sur l'élément <html> ou <body>
      document.documentElement.setAttribute("data-theme", theme);
      set(theme);
    },
  };
}

export const theme = createThemeStore();
