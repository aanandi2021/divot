# Implementation Plan: Divot MVP

**Branch**: `001-divot-mvp` | **Date**: 2026-07-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-divot-mvp/spec.md`
**Constitution**: `.specify/memory/constitution.md`

## Summary

Divot is a **17-room 2D top-down minigolf game**: a Clubhouse hub, a Driving Range (Hole 0), Front Nine (Holes 1–9), and Back Six (Holes 10–15) unlocked by earning a medal on all Front Nine holes. Built as a **statically-hosted Phaser 3 + Matter.js + TypeScript** browser game with **realistic physics**, **photo-drone-realism aesthetic**, **two-click cursor-vector aim mechanic**, **full sound package**, and **localStorage persistence**. No accounts, no server, no build required to play once bundled.

Technical approach: single-project Vite + TypeScript app. Scene-per-room using Phaser's Scene manager. One `HoleScene` class parameterised by a `HoleConfig`, so 15 holes share ~90% of their code. Matter.js handles ball physics + wall collisions + moving obstacles. Assets are procedurally drawn on `Graphics` objects in the art-pass phase (matching the mockup style) rather than shipped as PNGs, keeping the repo lean.

## Technical Context

**Language/Version**: TypeScript 5.4+ (strict mode)

**Primary Dependencies**:
- `phaser` (v3.90+) — game framework, scene manager, canvas renderer, input, WebAudio
- `matter-js` (bundled with Phaser) — 2D physics
- `vite` (v5+) — dev server + build
- `typescript` (v5.4+) — type-checker
- No other runtime deps for MVP (audio uses Phaser's built-in loader).

**Storage**: `localStorage` only. Single JSON blob under `divot.save`.

**Testing**: Manual playtest for physics feel + geometry. Automated smoke tests for pure logic (medal computation, unlock threshold, save-load round-trip) via `vitest` — small addition, worth it because the state machine has edge cases.

**Target Platform**: Modern browsers (Chrome, Safari, Firefox latest). Desktop-first, mouse-required. Touch-input best-effort but not designed-for.

**Project Type**: Single frontend project — no backend, no API, no service.

**Performance Goals**:
- 60 FPS on a 2020-era MacBook Air, all 17 rooms
- Time-to-interactive under **2 seconds** on cable broadband
- Bundle size under **1.5 MB** minified+gzipped

**Constraints**:
- Runs at `file://` after `vite build` (no server required to play)
- No network required after initial load
- No third-party analytics, tracking, or telemetry
- Buildable geometry (Constitution I) — no visual features that violate real-world construction

**Scale/Scope**:
- 17 scenes (1 hub + 1 range + 15 holes)
- ~15 unique hole configs
- ~7 audio clips
- Estimated ~5,000–8,000 lines of TypeScript at completion

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Compliance | Notes |
|---|---|---|
| **I · Buildable Geometry** | ✅ | Every hole spec (spec.md §holes) uses right-angle walls, real materials, real mechanical elements. Loop-the-loop, corkscrew, ferry, pendulum are all buildable IRL. |
| **II · Photo-Drone Realism** | ✅ | Aesthetic locked in constitution. Art-pass phase after grey-box. |
| **III · Physics You Can Feel** | ✅ | Matter.js chosen deliberately. Arcade physics rejected. |
| **IV · Ship the Course, Not the Hole** | ✅ | Plan phases enforce grey-box-all-15 before any hole gets art-pass. See Phase 2. |
| **V · Two-Click Aim** | ✅ | FR-010 through FR-017 in spec pin this. |
| **VI · Persist Locally** | ✅ | `localStorage` only. FR-060 through FR-062. |
| **VII · Full Sound** | ✅ | Sound is a first-class subsystem, not a v2 addition. FR-050 through FR-053. |

**Complexity tracking:** No violations. Nothing in this plan requires justification against a simpler alternative.

## Project Structure

### Documentation (this feature)

```text
specs/001-divot-mvp/
├── plan.md              # This file
├── spec.md              # Feature specification (already exists)
├── research.md          # Phase 0 output (created by /speckit.plan step)
├── data-model.md        # Phase 1 output — save schema + hole config schema
├── quickstart.md        # Phase 1 output — how to run the game locally
├── contracts/           # Phase 1 output — interface contracts (HoleConfig, SaveState)
└── tasks.md             # Phase 2 output — created by /speckit.tasks
```

