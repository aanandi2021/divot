import type { HoleConfig } from '@/contracts/HoleConfig';

/**
 * Hole 2 · The Dogleg — par 3, difficulty ⭑⭑.
 * An L-shaped corridor forces a bank shot off the interior corner OR
 * a two-shot route around the obstacle. Introduces angle-reading.
 *
 * Geometry:
 * - Outer rectangle 100..1100 × 100..620 (16px wall thickness)
 * - Interior corner block filling upper-left, creating the L
 * - Tee bottom-left, cup upper-right
 */
export const HOLE_2: HoleConfig = {
  id: 2,
  name: 'The Dogleg',
  par: 3,
  difficulty: 2,
  worldSize: { w: 1200, h: 720 },
  tee: { x: 180, y: 555 },
  cup: { x: 1000, y: 200, radius: 12 },
  walls: [
    // Outer walls (16px thick)
    { x: 84, y: 84, w: 1032, h: 16 },        // top
    { x: 84, y: 620, w: 1032, h: 16 },       // bottom
    { x: 84, y: 100, w: 16, h: 520 },        // left
    { x: 1100, y: 100, w: 16, h: 520 },      // right
    // Interior block — the corner that creates the dogleg.
    // Rendered as out-of-bounds concrete so the playable area reads as an L-shape.
    { x: 100, y: 100, w: 660, h: 320, kind: 'block' },
  ],
  obstacles: [],
  hazards: { water: [], sand: [] },
  slopes: [],
  outdoor: true,
  flavour: 'Round the corner. A clean bank is a birdie shot.',
};
