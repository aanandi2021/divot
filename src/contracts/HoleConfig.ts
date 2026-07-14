/**
 * HoleConfig — schema every hole exports. Frozen per plan.md Phase 1.
 * Every hole (0 through 15) exports one HoleConfig.
 */
import type { Vector } from '@/types/Vector';

export interface RectSpec {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WallSpec extends RectSpec {
  angle?: number;
  /**
   * Visual style. 'boundary' = wooden plank border (default).
   * 'block' = interior obstacle rendered as concrete/stone that reads
   * as *out-of-bounds terrain* instead of a giant wooden pillar.
   */
  kind?: 'boundary' | 'block';
}

export interface SlopeSpec extends RectSpec {
  gravity: Vector;
}

export type ObstacleSpec =
  | { kind: 'windmill'; x: number; y: number; radius: number; bladeLength: number; rpm: number }
  | { kind: 'bumper'; x: number; y: number; radius: number }
  | { kind: 'sliding-gate'; x: number; y: number; w: number; h: number; range: number; period: number }
  | { kind: 'pendulum'; pivot: Vector; length: number; barLength: number; barWidth: number; period: number }
  | { kind: 'ferry'; from: Vector; to: Vector; w: number; h: number; period: number }
  | { kind: 'tunnel'; entry: Vector; exit: Vector; radius: number }
  | { kind: 'loop'; center: Vector; radius: number; entryAngle: number };

export interface HoleConfig {
  id: number;
  name: string;
  par: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  worldSize: { w: number; h: number };
  tee: Vector;
  cup: { x: number; y: number; radius?: number };
  walls: WallSpec[];
  obstacles: ObstacleSpec[];
  hazards: {
    water: RectSpec[];
    sand: RectSpec[];
  };
  slopes: SlopeSpec[];
  camera?: { x: number; y: number; zoom: number };
  outdoor: boolean;
  flavour?: string;
}
