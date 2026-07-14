import type { HoleConfig } from '@/contracts/HoleConfig';

/**
 * Hole 12 · The Ridgeline — par 3, difficulty ⭑⭑⭑⭑.
 * A narrow raised ridge between two slope zones that push the ball off
 * either side into the rough. Nerves-of-steel putting.
 */
export const HOLE_12: HoleConfig = {
  id: 12,
  name: 'The Ridgeline',
  par: 3,
  difficulty: 4,
  worldSize: { w: 1200, h: 720 },
  tee: { x: 180, y: 360 },
  cup: { x: 1000, y: 360, radius: 12 },
  walls: [
    { x: 84, y: 84, w: 1032, h: 16 },
    { x: 84, y: 620, w: 1032, h: 16 },
    { x: 84, y: 100, w: 16, h: 520 },
    { x: 1100, y: 100, w: 16, h: 520 },
  ],
  obstacles: [],
  hazards: {
    water: [
      // Water on both sides of the ridge — punishes wobble
      { x: 300, y: 130, w: 700, h: 180 },   // top pond
      { x: 300, y: 410, w: 700, h: 180 },   // bottom pond
    ],
    sand: [],
  },
  slopes: [
    // Upper slope pushes ball DOWN toward the ridge (toward center)
    { x: 260, y: 130, w: 780, h: 180, gravity: { x: 0, y: 0.0008 } },
    // Lower slope pushes ball UP toward the ridge (toward center)
    { x: 260, y: 410, w: 780, h: 180, gravity: { x: 0, y: -0.0008 } },
  ],
  outdoor: true,
  flavour: 'Walk the ridge. Do not wobble.',
};
