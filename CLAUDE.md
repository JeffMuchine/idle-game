# Dungeon Eternal — Developer Guide

## Project Overview

Browser-based idle/incremental D&D game. Stack: Vite + React + TypeScript + Tailwind + Zustand.
Deployed to GitHub Pages: `https://{username}.github.io/idle-game/`

## Design System

Full spec in `DESIGN.md`. Key rules:

- **Fonts**: `font-display` (Cinzel) for headers/class names, `font-body` (Crimson Pro) for all body/UI text
- **Colors**: Use semantic tokens — `bg-panel`, `gold-primary`, `rarity-legendary`, `class-warrior`, etc. Never raw hex values in components.
- **Border radius**: Max `rounded-md` (6px). Never `rounded-lg`, `rounded-xl`, or `rounded-2xl`.
- **Rarity colors**: `text-rarity-common`, `text-rarity-uncommon`, `text-rarity-rare`, `text-rarity-epic`, `text-rarity-legendary`
- **No gradients** except the legendary item background shimmer (defined in DESIGN.md)

## Architecture

```
src/
  stores/         # Zustand slices (combat, hero, progression, settings, ui)
  components/     # React components (left-panel, center-panel, right-panel, shared)
  engine/         # Pure combat functions (no React, no Zustand imports)
  utils/          # bignum.ts, prng.ts, format.ts, save.ts
  data/           # Static data: monsters, items, achievements, skill-trees
  hooks/          # useGameLoop (the setInterval ref hook)
  types/          # All TypeScript interfaces
```

## Critical Performance Rules

1. **Tick loop**: Lives in `useRef` + `setInterval`, NEVER inside a `useEffect` that subscribes to state
2. **State batching**: All per-tick state changes in ONE `zustand` `set()` call via `processTick()`
3. **Selectors**: Every component uses `useShallow` to select only the fields it renders
4. **No inline objects in selectors**: `useStore(s => ({ a: s.a, b: s.b }))` recreates every render — use `useShallow`

## Save System

- Auto-save every 30 seconds to `localStorage` key `dungeon-eternal-save`
- Save format: versioned JSON (`saveVersion` field), base64-encoded for export
- Migration function in `src/utils/save.ts` handles schema upgrades
- Offline progress calculated on load: `offlineGold = idleDPS * 0.4 * Math.min(elapsed, 86400)`
- Multi-tab lock: tab-lock key in localStorage prevents double offline calculation

## Game Speed

| Setting | Tick interval | Animation speed |
|---------|--------------|-----------------|
| 1x      | 250ms        | 1x              |
| 2x      | 125ms        | 2x              |
| 4x      | 62ms         | 4x              |

## GitHub Pages Deploy

`vite.config.ts` must have `base: '/idle-game/'`. CI: push to `main` triggers Vite build + deploy to `gh-pages` branch via `peaceiris/actions-gh-pages`.

## Number Formatting

Never display raw integers above 999. Format via `src/utils/format.ts`:
- 1,000 → 1K
- 1,000,000 → 1M
- 1,000,000,000 → 1B
- 1e15+ → scientific (1.2e15)

## Related Files

- `DESIGN.md` — Full design system (CSS vars, typography, components, interactions)
- `TODOS.md` — Phase 2 backlog (daily challenges, cloud saves, etc.)
- `~/.gstack/projects/*/ceo-plans/` — CEO plan with full game spec
