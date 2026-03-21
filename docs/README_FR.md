# Présentation

Popscores est une application de gestion des compétitions de street golf.
Elle permet également de gérer les sessions libres et de les partager hors championnat.

Popscores est développée avec Svelte et TypeScript. Il s'agit d'une application statique.
Les données sont stockées sur un service PocketBase.

Une documentation est en cours de préparation, prochainement dans le répertoire [docs](./docs).

# Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](./LICENSE) pour plus de détails.

# Développement

## Prérequis

- [git](https://git-scm.com/install)
- [node.js](https://nodejs.org/en/download)
- [npm](https://nodejs.org/en/download)

## Création du projet

Il s'agit d'un projet Svelte standard. Pour le construire, il faut :

```sh
# Cloner le projet popscores_next
git clone https://github.com/Pierre-lsg/popscores_next

# Se placer sous l'arborescence
cd popscores_next/

# Installer les dépendances
npm install
```

## Tester localement

Pour tester localement l'application veuillez saisir la commande 'npm run dev'.

```sh
# Test sur le localhost
npm run dev
```

ou

```sh
# Test sur un réseau local
npm run dev -- --host
```

## Générer l'applicatif final

Parmi les commandes pour 'npm run' décrite dans le fichier package.json, on retrouve :

- build - pour construire l'application statique à déposer sur son serveur web
- preview - pour lancer un serveur web local de test
- deploy - pour enchaîner un déploiement sur 'Github Pages'

L'application fonctionnelle est réalisée en exécutant :

```sh
npm run build
```

Le déploiement du fichier dist/ sur un serveur web est à votre charge.

> Pour déployer votre application, vous pouvez aussi installer un [adapter](https://svelte.dev/docs/kit/adapters) pour votre environnement cible.

# Production

## Installation de l'application

L'application est diponible là où vous déployez le répertoire dist/.

Vous pouvez la déployer sur votre serveur web ou sur un service d'hébergement en modifiant les fichiers package.json et svelte.config.js.

Un exemple pour du développement est accessible sur mon [espace github](https://pierre-lsg.github.io/popscores_next/).

Si vous déployez sur un serveur apache, un fichier .htaccess est déployé and nécessite le module Rewrite.

```sh
sudo a2enmod rewrite
sudo systemctl restart apache2
```

Pour d'autres serveurs web, pensez à rediriger les appels sans réponse vers la page index.html afin d'éviter l'erreur 404.

## Installation de PocketBase

Veuillez vous référer à la page du projet [PocketBase](https://pocketbase.io/docs/) pour trouver les instructions d'installation.

Ce travail effectué, vous devez importer le fichier de configuration [pb_schema.json](./pb_schema.json) dans PocketBase.

Pour cela, vous pouvez utiliser l'interface graphique de PocketBase.

Il vous remste à créer les utilisateurs dans la collection Users. Cette action n'est pas encore gérée dans l'application.
