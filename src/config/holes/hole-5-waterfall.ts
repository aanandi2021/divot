import type { HoleConfig } from '@/contracts/HoleConfig';

/**
 * Hole 5 · The Waterfall — par 3, difficulty ⭑⭑⭑.
 * Upper tee → sloped descent (rightward gravity) → lower green next to water.
 * Power modulation matters — too much and the ball rolls off the green into
 * the water hazard (+1 stroke, respawn at tee).
 *
 * The µ3 micro-MVP validated slope physics with directional gravity via
 * Matter's beforeUpdate. Gravity strength 0.0006 chosen for a natural roll
 * (about 1.5s to traverse the slope from rest).
 */
export const HOLE_5: HoleConfig = {
  id: 5,
  name: 'The Waterfall',
  par: 3,
  difficulty: 3,
  worldSize: { w: 1200, h: 720 },
  tee: { x: 180, y: 260 },
  cup: { x: 1000, y: 460, radius: 12 },
  walls: [
    { x: 84, y: 84, w: 1032, h: 16 },       // top
    { x: 84, y: 620, w: 1032, h: 16 },      // bottom
    { x: 84, y: 100, w: 16, h: 520 },       // left
    { x: 1100, y: 100, w: 16, h: 520 },     // right
    // Divide upper corridor from lower green with a partial wall so the
    // ball must exit the upper corridor and drop down the slope
    { x: 100, y: 340, w: 550, h: 16 },
  ],
  obstacles: [],
  hazards: {
    water: [
      // Rectangular pond adjacent to the cup — a bad shot rolls right off the green
      { x: 780, y: 540, w: 260, h: 70 },
    ],
    sand: [],
  },
  slopes: [
    // Slope zone in the middle-right: pushes the ball rightward + downward
    { x: 450, y: 200, w: 500, h: 200, gravity: { x: 0.00035, y: 0.0004 } },
  ],
  outdoor: true,
  flavour: 'Read the slope. Ease off the throttle before the green.',
};
