import type { HoleConfig } from '@/contracts/HoleConfig';

/**
 * Hole 13 · The Corkscrew — par 3, difficulty ⭑⭑⭑⭑.
 * Second spectacle hole. Fire into a large loop channel — the "corkscrew"
 * spins the ball around before releasing toward the cup. Uses the same
 * LoopRamp mechanic as Hole 8 but larger and with a different exit angle.
 */
export const HOLE_13: HoleConfig = {
  id: 13,
  name: 'The Corkscrew',
  par: 3,
  difficulty: 4,
  worldSize: { w: 1200, h: 720 },
  tee: { x: 180, y: 500 },
  cup: { x: 1020, y: 200, radius: 12 },
  walls: [
    { x: 84, y: 84, w: 1032, h: 16 },
    { x: 84, y: 620, w: 1032, h: 16 },
    { x: 84, y: 100, w: 16, h: 520 },
    { x: 1100, y: 100, w: 16, h: 520 },
  ],
  obstacles: [
    {
      kind: 'loop',
      center: { x: 620, y: 360 },
      radius: 170,
      entryAngle: Math.PI * 0.75, // entry from lower-left
    },
  ],
  hazards: { water: [], sand: [] },
  slopes: [],
  outdoor: true,
  flavour: 'One long spin, one shot at glory.',
};
