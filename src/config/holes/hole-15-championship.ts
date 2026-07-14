import type { HoleConfig } from '@/contracts/HoleConfig';

/**
 * Hole 15 · The Championship — par 4, difficulty ⭑⭑⭑⭑⭑.
 * Composite finale reusing every mechanic: dogleg block + windmill +
 * slope + water + sand + bumpers. Uses everything you've learned.
 */
export const HOLE_15: HoleConfig = {
  id: 15,
  name: 'The Championship',
  par: 4,
  difficulty: 5,
  worldSize: { w: 1200, h: 720 },
  tee: { x: 180, y: 550 },
  cup: { x: 1020, y: 180, radius: 12 },
  walls: [
    { x: 84, y: 84, w: 1032, h: 16 },
    { x: 84, y: 620, w: 1032, h: 16 },
    { x: 84, y: 100, w: 16, h: 520 },
    { x: 1100, y: 100, w: 16, h: 520 },
    // Interior dogleg block — upper-left obstacle
    { x: 100, y: 100, w: 380, h: 200, kind: 'block' },
    // Second interior wall creating a chokepoint before the green
    { x: 780, y: 380, w: 320, h: 16 },
  ],
  obstacles: [
    // Windmill guarding the mid-fairway
    { kind: 'windmill', x: 700, y: 500, radius: 30, bladeLength: 110, rpm: 12 },
    // A bumper deflector to keep things lively
    { kind: 'bumper', x: 550, y: 230, radius: 22 },
  ],
  hazards: {
    water: [
      // Water pond guarding the green from the right
      { x: 820, y: 200, w: 160, h: 160 },
    ],
    sand: [
      // Sand trap near the tee — punishes over-eager first shots
      { x: 380, y: 500, w: 120, h: 70 },
    ],
  },
  slopes: [
    // Slope in front of the green pushes ball toward the cup — small helper
    { x: 640, y: 100, w: 260, h: 270, gravity: { x: 0.00025, y: -0.0002 } },
  ],
  outdoor: true,
  flavour: 'Everything you learned. Play the round of your life.',
};
