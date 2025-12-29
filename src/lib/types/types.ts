export interface Hole {
  id: string;
  par: number;
  // On pourra ajouter plus tard : distance, gps, etc.
}

export interface Player {
  id: string;
  name: string;
  scores: number[]; // Index 0 = score pour le trou à l'index 0 du holesStore
}

export interface GameSession {
  id: string; // Un identifiant unique (ex: timestamp)
  date: string; // Date et heure de la partie
  location: {
    name: string; // Nom du golf
    course: string; // Nom du parcours (ex: "Les Étangs")
  };
  weather: {
    temp: number | null;
    condition: string; // Ensoleillé, Pluie, Vent, etc.
  };
  players: Player[]; // La liste des joueurs avec leurs scores finaux
  holes: Hole[]; // La configuration des trous (PARs) de cette partie
  isFinished: boolean; // Pour distinguer une partie en cours d'une archive
}
