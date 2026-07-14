import type { HoleConfig } from '@/contracts/HoleConfig';

/**
 * Hole 12 · The Ridgeline — par 3, difficulty ⭑⭑⭑⭑.
 *
 * INTENT: A narrow strip of grass runs down the middle of the course.
 * Water on both sides. Ball must stay on the ridge — any wobble drops
 * it into water for a +1 stroke and respawn at tee. Nerves-of-steel
 * putting; slopes on the ridge edges push a wobbling ball INTO the water.
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
    // Water on both sides of the narrow central ridge
    water: [
      { x: 300, y: 130, w: 700, h: 180 }, // top pond
      { x: 300, y: 410, w: 700, h: 180 }, // bottom pond
    ],
    sand: [],
  },
  slopes: [
    // Narrow slope zones just OUTSIDE the ridge that push a straying ball
    // AWAY from the ridge and INTO the water. This is the "punishing" slope.
    { x: 260, y: 310, w: 780, h: 20, gravity: { x: 0, y: -0.001 } }, // upper edge → pushes up into top pond
    { x: 260, y: 390, w: 780, h: 20, gravity: { x: 0, y: 0.001 } },  // lower edge → pushes down into bottom pond
  ],
  outdoor: true,
  flavour: 'The ridge is 50 pixels wide. Do not wobble.',
};
