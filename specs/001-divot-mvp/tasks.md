---
description: "Task list for Divot MVP implementation"
---

# Tasks: Divot MVP (17-Room Course)

**Input**: Design documents from `specs/001-divot-mvp/`
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [constitution](../../.specify/memory/constitution.md) v1.1.0
**Feature branch**: `001-divot-mvp`

## Format: `[ID] [P?] [Story] Description — path`

- **[P]** — Task can run in parallel with peers (different files, no dependencies)
- **[Story]** — `US1`..`US5` maps to user stories in spec.md, `INF` for infrastructure, `HOLE-N` for hole-specific work
- Every task references an exact file path

## Learnings from Sketch 01 (Constitution VIII)

Baked into the tasks below:
- **Physics** — the Matter.js body settings that felt right in sketch (friction: 0.02, frictionAir: 0.025, bounce: 0.6, no gravity for top-down) are the starting values for v1. Codified in T101.
- **Cup detection** — per-frame `distance-to-cup + velocity` check works better than Matter sensor collisions. Sensor also OK as a redundant trigger. Codified in T203 + T206.
- **Aim** — the 240px max-drag / linear power scaling felt correct. Codified in T110.
- **Audio** — synthesised WebAudio (putt, cup, splash, medal jingle, roll loop) works for prototyping. v1 wants real audio clips but should preserve the *envelopes and timing* proven in sketch. Codified in T301–T307.

---

## Micro-MVPs (Constitution IX — Validation Ladder)

Each of the four risky mechanics gets a **15–60 min micro-MVP sketch** *before* its implementation task. Fails on the sketch → revise the spec/plan before big investment.

| ID | Micro-MVP | File | Validates | Gates implementation of | Est. time |
|:---:|---|---|---|---|:---:|
| **µ1** | Aim + physics + save + cup detection | `sketches/hole-1-first-playable.html` ✅ | Full MVP stack (already done as Sketch 01) | Phase 5–7 (MVP) | done |
| **µ2** | Windmill collision | `sketches/µ2-windmill.html` | Matter.js handles rotating body → ball collision cleanly; blade timing feels fair | T103, T104 | 20–40 min |
| **µ3** | Slope gravity | `sketches/µ3-slope.html` | Ball rolls down slope naturally without jitter or wobble; settles at base | T107, T108, T143 | 20–40 min |
| **µ4** | Loop-the-Loop | `sketches/µ4-loop.html` | Matter.js keeps ball on 360° track without escape at reasonable speeds | T113, T114, T144 | 30–60 min |
| **µ5** | Photo-real wood-grain rendering | `sketches/µ5-wood-grain.html` | Canvas-drawn wood matches aesthetic mockup at game resolution; butt-joints render cleanly | T200 (kicks off Art Pass) | 20–40 min |

**Rule:** If µN fails, halt the corresponding implementation task, revise the plan, and either replace the mechanic or find a different approach *before* investing the implementation hours.

---

## Phase 1 · Setup (Shared Infrastructure) — sequential

**Purpose**: Bootstrap the Vite + TypeScript + Phaser project, verify tooling.

- [ ] **T001** [INF] Bootstrap Vite + TypeScript project — run `npm create vite@latest . -- --template vanilla-ts` in `~/coding/divot`. Answer prompts to overwrite any existing sketch/spec-adjacent files (guard `sketches/` and `specs/` and `.specify/`).
- [ ] **T002** [INF] Install runtime dependencies: `npm install phaser@^3.90.0` — file: `package.json`
- [ ] **T003** [INF] Install dev dependencies: `npm install -D vitest @types/node prettier` — file: `package.json`
- [ ] **T004** [INF] Configure `tsconfig.json` with strict mode, `esModuleInterop`, `moduleResolution: "bundler"`, target ES2022 — file: `tsconfig.json`
- [ ] **T005** [INF] Configure `vite.config.ts` — set base to `./` so build works at `file://`; set publicDir to `assets` — file: `vite.config.ts`
- [ ] **T006** [P] [INF] Add `.prettierrc` with 2-space indent, single quotes, no trailing commas — file: `.prettierrc`
- [ ] **T007** [P] [INF] Add `.gitignore` for `node_modules`, `dist`, `.DS_Store` — file: `.gitignore`
- [ ] **T008** [P] [INF] Write `README.md` — 1-page project pitch, quickstart, links to spec + plan + constitution — file: `README.md`