### Source Code (repository root)

**Structure Decision:** Single-project frontend, Vite + TypeScript, no split of frontend/backend because there is no backend. Standard Phaser scene-per-room layout with a `HoleScene` factory for the 15 game holes.

```text
divot/
├── index.html                     # Vite entrypoint
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.ts                    # Phaser.Game bootstrap, scene registration
│   ├── config/
│   │   ├── game.ts                # width, height, physics defaults, palette
│   │   └── holes/
│   │       ├── index.ts           # exports HOLES array of HoleConfig
│   │       ├── hole-0-range.ts    # Driving Range config
│   │       ├── hole-1-straight.ts
│   │       ├── hole-2-dogleg.ts
│   │       ├── hole-3-windmill.ts
│   │       ├── hole-4-bumpers.ts
│   │       ├── hole-5-waterfall.ts
│   │       ├── hole-6-gate.ts
│   │       ├── hole-7-volcano.ts
│   │       ├── hole-8-loop.ts
│   │       ├── hole-9-pit.ts
│   │       ├── hole-10-tunnel.ts
│   │       ├── hole-11-pendulum.ts
│   │       ├── hole-12-ridgeline.ts
│   │       ├── hole-13-corkscrew.ts
│   │       ├── hole-14-ferry.ts
│   │       └── hole-15-championship.ts
│   ├── scenes/
│   │   ├── BootScene.ts           # loads audio + fonts, transitions to Clubhouse
│   │   ├── ClubhouseScene.ts      # course-map hub, 15 pins, medal indicators
│   │   ├── HoleScene.ts           # generic hole scene — parameterised by HoleConfig
│   │   └── RangeScene.ts          # Driving Range — extends HoleScene with practice logic
│   ├── entities/
│   │   ├── Ball.ts                # Matter body + visual sprite + audio hooks
│   │   ├── Wall.ts                # static Matter body + wood-grain render
│   │   ├── Cup.ts                 # sensor body + trigger logic
│   │   ├── Windmill.ts            # rotating blade body
│   │   ├── SlidingGate.ts         # translating barrier on a track
│   │   ├── Pendulum.ts            # constrained swinging body
│   │   ├── Ferry.ts               # translating platform on a track
│   │   ├── WaterHazard.ts         # sensor for water penalty
│   │   ├── SandTrap.ts            # friction modifier zone
│   │   ├── Bumper.ts              # high-restitution round static body
│   │   ├── Tunnel.ts              # portal (enter → exit at paired body)
│   │   ├── LoopRamp.ts            # continuous ramp geometry
│   │   ├── Slope.ts               # ramp with directional gravity vector
│   │   └── index.ts
│   ├── systems/
│   │   ├── AimSystem.ts           # two-click cursor-vector aim mechanic
│   │   ├── ShotSystem.ts          # apply force to ball, increment counter
│   │   ├── ScoreSystem.ts         # track strokes, compute medals on completion
│   │   ├── UnlockSystem.ts        # Back Six unlock threshold
│   │   ├── SaveSystem.ts          # localStorage read/write
│   │   ├── AudioSystem.ts         # putt tock, roll loop, splash, cup rattle, medal jingle, ambient, music
│   │   └── HudSystem.ts           # par, shots, live power/distance readouts, mute toggle
│   ├── ui/
│   │   ├── Button.ts              # rounded rectangular button
│   │   ├── MedalIcon.ts           # bronze/silver/gold SVG-in-Phaser
│   │   ├── ResultBanner.ts        # "Hole Complete — Bronze!" overlay
│   │   ├── CourseMap.ts           # Clubhouse pin grid renderer
│   │   └── AimVector.ts           # visual arrow from cursor to ball
│   ├── types/
│   │   ├── HoleConfig.ts          # interface: geometry, obstacles, tee, cup, par, difficulty
│   │   ├── SaveState.ts           # interface: medals, bestScores, backSixUnlocked, muted
│   │   └── Vector.ts              # {x, y}
│   └── util/
│       ├── math.ts                # dot, cross, angle helpers
│       └── palette.ts             # colour tokens
├── assets/
│   ├── audio/
│   │   ├── putt-tock.ogg
│   │   ├── roll-turf-loop.ogg
│   │   ├── splash-water.ogg
│   │   ├── cup-rattle.ogg
│   │   ├── medal-jingle.ogg
│   │   ├── bird-ambient-loop.ogg
│   │   └── music-ambient-loop.ogg
│   └── fonts/
│       └── (loaded from Google Fonts CDN in index.html — Fredoka, IBM Plex Mono)
└── tests/
    ├── unit/
    │   ├── ScoreSystem.spec.ts
    │   ├── UnlockSystem.spec.ts
    │   └── SaveSystem.spec.ts
    └── (no integration/e2e for MVP — manual playtest gates)
```

