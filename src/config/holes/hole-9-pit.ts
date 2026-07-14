import type { HoleConfig } from '@/contracts/HoleConfig';

/**
 * Hole 9 · The Pit — par 3, difficulty ⭑⭑⭑.
 *
 * INTENT: Tee in the TOP corridor, cup in the BOTTOM corridor. A divider
 * wall between them forces you to either:
 *  - Take the PIT (tunnel) mid-fairway for a fast direct drop, OR
 *  - Go the LONG way around the end of the divider wall and back.
 * A sand trap on the long-way route punishes the safe path.
 *
 * Front Nine finale — completing this unlocks the Back Six.
 */
export const HOLE_9: HoleConfig = {
  id: 9,
  name: 'The Pit',
  par: 3,
  difficulty: 3,
  worldSize: { w: 1200, h: 720 },
  tee: { x: 180, y: 220 },
  cup: { x: 1000, y: 500, radius: 12 },
  walls: [
    { x: 84, y: 84, w: 1032, h: 16 },
    { x: 84, y: 620, w: 1032, h: 16 },
    { x: 84, y: 100, w: 16, h: 520 },
    { x: 1100, y: 100, w: 16, h: 520 },
    // Long divider wall — only leaves an opening on the far right for the
    // long-way route, forcing either "go the long way" or "take the pit".
    { x: 100, y: 360, w: 850, h: 16 },
  ],
  obstacles: [
    // The Pit: tunnel entrance on the top corridor midway, drops to the
    // bottom corridor NEAR the cup — this is the shortcut.
    {
      kind: 'tunnel',
      entry: { x: 480, y: 220 }, // top corridor, halfway
      exit: { x: 700, y: 500 },   // bottom corridor, near the cup
      radius: 22,
    },
  ],
  hazards: {
    water: [],
    // Sand trap on the "long way" route near the divider's open end
    sand: [{ x: 930, y: 420, w: 130, h: 90 }],
  },
  slopes: [],
  outdoor: true,
  flavour: 'Drop in for the shortcut, or take the long way through sand.',
};
