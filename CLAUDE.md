# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

sympauthy-flow is a Vue 3 SPA implementing an OAuth2-compatible authentication flow (sign-in, sign-up, claim collection/validation, MFA/TOTP). It serves as the frontend for the sympauthy identity provider.

## Commands

```bash
# All commands require Node.js >= 20. Use nvm:
source ~/.nvm/nvm.sh && nvm use 20

# Development server (proxies /api to localhost:8080)
npm run dev

# Production build (runs type-check + vite build in parallel)
npm run build

# Type checking only
npm run type-check

# Lint (ESLint with auto-fix)
npm run lint

# Format (Prettier)
npm run format
```

No test framework is configured.

## Architecture

### Stack

- **Vue 3** (Composition API, `<script setup>`) + **TypeScript 5.9**
- **Vite 7** with `@vitejs/plugin-vue`, `@tailwindcss/vite`, `@intlify/unplugin-vue-i18n`
- **Pinia** for state management, **Vue Router 5**, **Vue-i18n**
- **Tailwind CSS v4** with custom `@utility` directives in `src/styles/style.css`
- **Yup** + **Vee-Validate** for form validation, **AJV** for API response schema validation

### Dependency Injection

Services are not imported directly by components. Instead, all API clients and services are instantiated in `src/main.ts` and registered via Vue's `provide()`. Components access them with `injectRequired()` from `src/utils/VueUtils.ts`, which wraps `inject()` with a non-null assertion.

### API Client Layer (`src/client/`)

- `AbstractApi` is the base class handling fetch, headers, and AJV schema validation on responses.
- API responses are a union type: `SuccessApiResponse<T> | ErrorApiResponse`, checked via `isSuccess()`/`isError()` type guards.
- OAuth state is managed by `StateStore` — GET requests append state as a query param, POST requests send it as `Authorization: State <state>` header.
- All endpoints live under `/api/v1/flow/*`.

### Routing (`src/router/index.ts`)

Routes use `meta.stateRequired` to indicate OAuth state is needed. A `beforeEach` guard redirects to the error page if state is missing. The router accounts for Vite's `BASE_URL` in redirects (see `redirectOrPush` in `VueUtils.ts`).

### Key Directories

- `src/pages/` — Page-level components (SignIn, SignUp, Claims, MFA)
- `src/components/` — Reusable UI components (Common* prefix for base elements)
- `src/services/` — Business logic (claim form building, validation schema generation)
- `src/client/api/` — API endpoint wrappers
- `src/client/model/` — TypeScript models with AJV JSON schemas
- `src/stores/` — Pinia stores (ConfigurationStore, StateStore)
- `src/locales/` — i18n translations

### Path Aliases

- `@` → `./src` (configured in tsconfig and vite)

### Dev Server

Vite proxies `/api` requests to `http://localhost:8080` (the sympauthy backend).

## Documentation

- **Functional documentation**: https://sympauthy.github.io/documentation/functional/
- **Contributing guidelines**: https://sympauthy.github.io/documentation/contributing/
- **Backend repository**: https://github.com/sympauthy/sympauthy

## Code Style

- Prettier: 2-space indent, no trailing commas, 100 char line width, single quotes
- ESLint: Vue 3 recommended + TypeScript + Prettier integration
- Components use `<script setup lang="ts">` with Composition API