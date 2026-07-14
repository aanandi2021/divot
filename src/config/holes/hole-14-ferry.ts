import type { HoleConfig } from '@/contracts/HoleConfig';

/**
 * Hole 14 · The Ferry — par 3, difficulty ⭑⭑⭑⭑.
 * Water gap across the middle of the fairway. A wooden ferry platform
 * shuttles from left bank to right bank. Land on it, ride across,
 * disembark on the far shore. Cinematic.
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
      w: 80,
      h: 60,
      period: 5,
    },
  ],
  hazards: {
    water: [
      // Big water gap in the middle — cross via ferry
      { x: 400, y: 240, w: 440, h: 240 },
    ],
    sand: [],
  },
  slopes: [],
  outdoor: true,
  flavour: 'All aboard. Time it right.',
};
