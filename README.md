# sympauthy-flow

Vue 3 SPA implementing an OAuth2-compatible authentication flow (sign-in, sign-up, claim collection/validation, MFA/TOTP). Serves as the frontend for the [sympauthy](https://github.com/sympauthy/sympauthy) identity provider.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Prerequisites

This project uses [nvm](https://github.com/nvm-sh/nvm) to manage the Node.js version. Run `nvm use` to activate the correct version from `.nvmrc`.

## Project Setup

```sh
npm install
```

### Development

```sh
npm run dev
```

The dev server proxies `/api` requests to `http://localhost:8080` (the sympauthy backend).

### Build

```sh
npm run build
```

### Lint

```sh
npm run lint
```

### Format

```sh
npm run format
```

## Documentation

- [Functional documentation](https://sympauthy.github.io/documentation/functional/)
- [Contributing guidelines](https://sympauthy.github.io/documentation/contributing/)
