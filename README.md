# E‑Commerce Portfolio (Senior)

This project implements a professional, performant, and accessible e‑commerce experience following the blueprint in `IMPLEMENTATION_GUIDE.md`. It uses Next.js + TypeScript, TailwindCSS, and Zustand, with mocked APIs and seed data.

## Tech Stack
- Next.js (App Router), TypeScript
- TailwindCSS (design tokens), PostCSS
- Zustand (client state for cart)

## Scripts
- `npm run dev` — start local dev server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — lint code

## Getting Started
1. Install dependencies:
```
npm install
```
2. Run the dev server:
```
npm run dev
```
3. Open `http://localhost:3000`.

## Deploying to Vercel

This project is configured to deploy to Vercel with the Next.js builder. Before you deploy:

- Ensure dependencies are installed and `package.json` scripts are present (`build`, `start`).
- The project uses `@/...` imports; path mapping is configured via `tsconfig.json` and `jsconfig.json`.

To deploy:

1. From the Vercel dashboard, import the Git repository and choose the root of this project.
2. Vercel will detect Next.js and use `npm run build` automatically.
3. If you see a 404 on the live domain, check build logs — missing path mappings or build errors commonly cause routes to not be available. The `vercel.json` file included ensures the Next.js builder is used.

Local build check:
```powershell
npm run build
npm run start
```
Open `http://localhost:3000` to validate the production build locally before pushing to Vercel.

## Structure (planned)
- `app/` — routes and layouts
- `components/` — UI components
- `lib/` — utils and mocks
- `public/` — static assets

## Notes
- All payments and integrations are mocked; no real charges.
- Seed data mirrors the catalog in the implementation guide.
