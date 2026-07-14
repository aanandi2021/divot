# Divot Constitution

> *A photo-real, buildable-in-real-life minigolf game with satisfying physics and a 15-hole tour.*

## Core Principles

### I. Buildable Geometry (NON-NEGOTIABLE)

Every hole must be constructible with real materials — 2×6 lumber walls at right angles, astroturf sheets, water tanks, ramps, and mechanical elements a fabrication shop could actually build. No fantastical or "impossible" geometry. If it can't exist as a real minigolf hole, it doesn't exist in Divot.

Practical rules:
- All walls straight, at right angles (0°, 90°, 180°, 270°) unless representing a real curved feature (loop, corkscrew)
- Wall corners join with visible butt joints (attention to detail matters)
- Every obstacle has a real-world physical analog (windmill, pendulum, sliding gate on a track, boat on a rail, etc.)
- Water hazards are rectangular ponds bordered by wall coping
- Sand traps are rectangular recessed pits

### II. Photo-Drone Realism Aesthetic

The visual language is *"an overhead shot of a real Putt-Putt course, from a drone at 20 feet."* Fine astroturf stipple. Wood-grain planks with plank divisions every ~1m. Realistic pond reflections. Rake marks in sand. Rubber tee mats. Aluminium windmill blades. Dimensional lumber shadows cast onto the fairway. No cartoon shortcuts, no cel-shaded flatness, no pixel art.

### III. Physics You Can Feel

Ball behaviour must be simulated with realistic momentum, friction, and elastic wall bounces. The player should be able to intuit "this shot will roll for 3 seconds and settle at the base of that slope." Hills genuinely matter. Bank shots off walls reward angle-reading. Water and sand punish. This is not arcade physics — it is a physics playground you can master.

