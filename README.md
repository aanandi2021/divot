# Divot

> *A photo-real, buildable-in-real-life minigolf game with satisfying physics and a 15-hole tour.*

Classic top-down minigolf. Photo-drone-realism aesthetic — like an overhead shot of a real Putt-Putt from 20 feet up. Realistic Matter.js physics — hills, momentum, elastic bounces. Two-click cursor-vector aim: click the ball, mouse position shows a vector, second click fires.

**17 rooms:** Clubhouse hub · Driving Range (Hole 0) · Front Nine (Holes 1–9) · Back Six (Holes 10–15, unlocked by earning a medal on all 9 Front Nine).

## Status

Spec-driven design phase using [GitHub Spec Kit](https://github.com/github/spec-kit). Ready for `/speckit.implement`.

- ✅ Constitution v1.3.0 · [.specify/memory/constitution.md](.specify/memory/constitution.md)
- ✅ Spec (60 requirements, 5 user stories) · [specs/001-divot-mvp/spec.md](specs/001-divot-mvp/spec.md)
- ✅ Plan (MVP-first vertical slice) · [specs/001-divot-mvp/plan.md](specs/001-divot-mvp/plan.md)
- ✅ Tasks (102 total, 4 micro-MVP gates) · [specs/001-divot-mvp/tasks.md](specs/001-divot-mvp/tasks.md)
- ⏳ Implementation — not started

## Play the sketch

The Constitution-VIII sketch (single-file HTML, disposable prototype) proves out physics, aim mechanic, and save/load:

```
open sketches/hole-1-first-playable.html
```

Click Range or Hole 1 · Straight & True. On the hole: click the ball → move cursor away → click again to fire.

## Aesthetic mockups

Four styles compared during design:

```
open sketches/aesthetic-comparison-topdown.html   ← the winner: Photo-Drone Realism (panel 2)
open sketches/aesthetic-comparison-minigolf.html  ← earlier iteration
open sketches/aesthetic-comparison.html           ← earliest (celestial, rejected)
```

## Design principles

Divot's constitution formalises three unusual disciplines for spec-driven game development:

1. **VIII · Sketches Are Encouraged** — disposable prototypes are a first-class artifact
2. **IX · Validation Ladder** — 15–60 min micro-MVPs gate any implementation phase >5h
3. **IV · Ship the Vertical Slice, Then Scale** — MVP is 1 hole fully finished, not 15 grey-boxed

## Stack (v1)

- **Framework:** Phaser 3
- **Physics:** Matter.js (via Phaser Matter integration)
- **Language:** TypeScript (strict)
- **Build:** Vite
- **Deploy:** static, runs at `file://` after build
- **Persistence:** localStorage
- **Audio:** WebAudio via Phaser (7 clips)

## Repo layout

```
divot/
├── .specify/         # Spec Kit workflow files
│   ├── memory/       # Constitution
│   └── templates/    # Command templates
├── .github/prompts/  # Spec Kit slash-command prompts
├── specs/            # Feature specs
│   └── 001-divot-mvp/
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md
├── sketches/         # Constitution VIII — disposable prototypes
│   ├── hole-1-first-playable.html
│   ├── aesthetic-comparison-*.html
│   └── µ*-*.html     # Constitution IX — micro-MVP validations
└── (implementation not yet started — Phaser+Vite project bootstrapped from T001)
```

## Credits

Vibe, direction, and every design decision: Ford Nandi (aanandi2021).
Spec-driven collaboration: Copilot CLI (Claude Opus 4.7).
