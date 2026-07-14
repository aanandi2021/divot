import type { HoleConfig } from '@/contracts/HoleConfig';

/**
 * Hole 9 · The Pit — par 3, difficulty ⭑⭑⭑.
 * A drop-hole mid-fairway with two possible exit tunnels leading to
 * different lower positions. Risk-reward routing:
 *  - Pit (center) → drops ball near the cup for a shortcut
 *  - Long way (over the top): safer but takes an extra shot
 *
 * Front Nine finale — completing this unlocks the Back Six.
 */
export const HOLE_9: HoleConfig = {
  id: 9,
  name: 'The Pit',
  par: 3,
  difficulty: 3,
  worldSize: { w: 1200, h: 720 },
  tee: { x: 180, y: 250 },
  cup: { x: 1000, y: 250, radius: 12 },
  walls: [
    { x: 84, y: 84, w: 1032, h: 16 },
    { x: 84, y: 620, w: 1032, h: 16 },
    { x: 84, y: 100, w: 16, h: 520 },
    { x: 1100, y: 100, w: 16, h: 520 },
    // Long horizontal wall splitting the field — the "top" corridor is
    // above, the "bottom" corridor is below. Pit is the shortcut through.
    { x: 100, y: 330, w: 700, h: 16 },
    { x: 900, y: 330, w: 200, h: 16 },
  ],
  obstacles: [
    // The Pit: shortcut portal from top corridor down to bottom corridor
    // right before the cup
    {
      kind: 'tunnel',
      entry: { x: 550, y: 250 }, // upper — near the mid-length
      exit: { x: 850, y: 450 },  // lower — near the cup
      radius: 20,
    },
  ],
  hazards: {
    water: [],
    // Sand trap on the "long way" route to punish bad power control
    sand: [{ x: 850, y: 200, w: 130, h: 80 }],
  },
  slopes: [],
  outdoor: true,
  flavour: 'Take the pit and pray, or go the long way and pay.',
};
