/**
 * ScoreSystem — pure functions for medal computation.
 * See spec.md FR-030/031/032/033.
 */
import type { MedalTier } from '@/contracts/SaveState';

export function computeMedal(strokes: number, par: number): MedalTier | null {
  const diff = strokes - par;
  if (diff <= -2) return 'gold'; // eagle or better
  if (diff === -1) return 'silver'; // birdie
  if (diff === 0) return 'bronze'; // par
  return null; // bogey or worse
}

export function strokeDiff(strokes: number, par: number): number {
  return strokes - par;
}

export function strokeLabel(diff: number): string {
  if (diff <= -2) return diff === -2 ? 'Eagle' : `${-diff} under`;
  if (diff === -1) return 'Birdie';
  if (diff === 0) return 'Par';
  if (diff === 1) return 'Bogey';
  return `+${diff}`;
}
