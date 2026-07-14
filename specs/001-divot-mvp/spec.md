# Feature Specification: Divot — MVP (17-Room Course)

**Feature Branch**: `001-divot-mvp`

**Created**: 2026-07-13

**Status**: Draft

**Input**: User description: "9-hole minigolf game (expanded to 15 holes + driving range + clubhouse hub) with photo-drone realism aesthetic, realistic Matter.js physics, and a two-click cursor-vector aim mechanic. Front Nine main course + unlockable Back Six. Medal-based scoring. Full sound. Local persistence."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — First Shot: The Driving Range (Priority: P1)

Aaron opens Divot for the first time. He lands in the Clubhouse hub, sees a course-map with 15 pins (Front Nine visible with pin icons, Back Six locked with padlocks), and a prominent "Driving Range" entrypoint at the top of the map. He clicks the Range.

The Range presents a straight fairway with distance markers on the ground (5m, 10m, 20m, 30m). A single white ball sits on the tee. Aaron clicks the ball — the cursor becomes a targeting reticle. As he moves the mouse away from the ball, a vector arrow draws from cursor-tip to ball, showing him direction and power. Live readouts display "Distance: 47px" and "Power: 340". He clicks a second time, the ball fires, rolls across the fairway, and stops. The distance travelled is displayed. A new ball auto-spawns at the tee. He can shoot infinitely to learn the feel.

A "Return to Clubhouse" button exits back to the hub.

**Why this priority**: This IS the game's onboarding. If a new player can't learn the aim mechanic on the Range in under a minute, no other hole matters. The Range is standalone and playable in isolation.

**Independent Test**: Load Divot, click Range from the hub, take three shots at increasing power, land within 5m of the 30m marker on one attempt. Confirms aim mechanic, physics, and hub navigation. No medal system or persistence required for this to be shippable.

**Acceptance Scenarios**:

1. **Given** a fresh install, **When** the player loads Divot, **Then** the Clubhouse hub is the first screen with the Range accessible.
2. **Given** the player is on the Range, **When** they click the ball once, **Then** the cursor becomes a targeting reticle and moving the cursor draws a vector arrow with live distance and power readouts.
3. **Given** the reticle is active with the cursor 100px from the ball, **When** the player clicks a second time, **Then** the ball fires in the direction opposite to the cursor with power proportional to that 100px distance.
4. **Given** a ball has been fired and settled, **When** it comes to rest, **Then** a new ball spawns at the tee and the previous ball's travel distance is displayed.
5. **Given** the player is on the Range, **When** they press the "Return to Clubhouse" button or Escape key, **Then** they return to the hub.

---

### User Story 2 — Play the Front Nine (Priority: P1)

Aaron clicks Hole 1 · Straight & True from the hub. The hole loads: rectangular course, wooden perimeter walls, a gentle dogleg, tee mat on the left with a ball on it, cup with red flag on the right. Par 2 is displayed in the corner. Shot counter reads 0.

Aaron takes his first shot. The ball rolls, bounces off the far wall, settles short of the cup. Shot counter reads 1. He takes a second shot, the ball drops into the cup with a satisfying "clink" sound. The shot counter reads 2. A "Hole Complete — Par!" banner appears with a **Bronze Medal**. Options: "Next Hole", "Replay", "Back to Clubhouse".

He picks Next Hole. Hole 2 · The Dogleg loads. Repeat.

**Why this priority**: This is the actual game. The Front Nine is the shippable core experience. Even without the Back Six unlock or all 15 holes, 9 playable holes is a complete product.

**Independent Test**: Play through Holes 1 through 9. Complete each. Confirm medals awarded correctly (Bronze at par, Silver at −1, Gold at −2). Confirm progression from hole to hole and return-to-hub works. Confirm best score persists after page reload.

**Acceptance Scenarios**:

