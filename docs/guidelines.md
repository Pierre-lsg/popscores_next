# Guidelines Techniques - Popscores

Ce document décrit les choix technologiques et l'architecture technique de l'application Popscores.

## 1. Stack Technologique

*   **Frontend Framework** : [Svelte](https://svelte.dev/) (v5) avec [SvelteKit](https://kit.svelte.dev/) (v2).
*   **Langage** : [TypeScript](https://www.typescriptlang.org/) pour un typage statique robuste.
*   **Outil de build** : [Vite](https://vitejs.dev/) avec configuration PWA.
*   **Backend / Base de données** : [PocketBase](https://pocketbase.io/) (Backend-as-a-Service léger et open-source).

## 2. Architecture de l'Application

*   **Application Statique (SPA / SSG)** : L'application utilise `@sveltejs/adapter-static` pour générer un ensemble de fichiers statiques (HTML, CSS, JS). Cela permet un hébergement très simple (ex: GitHub Pages, Apache, Nginx) sans nécessiter de serveur Node.js en production.
*   **PWA (Progressive Web App)** : Utilisation de `@vite-pwa/sveltekit` pour rendre l'application installable et utilisable hors-ligne via l'enregistrement de Service Workers.
*   **Approche Local First / Cloud Sync** :
    *   Les données en cours de saisie (compétitions, équipes, scores) sont stockées localement (LocalStorage / IndexedDB) pour permettre une utilisation sur le terrain même sans connexion internet.
    *   Une synchronisation vers le Cloud (PocketBase) est effectuée pour sauvegarder, agréger et partager les données.

## 3. Bibliothèques Principales

*   **Cartographie** : `leaflet` pour l'affichage interactif des parcours et des cibles de street-golf.
*   **Génération de QR Codes** : `qrcode` pour faciliter le partage de sessions rapides ou la connexion des arbitres.
*   **Manipulation de l'interface** : `svelte-dnd-action` pour les fonctionnalités de glisser-déposer (ex: composition des équipes, des "flys").
*   **Export et Partage** :
    *   `html-to-image` pour transformer des éléments du DOM (comme des cartes de score ou des classements) en images exportables.
    *   `lz-string` pour la compression de données, utile pour encoder de la donnée textuelle volumineuse.

## 4. Déploiement

*   **Build** : La commande `npm run build` génère le dossier `dist/`.
*   **Hébergement** : Ce dossier `dist/` peut être déposé sur n'importe quel serveur web statique. Un script `npm run deploy` automatise le déploiement sur *GitHub Pages*.
*   **Routage serveur** : Lors d'un déploiement sur Apache ou autre serveur classique, une configuration de réécriture d'URL est nécessaire pour rediriger les requêtes non trouvées vers `index.html` pour la gestion du routage client (SPA).

## 5. Modèle de Données (PocketBase)

La configuration de la base de données est définie dans le fichier `pb_schema.json`. PocketBase gère à la fois l'authentification des utilisateurs (avec différents rôles comme `admin`, `csMgr`, `cpMgr`, `marshall`) et le stockage persistant des entités du jeu (Championnats, Compétitions, Clubs, Joueurs, Scores, etc.).
