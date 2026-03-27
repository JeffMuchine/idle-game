# TODOS — Dungeon Eternal

## Phase 2 (post-launch)

### P1 — High Impact

- **Daily Challenges system**
  What: 3 daily challenges that reset at midnight UTC (e.g., "Kill 500 goblins", "Reach floor 75", "Find 3 rare items")
  Why: Core 7-day retention mechanic. Players with a daily reason to return have 3x better Day-7 retention.
  Pros: Biggest single retention lever after prestige. Well-understood mechanic.
  Cons: Requires timer state, challenge definitions, and bonus reward economy balancing.
  Effort: M (human: ~3 days / CC: ~1 hour)
  Depends on: Core game loop shipped and stable

- **Cloud saves (Supabase)**
  What: Optional account login (email/magic link) to sync save across devices
  Why: Users lose saves when switching devices or clearing browser data. This is a top rage-quit cause for idle games.
  Pros: Cross-device play, backup protection, future multiplayer foundation.
  Cons: Requires backend, auth, and GDPR compliance considerations.
  Effort: L (human: ~1 week / CC: ~2 hours)
  Depends on: Daily challenges or major user growth

### P2 — Quality of Life

- **Multiple hero slots (3 slots)**
  What: Allow 3 saved heroes with different classes. Switch between them.
  Why: Replayability without prestige fatigue. Lets users explore all 4 classes.
  Cons: Significantly more complex save state. Each slot is a full GameState.
  Effort: M (human: ~2 days / CC: ~30 min)
  Depends on: Save system stable

- **Background music**
  What: Looping ambient dungeon music tracks (CC0 licensed). Music toggle in settings.
  Why: Audio dramatically increases immersion. Cited in reviews of top idle games.
  Cons: CC0 music sourcing, audio file hosting (CDN or bundled), file size impact.
  Effort: M (human: ~2 days of sourcing + 4 hours of impl / CC: ~30 min impl)
  Depends on: Sound system shipped

- **PWA / Service Worker**
  What: Register a service worker so the game works offline and can be "installed" from browser.
  Why: Mobile players want to install to home screen. Offline-first feels more like a real game.
  Cons: Service worker lifecycle complexity. Cache invalidation on deploy.
  Effort: S (human: ~4 hours / CC: ~15 min)
  Depends on: GitHub Pages deploy working

### P3 — Polish

- **Global leaderboard**
  What: Top 100 players by highest floor / most prestiges. Anonymous by default.
  Why: Social proof and competition increases engagement in idle games.
  Cons: Requires server, anti-cheat considerations (export save = trivially cheatable).
  Effort: XL (human: ~1 week / CC: ~3 hours)
  Depends on: Cloud saves

- **Seasonal events**
  What: Monthly "Campaign Mode" dungeons with unique monsters and special loot.
  Why: Long-term content cadence keeps veteran players engaged.
  Cons: Requires content pipeline and scheduling infrastructure.
  Effort: XL
  Depends on: Daily challenges system

## Technical Debt

- **Skill tree balance pass**
  What: Playtest all 60 skill nodes across 4 classes and adjust multipliers.
  Why: Unbalanced skills make some builds feel useless and others overpowered, reducing long-term interest.
  Effort: M (human: ~1 week of playtesting / CC: ~30 min of parameter tuning)
  Depends on: Full game shipped and playtested

- **Achievement content completion (remaining 15+ achievements)**
  What: Define the remaining achievements not yet fully specced (beyond the 15 sample categories).
  Why: Achievement system depth is a retention multiplier. More achievements = more goals = more sessions.
  Effort: S (human: ~1 day / CC: ~15 min)
  Depends on: Achievement engine shipped
