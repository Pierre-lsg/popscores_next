# Cahier des Charges - Popscores

## 1. Présentation Générale

**Popscores** est une application web dédiée à la gestion de compétitions de street-golf. Elle permet de couvrir l'intégralité du cycle de vie d'un événement de street-golf, depuis la création du championnat jusqu'à la publication des résultats finaux, tout en offrant des fonctionnalités pour des parties libres (Quick Sessions).

L'application est conçue pour être utilisable sur le terrain, y compris dans des zones avec une mauvaise couverture réseau, grâce à son architecture PWA et "Local First".

## 2. Rôles et Autorisations

Le système gère plusieurs niveaux d'utilisateurs authentifiés via PocketBase :
*   **Administrateur (admin)** : Accès global au système et à la configuration.
*   **Manager de Championnat (csMgr)** : Création et paramétrage des championnats (règlement, échelles de points).
*   **Manager de Compétition (cpMgr)** : Gestion d'une compétition spécifique au sein d'un championnat (joueurs, équipes, parcours, déroulement).
*   **Arbitre / Marshall** : Saisie des scores sur le terrain pour les groupes de joueurs (flys).
*   **Public / Joueur (non authentifié)** : Accès en lecture aux parcours, classements et sessions libres.

## 3. Fonctionnalités Principales

### 3.1. Gestion des Championnats et Compétitions
*   Création et configuration de championnats (nom, règlement global).
*   Création d'étapes / compétitions liées à un championnat.
*   Définition des règles spécifiques de la compétition (ex: attribution des points bonus pour les équipes).
*   Contrôles de validation avant le lancement d'une compétition.

### 3.2. Gestion des Entités (Joueurs, Équipes, Clubs)
*   Création et gestion des associations (Clubs).
*   Création et inscription des joueurs (affiliés à un club ou "sans club").
*   Création des équipes pour les compétitions.
*   Importation et synchronisation des entités depuis la base de données Cloud (PocketBase) vers le stockage local de l'utilisateur.

### 3.3. Gestion du Parcours et des Cibles
*   Création des parcours de street-golf associés à une compétition.
*   Définition des cibles (nom, par, positionnement sur carte, ajout de photos des départs/arrivées).
*   Visualisation des cibles sur une carte interactive (Leaflet) pour se repérer sur le terrain.

### 3.4. Déroulement du Jeu et Saisie des Scores
*   Création des "Flys" (groupes de joueurs qui parcourent le terrain ensemble). L'interface permet le "Drag & Drop" pour répartir les joueurs et les équipes.
*   Génération de "Score Cards" (cartes de score) numériques pour chaque joueur et équipe.
*   Saisie des scores trou par trou par les joueurs ou les arbitres (Marshalls).
*   Connexion facilitée pour les arbitres via la génération et le scan d'un QR Code.

### 3.5. Calcul des Résultats et Classements
*   Calcul automatique des scores individuels et par équipe à la fin des parties.
*   Génération de classements (ranking) intermédiaires ou finaux.
*   Application des échelles de points du championnat pour générer le classement global de la saison.
*   Liens directs pour l'affichage des scores en direct.

### 3.6. "Quick Session" (Mode Libre)
*   Organisation de sessions rapides (hors championnat officiel).
*   Sélection simplifiée de joueurs et de parcours.
*   Partage instantané de la session en cours via un lien direct ou un QR Code généré par l'application pour que d'autres puissent suivre ou participer.

### 3.7. Exportation et Partage
*   Export des résultats des compétitions au format CSV.
*   Génération d'images des classements et cartes de score (snapshot) pour faciliter le partage (notamment sur les réseaux sociaux).
*   Publication des classements en ligne pour consultation publique depuis le site.

### 3.8. Fonctionnement Hors-Ligne (PWA)
*   L'application est installable (Progressive Web App) sur smartphone.
*   Sauvegarde locale de la majeure partie des actions (création de joueurs, saisie de scores, modification de parcours) pour pallier les pertes ou absences de connexion internet sur le terrain.
*   Mécanisme de synchronisation (Cloud Sync) pour envoyer les données consolidées vers le serveur central (PocketBase) lorsque la connexion est établie.