**Stack decision:** Phaser 3 as the game framework · Matter.js as the physics engine (Phaser's Matter integration). Justified because arcade physics cannot deliver the slope + momentum + realistic bounce feel we want.

### IV. Ship the Vertical Slice, Then Scale (amended 2026-07-13, amendment 2)

The full experience is **17 rooms**:
- **Clubhouse** (main menu / hub)
- **Hole 0 · The Driving Range** — practice range with infinite balls, distance markers, live power/distance readouts. Available from turn one.
- **Front Nine** (holes 1–9) — the main game, hand-crafted, linear-ish
- **Back Six** (holes 10–15) — unlocked by earning a medal on all 9 Front Nine holes

**Build order: vertical slice first, then scale.**

The MVP is the **Clubhouse + Range + Hole 1**, fully finished end-to-end (grey-box → physics tune → sound → photo-drone art pass → save → deploy). This proves the entire pipeline on one representative hole before we invest in the remaining 14. Once the MVP is deployed and playable, additional holes are added one at a time (grey-box + art + tune) rather than batching all grey-box work first.

**Constitutional intent preserved:**
- Within any single hole, grey-box always comes before art pass.
- No hole ships without playing right in grey-box first.
- The refined art-pass workflow from the MVP hole becomes the template for every subsequent hole.

**Original constraint (superseded):** the pre-amendment version of this principle required *"Grey-box everything first, art-pass second"* across all 15 holes. That approach risks discovering architectural issues only after grey-boxing 15 holes. Vertical-slice de-risking is the safer bet.

### V. Two-Click Aim Feels Physical

The shot mechanic is a two-click cursor-vector system:

1. **Click 1** on the ball activates the club. Cursor becomes a targeting reticle.
2. **Cursor position** shows a live vector arrow *from cursor tip → ball*. The ball will travel in the direction *opposite to the cursor* (i.e., away from where you pulled the club back). The length of the vector = power. Live numeric readout of both distance-from-ball and calculated shot power appears on-screen.
3. **Click 2** fires the shot with that vector.

Trajectory preview during the hover phase is optional (defer to playtest).

### VI. Persist Progress Locally

Player progress (best score per hole, medals earned, Back Six unlock) is saved to `localStorage`. No accounts, no cloud, no server. Progress is per-device and can be cleared by clearing browser data — that's the tradeoff for zero-friction hosting.

### VII. Full Sound, Not "Mute-First"

Divot ships with a full sound package as a first-class concern, not an afterthought: putt "tock", ball rolling on turf, ball splash into water, cup rattle when ball drops in, medal jingle, ambient birdsong per hole, and a gentle piano/synth ambient music bed. A single "mute" toggle is provided; no other audio settings in v1.

### VIII. Sketches Are Encouraged (added 2026-07-13, amendment 1)

Prototypes and sketches that explore game-feel, physics tuning, aim mechanics, or aesthetic direction may use **any** tech stack — including a single HTML file with Phaser loaded from a CDN and vanilla JavaScript. The Constitution's mandated tech stack (Phaser 3 + Matter.js + TypeScript + Vite) applies only to the v1 implementation.

Sketches must:
- Live in a `sketches/` folder at the repo root, outside `src/`
- Be clearly labeled at the top of each file as a sketch (working title, date, purpose)
- Be considered **disposable** — no obligation to maintain, refactor, or test them
- Not block the spec-compliant v1 implementation from moving forward on its own timeline
- Preserve any learnings (physics tuning values, aesthetic decisions, sound choices) by documenting them in the relevant spec artifact, so the v1 implementation benefits

**Purpose:** fast feel-checking. Sketches inform the real build but do not become it.

### IX. Validation Ladder (NON-NEGOTIABLE, added 2026-07-13, amendment 3)

Before committing to any implementation phase estimated at more than **5 hours**, produce a **micro-MVP**: a sketch or scratch scene that validates the single riskiest assumption of that phase in **15–60 minutes** of build time.

If the micro-MVP proves an assumption is wrong, revise the constitution / spec / plan / tasks **before** the large investment.

**The four rungs of the Validation Ladder:**

1. **Sketch** (per Principle VIII) — 30–60 min exploratory. Answers: *what could this be?*
2. **Micro-MVP** (this principle) — 15–60 min targeted. Answers: *does this one mechanic work as I expect?*
3. **MVP** (per Principle IV) — vertical slice, all systems on 1 hole. Answers: *does the whole pipeline hold?*
4. **Scale-out** — replicate the proven pipeline across remaining scope. Answers: *does it hold at scale?*

**Structural rules for micro-MVPs:**
- File: `sketches/µN-<mechanic-name>.html` (using the Greek letter mu for visual distinction from feature sketches)
- Top-of-file comment: what risky assumption is being tested, and the pass/fail criteria
- Catalogued in `tasks.md` as explicit tasks paired with the implementation task they de-risk
- Disposable per Principle VIII

**Insurance math:** a 30-minute micro-MVP that reveals a broken assumption saves 5–20 hours of rework. Every micro-MVP that "passes" is time-neutral (you would have proved the thing during implementation anyway). Every micro-MVP that "fails" is 10–40× ROI.

**Anti-pattern to avoid:** *inertia validation* — assuming a mechanic works because you don't want to interrupt implementation flow to check. The Ladder is meant to interrupt flow at the cheap moments.

## Technology Stack

- **Game framework**: Phaser 3 (latest stable)
- **Physics**: Matter.js (via Phaser Matter integration)
- **Language**: TypeScript (strict mode) — because a game with 17 rooms and physics interactions grows past the point where vanilla JS is safe
- **Build**: Vite (fast dev server, minimal config)
- **Dependencies**: keep tiny. Ideally: Phaser + Matter (bundled with Phaser) + one music library only if needed.
- **Deploy target**: Static build served from any web host. Runs in any modern browser. Playable at `file://` (double-click the HTML) after build.
- **Assets**: SVG for UI + procedural canvas art for hole geometry. Photo textures only if drop-shipped in a later pass.
- **Audio**: WebAudio via Phaser. Royalty-free clips or self-recorded.

## Quality Gates

- Every hole passes **grey-box playtest** (physics feels right, par is achievable, no impossible situations) before art-pass begins.
- Every hole passes **art-pass review** (photo-drone realism style adherence, wood butt-joint detail, no wall-collision-visual mismatches) before hole is marked "done."
- The Driving Range is always the entrypoint for a new player and must always work.
- Every hole is playable with keyboard-nav + mouse and passes basic accessibility (no colour-only cues, high contrast on power/distance readouts).

## Governance

This constitution supersedes hunch, taste, and "let's just try it." Amendments require:
1. Documenting the amendment as a delta below the change log
2. Bumping the version below
3. If a Core Principle changes materially, all in-flight specs must be re-reviewed against the new constitution.

Complexity that violates a Core Principle must be explicitly justified in the spec or plan and approved before implementation.

The Spec Kit slash commands (`/speckit.specify`, `/speckit.plan`, `/speckit.tasks`, `/speckit.implement`) are the workflow. This constitution is what they answer to.

## Change Log

- **2026-07-13** — Initial ratification. Framing pivoted from "cosmic minigolf" to classic minigolf during Q&A. Aesthetic anchored to photo-drone realism. Physics anchored to Matter.js. Course sized to 15 holes + range.
- **2026-07-13 v1.1.0** — Amendment 1: Added Principle VIII (Sketches Are Encouraged).
- **2026-07-13 v1.2.0** — Amendment 2: Principle IV renamed and rewritten as "Ship the Vertical Slice, Then Scale."
- **2026-07-13 v1.3.0** — Amendment 3: Added Principle IX (Validation Ladder). Rationale: Ford flagged that even the MVP-scale investment (~30h) is too large to make without cheaper de-risking steps. Formalising micro-MVPs as a mandatory tier between sketches and MVP. Adds ~2h of upfront work per risky mechanic and prevents ~5–20h of rework each. Insurance math strongly favours this discipline.

---

**Version**: 1.3.0 | **Ratified**: 2026-07-13 | **Last Amended**: 2026-07-13
