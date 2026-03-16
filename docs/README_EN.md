# Presentation

Popscores is a street‑golf competition management application.  
It also allows you to manage free sessions and share them outside of championships.

Popscores is built with Svelte and TypeScript. It is a static application.  
Data is stored on a PocketBase service.

Documentation is in preparation and will soon be available in the [docs](./docs) directory.

# License

This project is licensed under MIT – see the [LICENSE](./LICENSE) file for more details.

# Development

## Prerequisites

- [git](https://git-scm.com/install)
- [node.js](https://nodejs.org/en/download)
- [npm](https://nodejs.org/en/download)

## Creating the project

This is a standard Svelte project. To build it, run:

```sh
# Clone the popscores_next project
git clone https://github.com/Pierre-lsg/popscores_next
# Move into the project tree
cd popscores_next/
# Install dependencies
npm install
```

## Test locally

To test the application locally, run the command `npm run dev`.

```sh
# Test on localhost
npm run dev
```

ou

```sh
# Test on local network
npm run dev -- --host
```

## Generate the final application

Among the commands for `npm run` described in the `package.json` file, we find:

- **build** – to build the static application to deploy on your web server
- **preview** – to launch a local test web server
- **deploy** – to chain a deployment to _GitHub Pages_

The functional application is produced by executing:

```sh
npm run build
```

Deploying the `dist/` folder to a web server is your responsibility.

> To deploy your application, you can also install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

# Production

## Installing the application

The application is available wherever you deploy the `dist/` directory.

You can deploy it to your web server or to a hosting service by modifying the `package.json` and `svelte.config.js` files.

An example for development is available on my [GitHub space](https://pierre-lsg.github.io/popscores_next/).

## Installing PocketBase

Please refer to the [PocketBase project page](https://pocketbase.io/docs/) for installation instructions.

Once this is done, you need to import the configuration file `[pb_schema.json](./pb_schema.json)` into PocketBase.

For that, you can use PocketBase’s graphical interface.

You still need to create users in the **Users** collection. This action is not yet handled by the application.
