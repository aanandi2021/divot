import type { HoleConfig } from '@/contracts/HoleConfig';

/**
 * Hole 6 · The Sliding Gate — par 3, difficulty ⭑⭑⭑.
 * A vertical gate slides back and forth across a chokepoint. Ball must be
 * timed through the gap. Faster oscillation would raise difficulty; this
 * one uses a 3.5s cycle so it's readable but demanding.
 */
export const HOLE_6: HoleConfig = {
  id: 6,
  name: 'The Sliding Gate',
  par: 3,
  difficulty: 3,
  worldSize: { w: 1200, h: 720 },
  tee: { x: 180, y: 360 },
  cup: { x: 1000, y: 360, radius: 12 },
  walls: [
    { x: 84, y: 164, w: 1032, h: 16 },
    { x: 84, y: 540, w: 1032, h: 16 },
    { x: 84, y: 180, w: 16, h: 360 },
    { x: 1100, y: 180, w: 16, h: 360 },
    // Two fixed walls flanking the gate — create the chokepoint
    { x: 592, y: 180, w: 16, h: 100 }, // upper fixed post
    { x: 592, y: 440, w: 16, h: 100 }, // lower fixed post
  ],
  obstacles: [
    {
      kind: 'sliding-gate',
      x: 588,     // gate top-left
      y: 300,     // gate top-left
      w: 24,      // gate width
      h: 120,     // gate height
      range: 40,  // slides ±20 (from center)
      period: 3.5,
    },
  ],
  hazards: { water: [], sand: [] },
  slopes: [],
  outdoor: true,
  flavour: 'Watch the rhythm. Fire on the beat.',
};