**Gate:** `npm run dev` starts and renders an empty page. `npm run build` produces a dist/ folder. `npm run test` (vitest) runs and finds no tests.

---

## Phase 2 · Foundational (Blocking) — sequential

**Purpose**: Core Phaser bootstrap, save system, aim system. Nothing user-facing yet; every scene depends on these.

- [ ] **T009** [INF] `src/main.ts` — Phaser.Game bootstrap with an empty BootScene. Verify canvas renders. — file: `src/main.ts`
- [ ] **T010** [INF] `src/config/game.ts` — export game width/height, physics defaults (gravity 0, no debug), Matter world settings from sketch — file: `src/config/game.ts`
- [ ] **T011** [INF] `src/util/palette.ts` — export PAL colour tokens from sketch (grass, wood, water, sand, ball, flag, aim, HUD) — file: `src/util/palette.ts`
- [ ] **T012** [INF] `src/util/math.ts` — helpers: `distance(a,b)`, `normalize(v)`, `clamp(n,min,max)` — file: `src/util/math.ts`
- [ ] **T013** [INF] `src/types/Vector.ts` — `interface Vector { x: number; y: number }` — file: `src/types/Vector.ts`
- [ ] **T014** [INF] `src/contracts/SaveState.ts` — TypeScript interface for the localStorage save blob per data-model — file: `src/contracts/SaveState.ts`
- [ ] **T015** [INF] `src/contracts/HoleConfig.ts` — full HoleConfig interface per data-model — file: `src/contracts/HoleConfig.ts`
- [ ] **T016** [INF] `src/systems/SaveSystem.ts` — read/write `divot.save` in localStorage, migration-safe (checks `version` field) — file: `src/systems/SaveSystem.ts`
- [ ] **T017** [INF] `tests/unit/SaveSystem.spec.ts` — vitest: round-trip save, empty state defaults, corrupted-JSON recovery — file: `tests/unit/SaveSystem.spec.ts`
- [ ] **T018** [INF] `src/systems/ScoreSystem.ts` — pure functions: `computeMedal(strokes, par)`, `bestMedal(a,b)`, `strokeDiff(strokes,par)` — file: `src/systems/ScoreSystem.ts`
- [ ] **T019** [INF] `tests/unit/ScoreSystem.spec.ts` — vitest: par → bronze, birdie → silver, eagle → gold, bogey → null, medal upgrade preserves higher tier — file: `tests/unit/ScoreSystem.spec.ts`
- [ ] **T020** [INF] `src/systems/UnlockSystem.ts` — pure function: `isBackSixUnlocked(save): boolean` (all Front Nine 1–9 must have any medal) — file: `src/systems/UnlockSystem.ts`
- [ ] **T021** [INF] `tests/unit/UnlockSystem.spec.ts` — vitest: 9-of-9 unlocks, 8-of-9 does not, missing hole IDs handled — file: `tests/unit/UnlockSystem.spec.ts`

**Gate:** Foundation tests all pass. TypeScript builds with zero errors. Phaser renders empty scene at 60fps.

---

## Phase 3 · Aim + Physics Systems (Blocking for Hole scenes)

**Purpose**: Two-click cursor-vector aim and shared physics helpers. Consumed by Range + every Hole scene.

