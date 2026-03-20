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

## Améliorations

1. ~~Accès aux championnats profil csMgr, autoriser l'accès aux champions à l'état 'setup'~~
2. Ne pas afficher le bouton 'Changer de championnat' si un seul championnat est disponible (local et Cloud)
3. ~~Permettre la multisélection avec le composant MultiSelector lors de la création d'une équipe~~
4. Ajouter un bouton de sauvegarde globale des clubs et suppression des messages d'alerte
5. Permettre la création de joueurs depuis l'interface de saisie des équipes pour les équipes locales
6. Afficher surnom ou prénom si aucun nom saisi pour le joueur
7. Harmoniser l'affichage des boîtes de détail
8. Forcer l'enregistrement de la compétition (réalisé) et des clubs/équipes/joueurs (non réalisé) si modification
9. Détailler les messages pour réaliser la sauvegarde depuis l'écran de message
10. ~~Lister les marshalls autorisés d'un championnat.~~
11. Revoir la gestion de chargement des championnats
12. Les messages à la remontée d'un fly ne semble plus à jour (joueurs, résultats et carte de score bien sauvés)
13. Supprimer les options et informations inutiles
14. Supprimer les cibles non rattachées à au moins une compétition
15. Ajouter la notion de championnat dans la table utilisateurs
