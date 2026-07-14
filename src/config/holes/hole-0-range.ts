import type { HoleConfig } from '@/contracts/HoleConfig';

/**
 * Hole 0 · The Driving Range — practice-only, no cup.
 * A long open corridor with distance markers on the ground.
 */
export const HOLE_0_RANGE: HoleConfig = {
  id: 0,
  name: 'Driving Range',
  par: 0, // n/a
  difficulty: 1,
  worldSize: { w: 1200, h: 720 },
  tee: { x: 140, y: 380 },
  cup: { x: -1, y: -1, radius: 0 }, // no cup on the range
  walls: [
    { x: 60 - 16, y: 200 - 16, w: 1080 + 32, h: 16 }, // top
    { x: 60 - 16, y: 560, w: 1080 + 32, h: 16 }, // bottom
    { x: 60 - 16, y: 200, w: 16, h: 360 }, // left
    { x: 1140, y: 200, w: 16, h: 360 }, // right
  ],
  obstacles: [],
  hazards: { water: [], sand: [] },
  slopes: [],
  outdoor: true,
  flavour: 'Warm up. Infinite balls. Learn the feel.',
};
