import type { HoleConfig } from '@/contracts/HoleConfig';

/**
 * Hole 1 · Straight & True — the onboarding hole (par 2, difficulty ⭑).
 * Rectangular course with a gentle interior wall creating a chicane —
 * enough to introduce bank shots without demanding any obstacle skill.
 */
export const HOLE_1: HoleConfig = {
  id: 1,
  name: 'Straight & True',
  par: 2,
  difficulty: 1,
  worldSize: { w: 1200, h: 720 },
  tee: { x: 180, y: 570 },
  cup: { x: 1010, y: 150, radius: 12 },
  walls: [
    // outer wall thickness
    // top
    { x: 100 - 16, y: 100 - 16, w: 1000 + 32, h: 16 },
    // bottom
    { x: 100 - 16, y: 620, w: 1000 + 32, h: 16 },
    // left
    { x: 100 - 16, y: 100, w: 16, h: 520 },
    // right
    { x: 1100, y: 100, w: 16, h: 520 },
    // interior chicane — mid-height horizontal wall forcing a bank shot
    { x: 100, y: 320, w: 550, h: 16 },
  ],
  obstacles: [],
  hazards: {
    water: [],
    sand: [],
  },
  slopes: [],
  outdoor: true,
  flavour: 'Just point it, and putt it.',
};