- [ ] **T022** [INF] `src/entities/Ball.ts` — Ball class wrapping a Matter body + Graphics visual. Physics values from sketch (T101). Exports `x`, `y`, `body`, `stopped()`, `setPosition()`. — file: `src/entities/Ball.ts`
- [ ] **T023** [INF] `src/entities/Wall.ts` — Wall class: static Matter body + wooden-plank Graphics render. Preserves sketch's wood-grain look. Corner butt-joint TODO commented for Phase 4 art-pass. — file: `src/entities/Wall.ts`
- [ ] **T024** [INF] `src/entities/Cup.ts` — Cup class: sensor body + visual (dark circle + flag). Emits `dropped` event via Phaser event emitter. Uses distance+velocity check from sketch (lip-out on fast approach). — file: `src/entities/Cup.ts`
- [ ] **T025** [INF] `src/systems/AimSystem.ts` — port and clean up the two-click aim from sketch. Interface: `new AimSystem(scene, ball, {onFire, maxPower, forceScale})`. Supports pointer + keyboard cancel. — file: `src/systems/AimSystem.ts`
- [ ] **T026** [INF] `src/ui/AimVector.ts` — Graphics wrapper that draws the vector arrow, cursor dot, and power ring. Called by AimSystem. — file: `src/ui/AimVector.ts`
- [ ] **T027** [INF] `src/systems/ShotSystem.ts` — applies force to ball based on aim result, increments shot counter, emits `shot-fired` event — file: `src/systems/ShotSystem.ts`
- [ ] **T028** [INF] `src/systems/HudSystem.ts` — reusable HUD chips (Hole / Par / Shots / Best) + power-and-distance readout during aim — file: `src/systems/HudSystem.ts`
- [ ] **T029** [P] [INF] `src/ui/Button.ts` — reusable rounded-rect button component — file: `src/ui/Button.ts`

**Gate:** Aim mechanic works on a test scene: click ball, see vector, click again, ball fires. Physics feel matches sketch.

---

## Phase 4 · Audio (Blocking for Sound-related stories)

**Purpose**: Audio subsystem loading + playback. Uses real sound files, but envelopes/timing calibrated to sketch WebAudio.

- [ ] **T030** [INF] Source or create audio clips: putt-tock, roll-turf-loop, splash-water, cup-rattle, medal-jingle, bird-ambient-loop, music-ambient-loop. Royalty-free preferred. — file: `assets/audio/*.ogg`
- [ ] **T031** [INF] `src/systems/AudioSystem.ts` — Phaser audio wrapper. Methods: `putt()`, `startRoll(speed)`, `updateRoll(speed)`, `stopRoll()`, `splash()`, `cupRattle()`, `medalJingle(tier)`, `startBirds()`, `startMusic()`, `mute(on)`. Autoplay-unlock on first click. — file: `src/systems/AudioSystem.ts`
- [ ] **T032** [INF] `src/scenes/BootScene.ts` — loads all audio and fonts, then transitions to Clubhouse — file: `src/scenes/BootScene.ts`
- [ ] **T033** [INF] Wire AudioSystem into ShotSystem (putt sound on fire) and Ball (roll loop while moving) and Cup (rattle on drop) — files: `src/systems/ShotSystem.ts`, `src/entities/Ball.ts`, `src/entities/Cup.ts`

**Gate:** All 7 audio clips play on their triggers in Chrome, Safari, Firefox. Mute toggle silences all. Autoplay unlock works on first click.

---

## Phase 5 · Clubhouse Hub (User Story 1 support) 🎯 MVP prerequisite

**Purpose**: The Clubhouse scene — course-map hub with pins, medal indicators, best-scores, unlock gating.

- [ ] **T040** [US1] `src/ui/MedalIcon.ts` — SVG-drawn bronze/silver/gold badge component — file: `src/ui/MedalIcon.ts`
- [ ] **T041** [US1] `src/ui/CourseMap.ts` — pin grid layout for 15 holes + Range. Each pin: name, medal indicator, best score, lock/unlock state, hover state. — file: `src/ui/CourseMap.ts`
- [ ] **T042** [US1] `src/scenes/ClubhouseScene.ts` — main hub scene. Renders title, save summary (medal counts), CourseMap, "Play in Order" button. Handles pin clicks → scene transitions. — file: `src/scenes/ClubhouseScene.ts`
- [ ] **T043** [P] [US1] Wire UnlockSystem into CourseMap — Back Six pins show padlock unless unlocked — file: `src/ui/CourseMap.ts`