1. **Given** the Clubhouse hub, **When** the player clicks Hole 1's pin, **Then** Hole 1 loads with the ball on the tee and par displayed.
2. **Given** the player has taken shots equal to par, **When** the ball drops in the cup, **Then** a Bronze Medal is awarded, stored in localStorage, and reflected on the hub.
3. **Given** the player has taken shots equal to par−1 (birdie), **When** the ball drops in the cup, **Then** a Silver Medal is awarded.
4. **Given** the player has taken shots equal to par−2 (eagle) or better, **When** the ball drops in the cup, **Then** a Gold Medal is awarded.
5. **Given** the player has taken more shots than par, **When** the ball drops in the cup, **Then** the hole is complete but no medal is awarded (a "Bogey +N" or similar tag is shown).
6. **Given** the player is mid-hole, **When** they hit Quit, **Then** they return to the Clubhouse with no medal awarded and no shot count saved.
7. **Given** the player completes the Front Nine with a medal on all 9 holes, **When** they return to the hub, **Then** the Back Six unlocks (padlocks removed, pins now clickable).

---

### User Story 3 — Physics That Feel Right (Priority: P1)

On Hole 5 · The Waterfall, Aaron faces a sloped descent from an upper platform to a lower green. He fires a shot with moderate power. The ball rolls off the upper platform edge, accelerates down the slope, rolls onto the lower green, and *settles at the base of the slope* — not rolling forever, not stopping unnaturally on the incline. Aaron feels the physics.

He tries again with lower power. Ball starts to roll down the slope but the slope's grade is enough that gravity keeps it accelerating; it still reaches the lower green.

He tries with too much power on a different hole and bounces off two walls, losing energy each bounce, before settling well past the cup.

**Why this priority**: Realistic physics is Core Principle III. If the ball feels floaty, sticky, or spring-loaded, the game fails on its central promise. This is not a separate feature — it is a quality bar every hole must meet.

**Independent Test**: Take a shot at 50% power on flat astroturf; measure roll distance. Take same shot on a 15° downslope; measure distance. Confirm the downslope roll is longer and continuous (no jitter/wobble). Bank a shot at 45° off a wall; confirm angle-of-reflection matches within 3° and ball loses ~10-20% velocity per bounce.

**Acceptance Scenarios**:

1. **Given** flat astroturf, **When** the player fires a shot at moderate power, **Then** the ball decelerates smoothly and comes to rest with no visible jitter.
2. **Given** a sloped surface, **When** a ball rolls onto the slope, **Then** its velocity changes in a physically believable way (accelerating downslope, decelerating upslope).
3. **Given** a wall collision, **When** the ball bounces, **Then** the angle of reflection is correct and the ball loses 10–25% of its velocity per bounce.
4. **Given** the ball rolls into water, **When** it enters, **Then** it splashes (sound + visual), stops, and respawns at the last valid position with a +1 stroke penalty.
5. **Given** the ball rolls into a sand trap, **When** it enters, **Then** friction dramatically increases (ball stops within ~1 second) without any penalty stroke.

---

### User Story 4 — The Back Six Unlock (Priority: P2)

Aaron has earned a medal on all 9 Front Nine holes. He returns to the Clubhouse. The Back Six pins (holes 10–15) glow, padlocks animate off. A banner: "Back Six unlocked — the mystery course awaits." He clicks Hole 10 · The Tunnel Fork.

**Why this priority**: Unlock is the payoff for finishing the main game. It's a small, contained feature but essential to the game's shape.

**Independent Test**: Set localStorage to have a medal on all 9 front-nine holes (using dev tools). Reload. Confirm Back Six pins are unlocked. Confirm clicking Hole 10 loads it.

**Acceptance Scenarios**:

1. **Given** medals on all 9 Front Nine holes are stored, **When** the player enters the Clubhouse, **Then** the Back Six pins are unlocked (padlocks removed).
2. **Given** at least one Front Nine hole has no medal, **When** the player enters the Clubhouse, **Then** the Back Six pins remain locked (padlocks visible, click is blocked with a message like "Medal all Front Nine holes to unlock").
3. **Given** localStorage is cleared, **When** the game loads, **Then** all Back Six pins are locked and medals reset (fresh save).

---

### User Story 5 — Full Sound Experience (Priority: P2)

Every action produces audible feedback. The putt "tock" is crisp. Rolling on turf sounds like rolling on turf. Water splash is wet. The cup rattle is deeply satisfying. Ambient birdsong plays quietly at the start of outdoor holes. A slow ambient piano/synth music bed underlays the whole experience. A medal jingle plays on hole completion. A single "mute" toggle in the corner is respected everywhere.

