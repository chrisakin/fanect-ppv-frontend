# FaNect PPV Frontend — Project Documentation

> Comprehensive project, technical, and architecture documentation for the FaNect pay-per-view frontend.

---

## Project Overview

- **Name:** FaNect PPV Frontend
- **Purpose:** A React + TypeScript frontend for the FaNect pay-per-view (PPV) platform. It provides interfaces for browsing live/recorded events, purchasing streampasses, watching events, and managing accounts.
- **Repository root:** `fanect-ppv-frontend`
- **Main frameworks / tools:** React, Vite, TypeScript, Tailwind CSS, Firebase (for auth/messaging), Axios

## Quick Links

- **Entry point:** `src/index.tsx`
- **Main config / build:** `vite.config.ts`, `package.json`, `tsconfig.json`
- **Tailwind config:** `tailwind.config.js`, `tailwind.css`
- **Service worker:** `public/firebase-messaging-sw.js`
- **Server (dev helper / proxy):** `server.js`

## Getting Started — Local Development

Prerequisites:
- Node.js (LTS recommended)
- npm or yarn
- macOS / zsh shell (commands shown below assume zsh)

Install dependencies:

```bash
# from project root
npm install
# or using yarn
# yarn
```

Run the development server:

```bash
npm run dev
# opens Vite dev server; default port is usually 5173
```

Build for production:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

Run lint/format (if configured):

```bash
# example scripts - confirm package.json for exact commands
npm run lint
npm run format
```

## Project Structure (high level)

- `src/`
  - `index.tsx` — React entry
  - `components/` — UI components, layout, screens, modals, charts, icons, and utilities
    - `layout/` — top-level UI layout pieces (header, footer, dashboard layout, video player)
    - `modals/` — app modal dialog components
    - `ui/` — atomic UI primitives: button, card, input, select, textarea, etc.
    - `charts/` — chart components used in dashboards
  - `hooks/` — custom React hooks (FCM, location, streampass sessions, screen recording protection)
  - `lib/` — low-level helpers and client wrappers (auth, axios, firebase, utils)
  - `services/` — higher-level app services (fcmService, locationService, eventStreamingService, streampassSessionService)
  - `store/` — state stores (authStore, eventStore, notificationStore, settingsStore, streampassSessionStore)
  - `types/` — TypeScript type definitions (e.g., `event.ts`)
  - `screens/` — route-level screen components (Home, Dashboard, Event, NotFound, etc.)
- `public/` — static assets and service worker
- `server.js` — simple server or dev helper (check contents for proxying or SSR-like utilities)

## Tech Stack

- Frontend framework: React (with TypeScript)
- Bundler/dev server: Vite
- Styling: Tailwind CSS
- Networking: Axios
- Messaging & push: Firebase Cloud Messaging
- State management: local store approach (see `store/*`) — likely using Zustand or simple custom store (inspect `store` files for implementation)
- Charts: Chart components under `components/charts`

## Architecture Overview

The application follows a component-driven UI architecture with separation of concerns across layers:

- Presentation Layer: `components/*` and `screens/*` — stateless or mildly stateful UI components
- State Layer: `store/*` — centralized stores for app-wide state (auth, events, notifications)
- Service Layer: `services/*` and `lib/*` — networking, token management, session handling, FCM integration
- Hooks: `hooks/*` — encapsulate side effects, listeners, and environment-specific logic (e.g., permissions, FCM subscription)

A simplified flow for viewing/purchasing a streampass:

1. UI triggers an action in `screens/Event/*` or a `layout` component (e.g., `StreampassPurchase`) to buy or view.
2. Component calls a service in `services/streampassSessionService.ts` which uses `lib/axios.ts` to call backend API.
3. Response updates `store/streampassSessionStore.ts` which re-renders relevant UI.
4. If the action involves notifications or streaming, `services/eventStreamingService.ts` and `services/fcmService.ts` handle the background flows.

## Key Components & Responsibilities

- `index.tsx`: App bootstrap, provider wiring (ThemeProvider, LocationProvider, etc.), route setup.
- `components/layout/DashboardLayout.tsx`: Primary layout for dashboard screens.
- `components/layout/VideoPlayer.tsx`: Video playback UI (pay attention to DRM/screen-recording protections under `hooks/useScreenRecordingProtection.ts`).
- `components/modals/*`: Reusable modal windows for confirmation, login, feedback, and security prompts.
- `lib/axios.ts`: Centralized Axios instance — examine for interceptors that inject auth tokens or handle refresh logic.
- `lib/firebase.ts`: Firebase initialization for messaging and any other Firebase services.
- `store/authStore.ts`: Authentication state, tokens, and session info.

## State Management & Stores

Look into `store/` to confirm library used. Typical responsibilities of each store:

