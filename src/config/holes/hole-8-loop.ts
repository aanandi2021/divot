import type { HoleConfig } from '@/contracts/HoleConfig';

/**
 * Hole 8 · The Loop-the-Loop — par 3, difficulty ⭑⭑⭑⭑.
 * Signature spectacle #1. Tee corridor → forced loop entry → exit to cup.
 *
 * INTENT: The player MUST send the ball through the loop. Divider walls
 * seal off any path around the loop. Loop has entry gap on the west (PI)
 * and exit gap on the east (0), so ball enters left, spins 360°, exits
 * right toward the cup.
 */
export const HOLE_8: HoleConfig = {
  id: 8,
  name: 'The Loop-the-Loop',
  par: 3,
  difficulty: 4,
  worldSize: { w: 1200, h: 720 },
  tee: { x: 180, y: 360 },
  cup: { x: 1020, y: 360, radius: 12 },
  walls: [
    // Outer perimeter
    { x: 84, y: 84, w: 1032, h: 16 },
    { x: 84, y: 620, w: 1032, h: 16 },
    { x: 84, y: 100, w: 16, h: 520 },
    { x: 1100, y: 100, w: 16, h: 520 },
    // Upper divider — seals off the top route around the loop
    { x: 100, y: 224, w: 1000, h: 16 },
    // Lower divider — seals off the bottom route around the loop
    { x: 100, y: 480, w: 1000, h: 16 },
  ],
  obstacles: [
    // Loop centered on the corridor. Entry LEFT (PI), exit RIGHT (0).
    {
      kind: 'loop',
      center: { x: 600, y: 360 },
      radius: 118, // fits in the corridor (240 tall / 2)
      entryAngle: Math.PI, // west
      exitAngle: 0,        // east
    },
  ],
  hazards: { water: [], sand: [] },
  slopes: [],
  outdoor: true,
  flavour: 'Only one way through. Whip. It. Around.',
};
