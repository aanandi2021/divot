import type { HoleConfig } from '@/contracts/HoleConfig';

/**
 * Hole 7 · The Volcano Green — par 3, difficulty ⭑⭑⭑.
 * A ramp-and-hump layout leading to an "island" green surrounded on three
 * sides by water. Power modulation stakes: too soft and you don't clear
 * the water; too hard and you fly off the far edge into water.
 *
 * Implementation: L-shaped water hazard wraps around the green. Interior
 * "hump" wall between the ball and the green forces a bank/curl approach.
 */
export const HOLE_7: HoleConfig = {
  id: 7,
  name: 'The Volcano Green',
  par: 3,
  difficulty: 3,
  worldSize: { w: 1200, h: 720 },
  tee: { x: 180, y: 360 },
  cup: { x: 970, y: 340, radius: 12 },
  walls: [
    { x: 84, y: 84, w: 1032, h: 16 },    // top
    { x: 84, y: 620, w: 1032, h: 16 },   // bottom
    { x: 84, y: 100, w: 16, h: 520 },    // left
    { x: 1100, y: 100, w: 16, h: 520 },  // right
    // "Volcano" hump — a rectangular block dividing the fairway from the green
    { x: 520, y: 260, w: 140, h: 200, kind: 'block' },
  ],
  obstacles: [],
  hazards: {
    // U-shaped water surrounding the green on three sides
    water: [
      { x: 720, y: 100, w: 380, h: 160 },   // top pond
      { x: 720, y: 460, w: 380, h: 160 },   // bottom pond
      { x: 1050, y: 260, w: 50, h: 200 },   // right sliver behind the cup
    ],
    sand: [],
  },
  slopes: [],
  outdoor: true,
  flavour: 'Island green. Pace it or drown it.',
};
