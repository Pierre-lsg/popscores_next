import { writable } from "svelte/store";

// On définit le seuil (breakpoint) à 768px (standard tablette/mobile)
const MOBILE_BREAKPOINT = 768;

function createViewportStore() {
  // Valeur par défaut si on n'est pas dans un navigateur
  const { subscribe, set } = writable(true);

  if (typeof window !== "undefined") {
    // Initialisation avec la vraie valeur
    set(window.innerWidth < MOBILE_BREAKPOINT);

    // Écouteur de redimensionnement
    window.addEventListener("resize", () => {
      set(window.innerWidth < MOBILE_BREAKPOINT);
    });
  }

  return { subscribe };
}

export const isMobile = createViewportStore();
