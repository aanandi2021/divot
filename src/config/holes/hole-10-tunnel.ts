import type { HoleConfig } from '@/contracts/HoleConfig';

/**
 * Hole 10 · The Tunnel Fork — par 3, difficulty ⭑⭑⭑.
 * One tunnel entry, exit hidden across the map. Ball emerges at a
 * surprising angle — read the entry, hope for the exit line.
 */
export const HOLE_10: HoleConfig = {
  id: 10,
  name: 'The Tunnel Fork',
  par: 3,
  difficulty: 3,
  worldSize: { w: 1200, h: 720 },
  tee: { x: 180, y: 360 },
  cup: { x: 1000, y: 250, radius: 12 },
  walls: [
    { x: 84, y: 84, w: 1032, h: 16 },
    { x: 84, y: 620, w: 1032, h: 16 },
    { x: 84, y: 100, w: 16, h: 520 },
    { x: 1100, y: 100, w: 16, h: 520 },
    // Divider wall — cup is on the opposite side; must tunnel to reach
    { x: 500, y: 100, w: 16, h: 460 },
  ],
  obstacles: [
    // Tunnel: enter left of divider, exit right side toward the cup
    {
      kind: 'tunnel',
      entry: { x: 380, y: 380 },
      exit: { x: 720, y: 460 }, // unexpected exit location
      radius: 22,
    },
  ],
  hazards: { water: [], sand: [] },
  slopes: [],
  outdoor: true,
  flavour: 'The map bends. Trust the exit.',
};
