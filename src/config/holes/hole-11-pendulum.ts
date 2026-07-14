import type { HoleConfig } from '@/contracts/HoleConfig';

/**
 * Hole 11 · The Pendulum — par 3, difficulty ⭑⭑⭑⭑.
 * A giant pendulum swings across the fairway. Time the shot under it.
 */
export const HOLE_11: HoleConfig = {
  id: 11,
  name: 'The Pendulum',
  par: 3,
  difficulty: 4,
  worldSize: { w: 1200, h: 720 },
  tee: { x: 180, y: 480 },
  cup: { x: 1000, y: 480, radius: 12 },
  walls: [
    { x: 84, y: 84, w: 1032, h: 16 },
    { x: 84, y: 620, w: 1032, h: 16 },
    { x: 84, y: 100, w: 16, h: 520 },
    { x: 1100, y: 100, w: 16, h: 520 },
  ],
  obstacles: [
    {
      kind: 'pendulum',
      pivot: { x: 600, y: 140 },
      length: 320,
      barLength: 260,
      barWidth: 16,
      period: 3.2,
    },
  ],
  hazards: { water: [], sand: [] },
  slopes: [],
  outdoor: true,
  flavour: 'Read the rhythm. Fire on the pass.',
};
