import type { HoleConfig } from '@/contracts/HoleConfig';

/**
 * Hole 14 · The Ferry — par 3, difficulty ⭑⭑⭑⭑.
 *
 * INTENT: A full-height river cuts the course in two. The ONLY way across
 * is riding the ferry. Time it to be at the near shore, launch onto it,
 * ride across, disembark. Overshooting or mistiming = splash.
 */
export const HOLE_14: HoleConfig = {
  id: 14,
  name: 'The Ferry',
  par: 3,
  difficulty: 4,
  worldSize: { w: 1200, h: 720 },
  tee: { x: 180, y: 360 },
  cup: { x: 1020, y: 360, radius: 12 },
  walls: [
    { x: 84, y: 84, w: 1032, h: 16 },
    { x: 84, y: 620, w: 1032, h: 16 },
    { x: 84, y: 100, w: 16, h: 520 },
    { x: 1100, y: 100, w: 16, h: 520 },
  ],
  obstacles: [
    {
      kind: 'ferry',
      from: { x: 460, y: 360 },
      to: { x: 780, y: 360 },
      w: 90,
      h: 90,
      period: 5,
    },
  ],
  hazards: {
    // Water fills the middle third of the course FULL HEIGHT — no way around
    water: [
      { x: 400, y: 100, w: 440, h: 520 },
    ],
    sand: [],
  },
  slopes: [],
  outdoor: true,
  flavour: 'All aboard. Fire onto the deck; ride across.',
};
