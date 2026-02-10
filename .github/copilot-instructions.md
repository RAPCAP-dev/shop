## Purpose
Provide concise, actionable guidance for AI coding agents working on this Next.js (App Router) TypeScript project.

## Big picture
- App type: Next.js (App Router) using `src/app` (server components by default). See [src/app/layout.tsx](src/app/layout.tsx#L1).
- Client UI: small client-only shop lives in `src/app/shop` — `src/app/shop/index.tsx` is a `"use client"` component that reads/writes `localStorage`.
- Styling: mixture of `styled-components` (see `src/app/shop/ui/index.tsx`) and Tailwind via PostCSS (see `postcss.config.mjs` and `globals.css`).
- Data flow: client components persist items to `localStorage` using an index-based key scheme (`index` and `index-N`). The shop loads entries by recursively reading `index-N` keys. See `src/app/shop/index.tsx`.

## Key files to inspect
- Project manifest: [package.json](package.json#L1)
- Next config: [next.config.ts](next.config.ts#L1)
- App root / fonts: [src/app/layout.tsx](src/app/layout.tsx#L1)
- Shop (client UI & logic): [src/app/shop/index.tsx](src/app/shop/index.tsx#L1)
- Shop styled components: [src/app/shop/ui/index.tsx](src/app/shop/ui/index.tsx#L1)
- Shop model: [src/app/shop/models/index.ts](src/app/shop/models/index.ts#L1)
- Storage utilities (currently empty helper present): [src/app/shop/utils/storage.ts](src/app/shop/utils/storage.ts#L1)

## Project-specific conventions & patterns
- App Router: default files under `src/app` are server components. Add `"use client"` at the top of any file that uses hooks, browser APIs, or client-side state (see `src/app/shop/index.tsx`).
- LocalStorage pattern: the shop writes an `index` counter and items to `index-N` keys. When modifying storage behavior, preserve compatibility with this scheme or migrate all stored keys.
- Styling: prefer `styled-components` for component-scoped styles in `src/app/shop/ui`. Avoid mixing server-only CSS-in-JS without `"use client"` in the same file.
- Naming/exports: the shop exposes a named `Shop` export (imported as `import { Shop } from "./shop";` in `src/app/page.tsx`). Keep named exports for components used across the app.

## Developer workflows (how to run & lint)
- Dev server: `npm run dev` (runs `next dev`).
- Build: `npm run build` (runs `next build`).
- Production start: `npm run start` (runs `next start`).
- Lint: `npm run lint` (invokes `eslint`).

Example quick commands:
```bash
npm install
npm run dev
```

If you need to run TypeScript checks, run the TypeScript compiler manually (`tsc --noEmit`) — there is no explicit `typecheck` script.

## Integration points & external dependencies
- Next.js (v16.x) + React 19 — App Router conventions apply.
- Styling: `styled-components` (SSR caveat: confirm server-side setup if introducing SSR styled-components changes), Tailwind via PostCSS.
- Fonts: uses `next/font` (Geist) in `src/app/layout.tsx`.
- No backend APIs are present — persistent state is local to the browser (localStorage). If adding APIs, prefer Next.js API Routes or App Router server actions.

## Common tasks for an agent and examples
- Adding a client-only component: create file under `src/app/...` with `"use client"` at top; import `styled-components` from `styled-components`; export named component.
- Reading/writing persisted shop data: follow the existing index scheme. Example read: `localStorage.getItem('index')` then `localStorage.getItem('index-1')`, etc. See `src/app/shop/index.tsx`.
- Creating shared helpers: place in `src/app/shop/utils/` (there's an empty `storage.ts` file intended for centralizing storage logic).

## What *not* to change without approval
- Do not alter the `localStorage` key format without a migration path — existing user data will be lost.
- Avoid turning server components into client components en-masse; only add `"use client"` where necessary.

## When you need clarification
- Ask which files should be entry points for new UI (default: `src/app` routes).
- Ask whether we should implement storage migration when altering `localStorage` keys.

---
If this looks correct, I will commit this file. Tell me if you'd like more detail for any section or prefer a different tone/length.
