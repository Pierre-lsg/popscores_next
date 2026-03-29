# Evolutions et corrections à apporter

## Corrections

1. ~~Besoin de cliquer 2 fois sur le nuage à la validation d'un nouveau club pour le sauver dans le Cloud. Erreur au premier enregistrement~~ Enregistrement du club avant joueurs et équipes et attente de validation avant de sauver les équipes et joueurs
2. ~~A la création du parcours de compétition, la première saisie n'est pas enregistrée localement. Nécessite second passage. Vérifier la création du parcours ...~~ Correction : course doit être dérivé de competition.course et non mis à jour à posteriori
3. ~~Au chargement d'un championnat, si profil différent d'admin, teams_in_competitions non remonté dans le localStorage [urgent++]~~ Correction : attente de la fin du chargement du règlement avant de charger les équipes.
4. ~~A la création d'un nouveau joueur pour une compétition, vérifier son affiliation à 'sans club'~~
5. ~~Positionner des contrôles pour empêcher validation d'une compétition incomplète~~
6. ~~Lorsqu'on modifie un championnat, il faut aussi injecter les échelles de classement~~ (championships2Cloud : championshipService.save)
7. ~~Calcul du résultat erroné en individuel.~~ Les résultats du joueurs étaient récupérés après le calcul du classement
8. ~~Problème des liens (href) si non à la racine d'un domaine~~
9. ~~Parler d'association et non de club~~

## Améliorations

0. Ajouter l'option 'publier' sur le classement compétition et le classement championnat pour permettre l'accès sur le site
1. Ajouter l'option pour permettre la connexion des arbitres par QRCode.
2. ~~Accès aux championnats profil csMgr, autoriser l'accès aux champions à l'état 'setup'~~
3. Ne pas afficher le bouton 'Changer de championnat' si un seul championnat est disponible (local et Cloud)
4. ~~Permettre la multisélection avec le composant MultiSelector lors de la création d'une équipe~~
5. Ajouter un bouton de sauvegarde globale des clubs et suppression des messages d'alerte
6. Permettre la création de joueurs depuis l'interface de saisie des équipes pour les équipes locales
7. Afficher surnom ou prénom si aucun nom saisi pour le joueur
8. Harmoniser l'affichage des boîtes de détail
9. Forcer l'enregistrement de la compétition (réalisé) et des clubs/équipes/joueurs (non réalisé) si modification
10. Détailler les messages pour réaliser la sauvegarde depuis l'écran de message
11. ~~Lister les marshalls autorisés d'un championnat.~~
12. Revoir la gestion de chargement des championnats
13. Les messages à la remontée d'un fly ne semble plus à jour (joueurs, résultats et carte de score bien sauvés)
14. Supprimer les options et informations inutiles
15. Supprimer les cibles non rattachées à au moins une compétition
16. ~~Ajouter la notion de championnat dans la table utilisateurs~~
17. Une fois la compétition lancée les flys ne peuvent etre modifié
18. Au mieux des joueurs et équipes 'sans club' seront ajoutables par le responsable de la carte de score
19. Autoriser l'accès aux parcours de compétition même sans être connecté
20. Sauvegarde association depuis l'écran ClubManagement
21. ~~Ajouter les noms des joueurs sur les flys lors de l'affichage~~
22. ~~Règle Bonus équipe règle par équipe par équipe~~

## Quick session

1. ~~Permettre de lister les joueurs et parcours~~
2. ~~Permettre de partager par lien (transformer en QR code)~~