- `authStore.ts`: user session, auth tokens, sign-in/out helpers
- `eventStore.ts`: current event list, selected event, live status
- `notificationStore.ts`: FCM notifications, in-app notifications
- `settingsStore.ts`: UI preferences, theme
- `streampassSessionStore.ts`: purchase info and viewing session data

## Services & Networking

- `services/fcmService.ts`: Setup and handling of Firebase Cloud Messaging events, registration of the `firebase-messaging-sw.js` service worker.
- `services/eventStreamingService.ts`: Likely manages streaming session setup and interaction with streaming backend (watch URLs, tokens, watchers count).
- `services/streampassSessionService.ts`: Handles purchase and session lifecycle for streampasses.
- `lib/axios.ts`: Central Axios client; look for interceptors that handle token refresh or global error handling.

## Security Considerations

- Authentication and token handling should be implemented securely. Inspect `lib/auth.ts` and `store/authStore.ts` for refresh token flow and secure storage.
- Sensitive tokens should not be stored in localStorage without considering XSS risks. Prefer httpOnly cookies for refresh tokens where backend supports it.
- `useScreenRecordingProtection.ts` indicates attempts to mitigate screen-recording; these are typically platform-limited and should be treated as deterrents rather than absolute protections.
- Check `server.js` for any proxy logic that might expose secrets in environment variables.

## Performance Considerations

- Use lazy loading for heavy components (video player, charts) and route-based code splitting.
- Use memoization (React.memo, useMemo, useCallback) for expensive renders in repeated UI components like cards and lists.
- Prefer streaming-friendly video delivery (HLS/DASH) from the backend and use efficient player libraries.

## CI / Deployment Notes

- No explicit CI config found in root (e.g., `.github/workflows`) — add workflows to run lint, typecheck, tests, and build.
- Deployment target likely static hosting (Netlify, Vercel, S3+CloudFront) or a container if SSR is used. Ensure `npm run build` yields a static `dist/` or equivalent.

## Environment & Secrets

- Environment variables/config typically referenced in `vite.config.ts` or through `.env` files. Make sure secrets are not checked into source.
- For Firebase and other third-party services, prefer injecting keys at deployment time via CI secrets.

## Testing Strategy

- Unit tests: add Jest + React Testing Library for components and hooks.
- Integration/e2e: consider Playwright or Cypress for user flows: login, purchase streampass, watch event.
- Add tests that simulate store updates and service interactions with mocked network responses.

## Folder Map (detailed)

- `src/components/layout/` — header, footer, dashboard layout, video player, watch screens
- `src/components/modals/` — modals (login, feedback, location, VPN, session conflict, etc.)
- `src/components/ui/` — design system primitives
- `src/hooks/` — specialized hooks for platform and features
- `src/lib/` — small helpers, axios client, firebase init, auth helpers
- `src/services/` — organized business services making network calls
- `src/store/` — app-wide stores and state
- `src/screens/` — pages for routes

## API & Backend Interaction (what to inspect/expect)

- Check `lib/axios.ts` for baseURL and common headers.
- Look for API route usage in `services/*` and `lib/*` to map endpoints.
- Expected endpoints:
  - Auth: sign-in, sign-out, refresh
  - Events: list, details, register
  - Streampass: purchase, session create, validate
  - Notifications: register token, receive messages

## Observability

- Add or inspect logs where network calls and session lifecycle happen.
- Consider integrating Sentry or similar for runtime error monitoring.

## Developer Notes & Tips

- To add a new screen, create a folder in `src/screens/` and add a route in the main router (likely in `index.tsx` or a separate router file).
- When adding services, prefer centralizing requests in `lib/axios.ts` to reuse interceptors and error handling.
- Keep UI primitives in `src/components/ui/` to ensure consistency across the app.

## Known TODOs / Improvements

- Add automated tests and CI workflows (`.github/workflows/ci.yml`).
- Add documentation for environment variables and deployment steps.
- Add accessibility checks and keyboard navigation improvements for modals and dialogs.
- Improve performance by auditing bundle size and lazy-loading heavy components.

## Contributing

- Follow existing code style. Prefer TypeScript types in `src/types/` and keep components small and testable.
- Run linters and formatters before opening PRs.
- Add unit tests for new business logic and integration tests for flows involving payments or streaming.

## Appendix — Useful Commands

```bash
# Install deps
npm install

# Dev
npm run dev

# Build
npm run build

# Preview production
npm run preview

# Typecheck
npm run type-check

# Lint
npm run lint

# Run tests (if present)
npm test
```

---

If you want, I can:
- Commit this file and create a PR,
- Generate a smaller README update that points to this detailed doc,
- Or add a `.github/workflows/ci.yml` starter for lint/typecheck/build.