**Why this priority**: Sound is Core Principle VII. It ships with the game, not after.

**Independent Test**: Play any hole with headphones. Verify: putt sound on shot, rolling sound during travel, splash on water entry, cup rattle on completion, medal jingle after result banner, ambient music underneath. Toggle mute — all sounds cease.

**Acceptance Scenarios**:

1. **Given** the mute button is off, **When** the player takes any shot, **Then** a putt "tock" sound plays.
2. **Given** the ball is rolling, **When** its velocity is above a threshold, **Then** a rolling-on-turf loop plays at volume proportional to speed.
3. **Given** the ball enters water, **When** the water collision fires, **Then** a splash sound plays.
4. **Given** the ball drops in the cup, **When** the "hole complete" logic runs, **Then** the cup rattle plays followed by a medal jingle if a medal was earned.
5. **Given** the mute button is toggled on, **When** any sound event fires, **Then** no audio plays.

---

## Requirements *(mandatory)*

### Functional Requirements

**Rooms & Navigation**

- **FR-001**: The game consists of 17 rooms: 1 Clubhouse hub + 1 Driving Range (Hole 0) + 9 Front Nine holes + 6 Back Six holes.
- **FR-002**: The Clubhouse is the default entry point. It displays a course-map with 15 hole pins.
- **FR-003**: Hole 0 (Driving Range) is always accessible from the Clubhouse.
- **FR-004**: Front Nine pins (Holes 1–9) are always accessible.
- **FR-005**: Back Six pins (Holes 10–15) are locked until the player earns a medal on all 9 Front Nine holes.
- **FR-006**: A "Play in Order" button on the Clubhouse starts a linear tour beginning at Hole 1 (or the first hole without a medal, TBD in playtest).
- **FR-007**: Every hole has a persistent "Quit to Clubhouse" button and Escape-key shortcut.

**Aim & Shot Mechanic**

- **FR-010**: Clicking on the ball activates the club and switches the cursor to a targeting reticle.
- **FR-011**: While the reticle is active, moving the cursor draws a vector arrow from the cursor tip to the ball.
- **FR-012**: The shot direction is opposite to the cursor's position relative to the ball (ball travels away from the cursor).
- **FR-013**: The shot power scales linearly with the cursor's pixel distance from the ball, capped at a maximum (TBD in playtest — likely 200–300 pixels for max power).
- **FR-014**: Live readouts display "Distance: [Npx]" and "Power: [N]" while the reticle is active.
- **FR-015**: A second click fires the shot with the current vector.
- **FR-016**: Right-click or Escape while aiming cancels the shot and deactivates the reticle.
- **FR-017**: A shot is not counted until it fires.

**Physics**

- **FR-020**: Ball behaviour is simulated by Matter.js integrated with Phaser 3.
- **FR-021**: Friction on astroturf produces a natural deceleration curve (approx. ~1.5 seconds of roll from moderate shot).
- **FR-022**: Wall collisions produce elastic bounces with an angle-of-reflection error under 3° and velocity retention between 75–90%.
- **FR-023**: Slopes influence ball velocity in both directions (accelerate downslope, decelerate upslope) using real gravity vectors.
- **FR-024**: Water collision stops the ball, plays splash SFX, penalises +1 stroke, and respawns at the last valid tee position.
- **FR-025**: Sand collision multiplies friction by ~4×, stopping the ball within ~1 second with no penalty stroke.
- **FR-026**: Moving obstacles (windmill blades, sliding gates, pendulums, ferry) collide correctly with the ball while in motion.

**Scoring & Medals**

- **FR-030**: Each hole displays its par value.
- **FR-031**: Each hole has a running shot counter that increments on each fired shot.
- **FR-032**: When the ball enters the cup, the hole ends and a result banner shows: hole number, stroke count, medal tier, "Next Hole" / "Replay" / "Return to Clubhouse" buttons.
- **FR-033**: Medal tiers: **Bronze** = par, **Silver** = par−1 (birdie), **Gold** = par−2 or better (eagle+). No medal for bogey (par+1) or worse.
- **FR-034**: Best score per hole is stored in localStorage under a key like `divot.bestScore.<holeId>`.
- **FR-035**: Best medal per hole is stored in localStorage under a key like `divot.medal.<holeId>`. Higher-tier medals overwrite lower.
- **FR-036**: If a player rehits a hole and scores lower (better), their stored best score and medal update.
- **FR-037**: If a player rehits a hole and scores higher (worse), their stored best is unchanged.

