import type { HoleConfig } from '@/contracts/HoleConfig';

/**
 * Hole 13 · The Corkscrew — par 3, difficulty ⭑⭑⭑⭑.
 *
 * INTENT: Same forced-loop pattern as Hole 8, but bigger loop, diagonal
 * entry/exit, and the corridors are angled so the ball enters from the
 * lower-left and exits toward the upper-right.
 */
export const HOLE_13: HoleConfig = {
  id: 13,
  name: 'The Corkscrew',
  par: 3,
  difficulty: 4,
  worldSize: { w: 1200, h: 720 },
  tee: { x: 180, y: 550 },
  cup: { x: 1020, y: 180, radius: 12 },
  walls: [
    { x: 84, y: 84, w: 1032, h: 16 },
    { x: 84, y: 620, w: 1032, h: 16 },
    { x: 84, y: 100, w: 16, h: 520 },
    { x: 1100, y: 100, w: 16, h: 520 },
    // Lower-right block seals off any path below the loop
    { x: 620, y: 490, w: 480, h: 130, kind: 'block' },
    // Upper-left block seals off any path above the loop
    { x: 100, y: 100, w: 480, h: 130, kind: 'block' },
  ],
  obstacles: [
    // Big loop taking up most of the corridor. Entry SW (5π/4), exit NE (π/4).
    {
      kind: 'loop',
      center: { x: 600, y: 360 },
      radius: 150,
      entryAngle: Math.PI * 1.25, // southwest
      exitAngle: Math.PI * 0.25,  // northeast
    },
  ],
  hazards: { water: [], sand: [] },
  slopes: [],
  outdoor: true,
  flavour: 'One long spin, exit the far side.',
};
