# Running Event Planner — Development Version

## What this is
A React + Vite + Tailwind development project that tracks Abbott World Marathon Majors + SuperHalfs ballot/registration windows with live countdowns and the ability to add custom races.

## Quick start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the dev server:
   ```bash
   npm run dev
   ```
   Open the URL shown by Vite (usually http://localhost:5173).

3. Build for production:
   ```bash
   npm run build
   ```

## Notes
- The app stores events in browser `localStorage`.
- Edit `src/App.jsx` to change prefilled events or UI behavior.
- Tailwind is preconfigured (see `tailwind.config.cjs` and `postcss.config.cjs`).