**Unlock**

- **FR-040**: The Back Six unlock is triggered when medals of any tier exist for all 9 Front Nine hole IDs.
- **FR-041**: The unlocked state is stored in localStorage under `divot.backSixUnlocked`.
- **FR-042**: Unlock is one-way — once unlocked, it stays unlocked even if a medal is somehow removed.

**Sound**

- **FR-050**: Sounds implemented: `putt.tock`, `roll.turf.loop`, `splash.water`, `cup.rattle`, `medal.jingle`, `bird.ambient.loop`, `music.ambient.loop`.
- **FR-051**: A mute toggle in the top-right corner (persisted in localStorage) silences all audio.
- **FR-052**: Ambient bird loop only plays on outdoor holes (all 15 currently; may vary later).
- **FR-053**: Music ambient bed plays throughout the game at low volume, fading during shot-taking.

**Persistence**

- **FR-060**: All player progress (medals, best scores, unlock, mute preference) is stored in localStorage using the `divot.*` key prefix.
- **FR-061**: Clearing browser data resets the game to fresh state.
- **FR-062**: No accounts, no cloud sync, no server.

### Key Entities *(include if feature involves data)*

- **Player Save**: `{ medals: {holeId: 'bronze'|'silver'|'gold'}, bestScores: {holeId: strokeCount}, backSixUnlocked: boolean, mutedAudio: boolean }`. Stored in localStorage as JSON under `divot.save`.
- **Hole**: Static config `{ id, name, par, geometry, obstacles, hazards, tee, cup, difficulty }`. Loaded from a hole registry — one config per hole.
- **Shot**: Runtime `{ direction: Vector, power: number, timestamp }`. Not persisted.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new player can complete the Driving Range tutorial (understand aim + take 3 shots) within **90 seconds** of first load.
- **SC-002**: A new player can complete Hole 1 (Straight & True) within **3 minutes** of first entering it.
- **SC-003**: A skilled player can complete all 9 Front Nine holes with at least Bronze on every hole in under **30 minutes**.
- **SC-004**: Physics feel: on flat astroturf, a shot at 50% power rolls between 15m and 25m in the game world (tunable but bounded).
- **SC-005**: **Zero known ball-tunneling bugs** at MVP ship (ball must never pass through a wall).
- **SC-006**: **60 FPS** target on a 2020-era MacBook Air, all 17 rooms.
- **SC-007**: All 15 hole configs are complete and playable in grey-box before any art pass begins on Hole 1.
- **SC-008**: Full sound package works on Chrome, Safari, and Firefox latest.
- **SC-009**: Persistence: player progress survives a browser reload and an OS restart.
- **SC-010**: Back Six unlock is testable by injecting the save state — no forced playthrough required for dev.

## Out of Scope (v1.0)

- Multiplayer (any form — hot-seat, LAN, online)
- Character customisation (ball skins, putter skins)
- Course editor / user-generated content
- Achievements beyond the medal system
- Leaderboards, high-score sharing, social features
- Any hole designs beyond the 15 specified
- Mobile-specific controls (touch is acceptable if it works, but not optimised)
- Difficulty modes (easy/hard/pro)
- Cinematic camera modes (fixed top-down only)
- Any non-photo-drone-realism art style

## Open Questions / Deferred

- **Trajectory preview during aim**: dotted line showing predicted path? Deferred to first playtest.
- **Shot cancellation grace period**: how long after Click 1 should aim persist if the player wanders off? Deferred.
- **Camera behaviour on large holes**: fixed frame per hole, or pan/scroll for larger holes like the Championship? Deferred.
- **Sound sourcing**: royalty-free clips or self-recorded? Deferred to implementation.
- **Music track count**: single loop or per-hole variants? Deferred.
- **Unlock threshold**: "medal on all 9" is default. Alternate: "6 medals of any tier" (lower bar). Deferred.
- **Best-score tie-breaking**: if you tie a Silver score, does the medal restrike? Deferred.
- **Wood butt-joint detail rendering**: art-pass concern, deferred to visual polish phase.
