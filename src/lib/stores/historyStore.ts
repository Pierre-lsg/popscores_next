import { writable } from "svelte/store";

// On récupère l'historique existant ou un tableau vide
const storedHistory =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("golf_history") || "[]")
    : [];

export const historyStore = writable(storedHistory);

// On s'abonne pour sauvegarder à chaque changement
if (typeof window !== "undefined") {
  historyStore.subscribe((value) => {
    localStorage.setItem("golf_history", JSON.stringify(value));
  });
}

// Fonction utilitaire pour ajouter une partie
export function archiveGame(gameData: any) {
  historyStore.update((history) => {
    return [gameData, ...history]; // On ajoute la nouvelle partie en haut de la liste
  });
}