**Gate:** Fresh install → Clubhouse loads with all pins visible, Back Six locked. Clicking Range or Hole 1 pin logs a transition (target scene not yet built).

---

## Phase 6 · Driving Range (User Story 1) 🎯 MVP core

**Purpose**: Hole 0 — practice range. Delivers User Story 1 in full.

- [ ] **T050** [US1] `src/config/holes/hole-0-range.ts` — HoleConfig for Range: long fairway, tee at left, distance markers, no cup — file: `src/config/holes/hole-0-range.ts`
- [ ] **T051** [US1] `src/scenes/RangeScene.ts` — Range scene. Loads HoleConfig, spawns ball at tee, renders distance markers, live distance readout, respawns ball 700ms after stop, tracks shot count. — file: `src/scenes/RangeScene.ts`
- [ ] **T052** [P] [US1] Register RangeScene in `src/main.ts` — file: `src/main.ts`

**Acceptance test (US1)**: Complete the Driving Range user story from spec — click ball, take three shots at increasing power, land near 30m marker on one attempt.

**Gate:** All 5 acceptance scenarios from US1 pass by manual playtest.

---

## Phase 7 · HoleScene Framework (Prerequisite for all Hole tasks)

**Purpose**: Generic `HoleScene` class parameterised by HoleConfig. Every Hole 1–15 uses this.

- [ ] **T060** [US2] `src/scenes/HoleScene.ts` — base class. Loads HoleConfig, builds walls + tee + cup + hazards + obstacles, spawns ball, wires AimSystem + ShotSystem + AudioSystem + HudSystem. Emits `hole-complete` on cup drop with stroke count. — file: `src/scenes/HoleScene.ts`
- [ ] **T061** [US2] `src/ui/ResultBanner.ts` — "Hole Complete — Bronze!" overlay component with Next / Replay / Clubhouse buttons — file: `src/ui/ResultBanner.ts`
- [ ] **T062** [US2] Wire ScoreSystem + SaveSystem into HoleScene — on `hole-complete`, compute medal, persist best, show ResultBanner — file: `src/scenes/HoleScene.ts`
- [ ] **T063** [P] [US2] Wire "Quit to Clubhouse" button + Escape key into HoleScene — file: `src/scenes/HoleScene.ts`

**Gate:** A stubbed HoleConfig (rectangle, tee, cup, no obstacles) plays correctly through HoleScene: aim, fire, sink, banner, medal, save.

---

## Phase 8 · Front Nine (User Story 2) — hand-crafted holes

**Purpose**: 9 hole config files. Each is a table row below. Order = build order (from simplest to most mechanically ambitious).

**Per-hole workflow:** Config file (`src/config/holes/hole-N-*.ts`) → grey-box playtest → tune par → tune obstacle mechanics → mark done in this list. NO art-pass yet (Constitution IV).