## Implementation Phases

### Phase 0 — Research & Scaffolding *(before writing any game logic)*

1. **Bootstrap the repo** — `npm create vite@latest . -- --template vanilla-ts`, add `phaser`, `matter-js` (bundled with phaser 3.60+), `vitest`. Wire `main.ts` → empty Phaser.Game with a placeholder scene.
2. **Verify Matter.js integration** — spin up a scene with one ball and 4 walls; confirm the ball bounces, friction settles, and 60 FPS holds.
3. **Verify audio** — load one audio file, play on mouse click. Confirm Chrome autoplay policy is handled (audio unlocked after first user gesture).
4. **Verify localStorage** — read/write a JSON blob, page reload retrieves it.
5. **Output:** `research.md` documenting any surprises + baseline performance measurements.

**Gate:** empty scene renders, ball bounces, sound plays, save persists. If any of these fails, stop and diagnose before proceeding.

### Phase 1 — Contracts & Data Model

Freeze the two interfaces the rest of the code will consume. **HoleConfig** and **SaveState** as documented above. Output `data-model.md`, `contracts/HoleConfig.ts`, `contracts/SaveState.ts`.

**Gate:** both interfaces compile with `strict: true`. No hole-specific logic exists yet outside these contracts.

### Phase 2a — MVP Vertical Slice *(Range + Hole 1, fully finished)*

**Constitution IV (v1.2) mandates:** prove the full pipeline end-to-end on one hole before scaling.

Build order:
1. **BootScene + ClubhouseScene** — minimum viable hub with 15 pins (14 locked/static, only Range + Hole 1 clickable).
2. **AimSystem + ShotSystem** — port the two-click aim from Sketch 01.
3. **HoleScene generic + Range** — first playable scene.
4. **Hole 1 · Straight & True** — grey-box.
5. **Physics tune** — friction, bounce, air-drag values calibrated to feel-match Sketch 01.
6. **Sound wiring** — putt, roll, cup, splash, medal, ambient, music. All 7 clips.
7. **Save + Medal + Result Banner** — end-to-end scoring loop.
8. **Art pass** — Range + Hole 1 + shared entities (Wall, Ball, Cup, TeeMat, Fairway) rendered in photo-drone realism. Wood butt-joints included.
9. **Polish** — trajectory preview (optional), medal animation, first-run hint on Range.
10. **Deploy** — `vite build` → `file://` play → optional GitHub Pages.

**Gate — MVP ship criteria:**
- All 5 acceptance scenarios for User Story 1 pass by playtest
- All 7 acceptance scenarios for User Story 2 on Hole 1 pass
- Physics feel matches Sketch 01 (Ford sign-off)
- 60 FPS holds on Range and Hole 1
- Photo-drone realism aesthetic bar achieved on the 2 scenes
- Full sound package works on Chrome, Safari, Firefox
- localStorage save persists across reload
- Playable double-click after `vite build`

**MVP time estimate: ~26–37 hours (~10–14 sessions).**

### Phase 2b — Scale-Out (Holes 2–15)

Once MVP is deployed and Ford has signed off on the feel, remaining 14 holes are added **one at a time, full pipeline**, not batched. For each hole:

1. Config file (`src/config/holes/hole-N-*.ts`) — grey-box geometry
2. New obstacle entity if needed (some are shared: Slope, Tunnel, LoopRamp reused)
3. Play-test → tune par and mechanics
4. Art pass (using template from MVP)
5. Sound triggers (uses existing AudioSystem)

**Order** (roughly increasing complexity):
- Hole 2 · Dogleg → 3 · Windmill → 4 · Bumpers → 5 · Waterfall (first slope)
- Hole 6 · Gate → 7 · Volcano → 8 · Loop → 9 · Pit (Front Nine complete)
- Wire Unlock (Back Six pins go live)
- Hole 10 · Tunnel → 11 · Pendulum → 12 · Ridgeline → 13 · Corkscrew → 14 · Ferry → 15 · Championship

