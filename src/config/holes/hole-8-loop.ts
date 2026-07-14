import type { HoleConfig } from '@/contracts/HoleConfig';

/**
 * Hole 8 · The Loop-the-Loop — par 2, difficulty ⭑⭑⭑⭑.
 * Signature spectacle hole. Fire the ball into a curved channel that spins
 * it around a 360° loop, exits it toward the cup.
 *
 * The µ4 micro-MVP validated the segmented-ring channel approach with
 * Matter.js — no tunneling at moderate power, ball completes loops.
 */
export const HOLE_8: HoleConfig = {
  id: 8,
  name: 'The Loop-the-Loop',
  par: 2,
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
      kind: 'loop',
      center: { x: 700, y: 360 },
      radius: 130,
      entryAngle: Math.PI, // entry on the left side
    },
  ],
  hazards: { water: [], sand: [] },
  slopes: [],
  outdoor: true,
  flavour: 'Whip. It. Around.',
};