- [ ] **T101** [HOLE-1] `src/config/holes/hole-1-straight.ts` — Straight & True (par 2, ⭑, dogleg chicane, no hazards) — file: `src/config/holes/hole-1-straight.ts`
- [ ] **T102** [HOLE-2] `src/config/holes/hole-2-dogleg.ts` — The Dogleg (par 3, ⭑⭑, hard 90° L-shape) — file: `src/config/holes/hole-2-dogleg.ts`
- [ ] **T103a** [µ2] Build `sketches/µ2-windmill.html` — CDN Phaser, ball + 4 walls + one rotating windmill body. Test blade collision at 3 speeds. **Pass criteria:** ball bounces off spinning blade correctly, no tunneling, timing gap feels fair.
- [ ] **T103** [HOLE-3] `src/entities/Windmill.ts` — rotating 4-blade obstacle Matter body — file: `src/entities/Windmill.ts`
- [ ] **T104** [HOLE-3] `src/config/holes/hole-3-windmill.ts` — The Windmill (par 3, ⭑⭑, timing gate) — file: `src/config/holes/hole-3-windmill.ts`
- [ ] **T105** [HOLE-4] `src/entities/Bumper.ts` — high-restitution round static body with visual — file: `src/entities/Bumper.ts`
- [ ] **T106** [HOLE-4] `src/config/holes/hole-4-bumpers.ts` — The Bumper Alley (par 3, ⭑⭑) — file: `src/config/holes/hole-4-bumpers.ts`
- [ ] **T107a** [µ3] Build `sketches/µ3-slope.html` — CDN Phaser, ball on a 15° slope zone with directional gravity vector applied via Matter beforeUpdate. **Pass criteria:** ball rolls down naturally, no jitter, settles at base with no residual wobble.
- [ ] **T107** [HOLE-5] `src/entities/Slope.ts` — slope zone with directional gravity vector applied via Matter beforeUpdate — file: `src/entities/Slope.ts`
- [ ] **T108** [HOLE-5] `src/config/holes/hole-5-waterfall.ts` — The Waterfall (par 3, ⭑⭑⭑, real slope physics) — file: `src/config/holes/hole-5-waterfall.ts`
- [ ] **T109** [HOLE-6] `src/entities/SlidingGate.ts` — translating barrier on a track — file: `src/entities/SlidingGate.ts`
- [ ] **T110** [HOLE-6] `src/config/holes/hole-6-gate.ts` — The Sliding Gate (par 3, ⭑⭑⭑) — file: `src/config/holes/hole-6-gate.ts`
- [ ] **T111** [HOLE-7] `src/entities/WaterHazard.ts` — sensor + penalty logic (+1 stroke, respawn at tee) — file: `src/entities/WaterHazard.ts`
- [ ] **T112** [HOLE-7] `src/config/holes/hole-7-volcano.ts` — The Volcano Green (par 3, ⭑⭑⭑, island green over water) — file: `src/config/holes/hole-7-volcano.ts`
- [ ] **T113a** [µ4] Build `sketches/µ4-loop.html` — CDN Phaser, ball entering a 360° curved loop. Test at 5 entry speeds. **Pass criteria:** ball completes the loop at moderate-plus speeds without escaping the track; low speeds fail gracefully (ball rolls back). ⚠️ Highest-risk micro-MVP — if this fails, the Loop-the-Loop hole may need a different mechanic (tunnel, spiral instead of true loop).
- [ ] **T113** [HOLE-8] `src/entities/LoopRamp.ts` — continuous curved geometry that keeps the ball on track through a 360° loop — file: `src/entities/LoopRamp.ts`
- [ ] **T114** [HOLE-8] `src/config/holes/hole-8-loop.ts` — The Loop-the-Loop (par 2, ⭑⭑⭑⭑, spectacle #1) — file: `src/config/holes/hole-8-loop.ts`
- [ ] **T115** [HOLE-9] `src/entities/Tunnel.ts` — portal pair — enter one, exit at paired body — file: `src/entities/Tunnel.ts`
- [ ] **T116** [HOLE-9] `src/entities/SandTrap.ts` — friction zone (~4× drag while ball is within) — file: `src/entities/SandTrap.ts`
- [ ] **T117** [HOLE-9] `src/config/holes/hole-9-pit.ts` — The Pit (par 3, ⭑⭑⭑, 3 tunnel exits) — file: `src/config/holes/hole-9-pit.ts`

**Acceptance test (US2)**: Play through Holes 1–9. Complete each. Confirm medals awarded correctly. Persistence works.
**Acceptance test (US3)**: On Hole 5 (Waterfall), a shot rolls off the slope and settles at the bottom naturally.

**Gate:** All 9 Front Nine holes are playable in grey-box. Best-scores + medals persist. No tunneling bugs. 60 FPS on every hole.

---

## Phase 9 · Back Six Unlock (User Story 4)

- [ ] **T130** [US4] Wire UnlockSystem check into ClubhouseScene — after each hole return, check `isBackSixUnlocked(save)` and update pin lock states — file: `src/scenes/ClubhouseScene.ts`
- [ ] **T131** [US4] "Back Six Unlocked" banner animation on first-time unlock (localStorage flag `divot.hasSeenUnlock`) — file: `src/scenes/ClubhouseScene.ts`

**Acceptance test (US4)**: Inject a save state with medals on all 9 Front Nine holes → reload → Back Six pins unlocked.

---

## Phase 10 · Back Six (User Story 2 continued) — hand-crafted holes

- [ ] **T140** [HOLE-10] `src/config/holes/hole-10-tunnel.ts` — The Tunnel Fork (par 3, ⭑⭑⭑) — uses Tunnel entity from T115 — file: `src/config/holes/hole-10-tunnel.ts`
- [ ] **T141** [HOLE-11] `src/entities/Pendulum.ts` — constrained swinging body via Matter constraint — file: `src/entities/Pendulum.ts`
- [ ] **T142** [HOLE-11] `src/config/holes/hole-11-pendulum.ts` — The Pendulum (par 3, ⭑⭑⭑⭑) — file: `src/config/holes/hole-11-pendulum.ts`
- [ ] **T143** [HOLE-12] `src/config/holes/hole-12-ridgeline.ts` — The Ridgeline (par 3, ⭑⭑⭑⭑) — uses Slope from T107 — file: `src/config/holes/hole-12-ridgeline.ts`
- [ ] **T144** [HOLE-13] `src/config/holes/hole-13-corkscrew.ts` — The Corkscrew (par 2/4, ⭑⭑⭑⭑, spectacle #2) — uses LoopRamp variant from T113 — file: `src/config/holes/hole-13-corkscrew.ts`
- [ ] **T145** [HOLE-14] `src/entities/Ferry.ts` — translating platform on a fixed track — file: `src/entities/Ferry.ts`
- [ ] **T146** [HOLE-14] `src/config/holes/hole-14-ferry.ts` — The Ferry (par 3, ⭑⭑⭑⭑) — file: `src/config/holes/hole-14-ferry.ts`
- [ ] **T147** [HOLE-15] `src/config/holes/hole-15-championship.ts` — The Championship (par 4, ⭑⭑⭑⭑⭑) — composite: dogleg + windmill + slope + water + sand — file: `src/config/holes/hole-15-championship.ts`

**Gate:** All 6 Back Six holes are playable in grey-box. Full 15-hole grey-box milestone reached — this is the Constitution IV mid-point.

---

## Phase 11 · Sound Pass (User Story 5)

- [ ] **T160** [US5] Wire `AudioSystem.putt()` into ShotSystem for every hole — file: `src/systems/ShotSystem.ts`
- [ ] **T161** [US5] Wire `AudioSystem.startRoll(speed)` + `updateRoll` + `stopRoll` into Ball based on velocity — file: `src/entities/Ball.ts`
- [ ] **T162** [US5] Wire `AudioSystem.splash()` into WaterHazard — file: `src/entities/WaterHazard.ts`
- [ ] **T163** [US5] Wire `AudioSystem.cupRattle()` + `medalJingle()` into HoleScene on hole-complete — file: `src/scenes/HoleScene.ts`
- [ ] **T164** [P] [US5] Wire `AudioSystem.startBirds()` on outdoor hole entry, stop on hole exit — file: `src/scenes/HoleScene.ts`
- [ ] **T165** [P] [US5] Wire `AudioSystem.startMusic()` in BootScene, fade during shot-taking — file: `src/scenes/BootScene.ts`, `src/systems/AimSystem.ts`
- [ ] **T166** [US5] Mute toggle in top-right of every scene, state persisted to save — file: `src/systems/HudSystem.ts`, `src/systems/SaveSystem.ts`

**Acceptance test (US5)**: Play any hole with headphones. Every triggered sound plays. Mute silences everything.

---

## Phase 12 · Art Pass (Photo-Drone Realism) — Constitution II

**Per-hole workflow:** Ford (or designer) reviews grey-box side-by-side with `aesthetic-comparison-topdown.html` panel 2. Then art tasks below fire for that hole.

**Attention to detail flagged in Q&A:** Wood butt-joints at wall corners — do NOT skip.

- [ ] **T199** [µ5] Build `sketches/µ5-wood-grain.html` — canvas render of a wood-grain plank at game resolution + 2 butt-joint styles (miter vs overlap). **Pass criteria:** matches `aesthetic-comparison-topdown.html` panel 2 quality bar. Ford visual sign-off.
- [ ] **T200** [ART] `src/entities/Wall.ts` art pass — replace flat plank with wood-grain plank shader/canvas. Corner butt-joints render explicitly (miter or overlap based on wall orientation). — file: `src/entities/Wall.ts`
- [ ] **T201** [ART] Astroturf shader/canvas — dense stipple, subtle mowing stripes, slight variance. Applied to all HoleScene fairways. — file: `src/entities/Fairway.ts` (new) + `src/scenes/HoleScene.ts`
- [ ] **T202** [ART] Water hazard art pass — gradient, ripples, specular highlights, brick coping — file: `src/entities/WaterHazard.ts`
- [ ] **T203** [ART] Sand trap art pass — rake marks, grain speckle, coping — file: `src/entities/SandTrap.ts`
- [ ] **T204** [ART] Ball art pass — dimple pattern, subtle shadow, roll-orientation indicator — file: `src/entities/Ball.ts`
- [ ] **T205** [ART] Cup art pass — depth shading, rim highlight, flag with hole number — file: `src/entities/Cup.ts`
- [ ] **T206** [ART] Windmill art pass — real wood blades, metal hub, animated rotation — file: `src/entities/Windmill.ts`
- [ ] **T207** [ART] Sliding Gate art pass — track, gate slats, motor housing — file: `src/entities/SlidingGate.ts`
- [ ] **T208** [ART] Pendulum art pass — real weighted bar, chain to pivot — file: `src/entities/Pendulum.ts`
- [ ] **T209** [ART] Ferry art pass — boat hull, rail, animated wake — file: `src/entities/Ferry.ts`
- [ ] **T210** [ART] Tee mat art pass — rubber texture, brand-plate look — file: `src/entities/TeeMat.ts` (new)
- [ ] **T211** [ART] Directional shadows — walls and obstacles cast shadows onto fairway (light source top-left, consistent across all holes) — files: multiple entities
- [ ] **T212** [ART] Concrete surround art — around every hole, matches the `aesthetic-comparison-topdown.html` panel 2 look — file: `src/scenes/HoleScene.ts`

**Gate:** Side-by-side visual review with the aesthetic mockup. Butt-joints on all walls verified. Photo-drone realism bar achieved on all 15 holes.

---

## Phase 13 · Polish (User Story 1-5 quality bar)

- [ ] **T300** [P] [POLISH] Trajectory preview during aim (thin dotted line predicting path — optional per spec open questions) — file: `src/systems/AimSystem.ts`, `src/ui/AimVector.ts`
- [ ] **T301** [P] [POLISH] Aim cancellation grace period tuning — file: `src/systems/AimSystem.ts`
- [ ] **T302** [P] [POLISH] Camera behaviour for large holes (Championship needs pan/zoom) — file: `src/scenes/HoleScene.ts`
- [ ] **T303** [P] [POLISH] Result banner animation (fade-in, medal spin) — file: `src/ui/ResultBanner.ts`
- [ ] **T304** [P] [POLISH] Medal earned toast animation when a new best is set — file: `src/scenes/HoleScene.ts`
- [ ] **T305** [P] [POLISH] Save-and-quit prompt if player leaves mid-hole — file: `src/scenes/HoleScene.ts`
- [ ] **T306** [P] [POLISH] Accessibility pass — high-contrast option, colourblind-safe medal colours — file: `src/systems/HudSystem.ts`, `src/ui/MedalIcon.ts`
- [ ] **T307** [P] [POLISH] First-run tutorial popover on Range — 2-line hint about the aim mechanic — file: `src/scenes/RangeScene.ts`

**Gate:** Playtest with someone unfamiliar with the game. They complete Range + Hole 1 in under 3 minutes without asking for help.

---

## Phase 14 · Deploy

- [ ] **T400** [DEPLOY] `npm run build` produces `dist/` that runs at `file://` — verify by double-clicking `dist/index.html`
- [ ] **T401** [DEPLOY] Create GitHub repo `aanandi2021/divot` (private) — push code — hosted URL: (none required for MVP, `file://` OK)
- [ ] **T402** [P] [DEPLOY] Optional: GitHub Pages hosting at `aanandi2021.github.io/divot/` for shareable link
- [ ] **T403** [P] [DEPLOY] Add `README.md` play instructions + screenshot(s) — file: `README.md`

**Gate:** Playable double-click. Shareable link if T402 done.

---

## Task Summary

- **Micro-MVPs (T103a, T107a, T113a, T199):** 4 tasks — Validation Ladder gates per Constitution IX
- **Setup + Foundational (T001–T029):** 29 tasks — bootstrap, tests, core systems
- **Clubhouse + Range (T040–T052):** 5 tasks — US1 delivered
- **HoleScene framework (T060–T063):** 4 tasks — required before any Hole content
- **Front Nine (T101–T117):** 17 tasks — 9 holes + 8 shared entities
- **Back Six unlock + holes (T130–T147):** 10 tasks — 6 holes + 2 entities + unlock
- **Sound pass (T160–T166):** 7 tasks
- **Art pass (T199, T200–T212):** 14 tasks
- **Polish (T300–T307):** 8 tasks
- **Deploy (T400–T403):** 4 tasks

**Total: 102 tasks** (4 micro-MVPs + 98 implementation tasks).

## Parallelization notes

Tasks marked **[P]** can run concurrently once their prerequisites are met. Notable parallel windows:
- After T028 (HUD): T029 (Button) can run alongside every Phase 5+ task
- After T060 (HoleScene): all Front Nine and Back Six hole tasks are internally sequential per hole but parallelizable across holes (different files)
- After T029 + T041 (CourseMap): T043 parallelises with US4 tasks
- All Art Pass tasks (T200–T212) parallelise once grey-box is locked

## User story → task map

| User Story | Priority | Tasks | Independently testable? |
|---|:---:|---|:---:|
| US1 · First Shot: The Range | P1 | T040–T052 (built on T009–T032) | ✅ |
| US2 · Play the Front Nine | P1 | T060–T063 + T101–T117 | ✅ (each hole individually) |
| US3 · Physics That Feel Right | P1 | T022, T023, T027, T107 (Slope), plus every hole's config tune | ✅ (per hole) |
| US4 · Back Six Unlock | P2 | T130–T131 + T140–T147 | ✅ |
| US5 · Full Sound Experience | P2 | T030–T033 + T160–T166 | ✅ |

## Constitution compliance check

| Principle | Enforced by tasks |
|---|---|
| I · Buildable Geometry | Hole config files (T101–T117, T140–T147) — every wall a right angle, real materials |
| II · Photo-Drone Realism | Phase 12 (T199, T200–T212) — dedicated art pass |
| III · Physics You Can Feel | T022, T027, T107, plus per-hole physics tuning gates |
| IV · Ship the Vertical Slice, Then Scale (v1.2) | MVP = T001–T063 + T101 + Hole 1 art + T400s. Scale-out follows. |
| V · Two-Click Aim | T025, T026 |
| VI · Persist Locally | T014, T016, T017 |
| VII · Full Sound | Phase 4 + Phase 11 |
| VIII · Sketches Are Encouraged | Sketch 01 (`hole-1-first-playable.html`) already delivered learnings baked into T101 (physics), T025 (aim), T024 (cup), T031 (audio envelopes) |
| IX · Validation Ladder (v1.3) | 4 micro-MVPs (T103a, T107a, T113a, T199) gate the risky implementation tasks they precede |

---

**Status:** Ready for `/speckit.implement`. Recommend starting at T001 in order.
