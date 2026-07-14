import type { HoleConfig } from '@/contracts/HoleConfig';

/**
 * Hole 3 · The Windmill — par 3, difficulty ⭑⭑.
 * Rectangular corridor with a spinning windmill mid-fairway. Timing gate.
 * Two-blade gap oriented vertical at start; ball must slip past between rotations.
 *
 * The µ2 micro-MVP proved Matter.js handles rotating compound bodies without
 * tunneling at reasonable RPMs and shot powers. RPM tuned to 15 (a fair
 * timing challenge — about 4 seconds per full rotation).
 */
export const HOLE_3: HoleConfig = {
  id: 3,
  name: 'The Windmill',
  par: 3,
  difficulty: 2,
  worldSize: { w: 1200, h: 720 },
  tee: { x: 180, y: 360 },
  cup: { x: 1000, y: 360, radius: 12 },
  walls: [
    // Outer walls
    { x: 84, y: 164, w: 1032, h: 16 },     // top
    { x: 84, y: 540, w: 1032, h: 16 },     // bottom
    { x: 84, y: 180, w: 16, h: 360 },      // left
    { x: 1100, y: 180, w: 16, h: 360 },    // right
  ],
  obstacles: [
    {
      kind: 'windmill',
      x: 600,
      y: 360,
      radius: 32,
      bladeLength: 130,
      rpm: 15,
    },
  ],
  hazards: { water: [], sand: [] },
  slopes: [],
  outdoor: true,
  flavour: 'Wait for the gap. Then commit.',
};
