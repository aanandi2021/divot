import type { HoleConfig } from '@/contracts/HoleConfig';

/**
 * Hole 4 · The Bumper Alley — par 3, difficulty ⭑⭑.
 * A short fairway lined with pinball-style bumpers. Chain reactions,
 * but readable — the ball loses just enough momentum per hit that
 * bumpers act as guardrails, not chaos generators.
 */
export const HOLE_4: HoleConfig = {
  id: 4,
  name: 'The Bumper Alley',
  par: 3,
  difficulty: 2,
  worldSize: { w: 1200, h: 720 },
  tee: { x: 180, y: 360 },
  cup: { x: 1000, y: 360, radius: 12 },
  walls: [
    { x: 84, y: 164, w: 1032, h: 16 },
    { x: 84, y: 540, w: 1032, h: 16 },
    { x: 84, y: 180, w: 16, h: 360 },
    { x: 1100, y: 180, w: 16, h: 360 },
  ],
  obstacles: [
    // Diamond pattern of bumpers narrowing toward the cup — forces the
    // ball to bounce between them at least once
    { kind: 'bumper', x: 400, y: 280, radius: 26 },
    { kind: 'bumper', x: 400, y: 440, radius: 26 },
    { kind: 'bumper', x: 600, y: 220, radius: 24 },
    { kind: 'bumper', x: 600, y: 500, radius: 24 },
    { kind: 'bumper', x: 600, y: 360, radius: 22 },
    { kind: 'bumper', x: 800, y: 300, radius: 20 },
    { kind: 'bumper', x: 800, y: 420, radius: 20 },
  ],
  hazards: { water: [], sand: [] },
  slopes: [],
  outdoor: true,
  flavour: 'Pinball. Aim at gaps, thread them, embrace the chaos.',
};