**Per-hole time estimate: ~2.5–3.5h.**
**Scale-out total: ~35–50h.**

### Phase 3 — Full-Course Polish

- Cross-hole consistency review (all art pass matches)
- Championship composite hole final tune
- Playtest with an external tester
- Bug fixes discovered during full-course playthroughs

**Gate:** feels shippable end-to-end.

### Phase 4 — v1.0 Ship

- Final `vite build`
- GitHub repo `aanandi2021/divot`
- Optional Pages hosting
- README + screenshots

**Gate:** playable double-click. Shareable link if hosted.

## Task Estimate (revised)

- **Phase 0:** 1 short session
- **Phase 1:** 1 short session
- **Phase 2a (MVP):** **~26–37h** · 10–14 sessions · **this is the first shippable milestone**
- **Phase 2b (Scale-Out):** **~35–50h** · 14 holes × 2.5–3.5h each
- **Phase 3:** 4–8h · 2–3 sessions
- **Phase 4:** 1–2h · 1 session

**Total realistic effort:** 65–100 focused hours. Achievable as:
- MVP alone in a concentrated 2-week evening push
- Full v1.0 across 2–4 months evenings/weekends, or a focused 4-week push

**`HoleConfig`** (the schema every hole file exports):
```ts
interface HoleConfig {
  id: number;                    // 0..15
  name: string;
  par: number;                   // 2..5
  difficulty: 1 | 2 | 3 | 4 | 5;
  worldSize: { w: number; h: number };
  tee: { x: number; y: number };
  cup: { x: number; y: number; radius: number };
  walls: WallSpec[];             // array of {x,y,w,h,angle?}
  obstacles: ObstacleSpec[];     // typed union: windmill, gate, pendulum, ferry, bumper, tunnel, loop
  hazards: {
    water: RectSpec[];
    sand: RectSpec[];
  };
  slopes: SlopeSpec[];           // {rect, gravityVector}
  camera: { x: number; y: number; zoom: number };
  outdoor: boolean;              // for ambient birdsong
}
```

**`SaveState`** (the localStorage blob):
```ts
interface SaveState {
  version: 1;
  medals: Record<number, 'bronze' | 'silver' | 'gold'>;
  bestScores: Record<number, number>;
  backSixUnlocked: boolean;
  mutedAudio: boolean;
}
```

**Output:** `data-model.md`, `contracts/HoleConfig.ts`, `contracts/SaveState.ts`.

**Gate:** both interfaces compile with `strict: true`. No hole-specific logic exists yet outside these contracts.


## Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Matter.js physics feel "wrong" (floaty, bouncy, jittery) | Kills the game | Phase 0 has an explicit physics-tune step. Baseline the feel on Hole 1 before Hole 2 begins. |
| Ball tunneling through walls at high speed | Game-breaking bug | Set a max shot velocity that's below Matter.js's tunneling threshold at 60fps. Use continuous collision detection where available. |
| Art pass balloons scope | Ship slips | Phase gate: MVP art on 1 hole first, then replicate per hole in Phase 2b. If art takes too long, cut features (defer Championship, defer some Back Six). |
| Audio autoplay policies (Chrome/Safari) | Silence on load | Standard fix: unlock audio on first user gesture. Test in MVP Audio subsystem step. |
| localStorage cleared surprises player | Bad UX | Show a one-time "New round?" prompt on first load. Consider export/import in Phase 3 polish. |
| Ford (developer + designer + tester) burns out | Project stalls | Aggressive scope discipline. MVP is a real shippable milestone — could stop there and be proud. |
| Risky mechanic (windmill/slope/loop) doesn't work in Matter.js | Wasted implementation hours | **Constitution IX** — micro-MVPs (µ2, µ3, µ4) validate before implementation. See tasks.md. |

## What Comes Next

`/speckit.tasks` will explode this plan into concrete tasks — one row per hole, one row per entity, one row per system, one row per phase gate. Then `/speckit.implement` starts building.

The task list also codifies the **4 micro-MVPs** (Constitution IX): µ2 Windmill, µ3 Slope, µ4 Loop, µ5 Wood-Grain Art — each is a 15–60 min sketch that gates the corresponding implementation task.

---

**Plan status:** Ready for `/speckit.tasks`.
