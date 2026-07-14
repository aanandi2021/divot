import type { Vector } from '@/types/Vector';

export function distance(a: Vector, b: Vector): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
export function magnitude(v: Vector): number {
  return Math.hypot(v.x, v.y);
}
export function normalize(v: Vector): Vector {
  const m = magnitude(v);
  return m === 0 ? { x: 0, y: 0 } : { x: v.x / m, y: v.y / m };
}
export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
export function subtract(a: Vector, b: Vector): Vector {
  return { x: a.x - b.x, y: a.y - b.y };
}
export function scale(v: Vector, s: number): Vector {
  return { x: v.x * s, y: v.y * s };
}
export function angleOf(v: Vector): number {
  return Math.atan2(v.y, v.x);
}
