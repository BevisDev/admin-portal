# Admin Portal

Admin Portal is a modern web application for managing internal business operations. It is built with **React 19**, **TypeScript**, **Vite 7**, **Ant Design 6**, **TanStack Query**, **Zustand**, and **Tailwind CSS 4**. **React Router 7** handles routing. **GSAP** is used for lightweight UI animation on the sign-in flow.

Repository: [https://github.com/BevisDev/admin-portal](https://github.com/BevisDev/admin-portal)

## Features

- **Sign-in UX**
  - Enter a username and press **Enter** or use the inline arrow control to check whether the account exists (mock list during development).
  - If the username **already exists** in the mock data, an error icon is shown and the password step stays hidden.
  - If the username is **valid** (not in the mock “existing” list), a check icon is shown and the password field appears with a short GSAP animation.
- **Google sign-in**
  - OAuth redirect flow when environment variables are set; callback is handled in `src/pages/auth/GoogleCallbackPage.tsx`.
  - If OAuth is not configured, the app falls back to a **demo login** (see `src/services/auth/google.ts`).
- **Protected routing** with permission-aware route checks.
- **Mock APIs** for local development: many endpoints map to static JSON under `public/mock/`.

## Tech stack

- React 19, TypeScript
- Vite 7
- Ant Design 6
- TanStack Query (v5)
- Zustand
- Tailwind CSS 4
- GSAP
- Axios
- React Router 7

## Prerequisites

- Node.js (current LTS recommended)
- npm

## Getting started

```bash
npm install
npm run dev
```

Default dev URL: [http://localhost:5173](http://localhost:5173)

## Scripts

| Command           | Description                                      |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Start the dev server (HMR)                       |
| `npm run build`   | Run `tsc -b` and build production assets to `dist/` |
| `npm run preview` | Preview the production build locally             |
| `npm run lint`    | Run ESLint (type-aware; see below)               |

## Environment variables

Create a `.env` file in the project root. Vite only exposes variables prefixed with `VITE_`.

Example:

```env
VITE_BE_URL=
VITE_TIMEOUT=60
VITE_PROFILE=dev

# Google OAuth (sign-in / callback)
VITE_GOOGLE_OAUTH_URL=https://accounts.google.com/o/oauth2/v2/auth
VITE_GOOGLE_CLIENT_ID=
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

- If `VITE_GOOGLE_CLIENT_ID` and `VITE_GOOGLE_REDIRECT_URI` are not set, Google sign-in uses the **demo fallback** described in `src/services/auth/google.ts`.
- The redirect URI should match the in-app callback route: `/auth/google/callback`.

Shared config reads these values through `src/config/SysConfig.ts`.

## Mock data and API paths

In development, several URLs point to JSON files under `public/mock/…`, defined in `src/api/index.ts`, for example:

- Profile: `/mock/auth/get-me.json`
- Username check (sample accounts): `/mock/auth/accounts.json`
- Google callback (demo): `/mock/auth/google-callback.json`

To use a real backend, update the mappings in `src/api/index.ts` and/or the relevant API layer.

## ESLint

The project uses ESLint flat config with **typescript-eslint** in **type-aware** mode (`recommendedTypeChecked`), with `parserOptions.project` pointing at `tsconfig.app.json` and `tsconfig.node.json`. Some legacy files may still report violations until they are cleaned up.

## Production build

```bash
npm run build
```

Output is in `dist/`. Deploy as a static SPA and configure the host to fall back to `index.html` for client-side routes if needed.

## CI/CD

A GitHub Actions workflow lives at `.github/workflows/cicd.yml` and may trigger an external CI/CD repository via repository dispatch, depending on your organization setup.
