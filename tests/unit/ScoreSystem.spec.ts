import { describe, it, expect } from 'vitest';
import { computeMedal, strokeDiff, strokeLabel } from '@/systems/ScoreSystem';

describe('ScoreSystem', () => {
  it('bronze at par', () => {
    expect(computeMedal(3, 3)).toBe('bronze');
  });
  it('silver at birdie (par-1)', () => {
    expect(computeMedal(2, 3)).toBe('silver');
  });
  it('gold at eagle or better', () => {
    expect(computeMedal(1, 3)).toBe('gold');
    expect(computeMedal(1, 4)).toBe('gold');
  });
  it('no medal at bogey', () => {
    expect(computeMedal(4, 3)).toBeNull();
  });
  it('strokeDiff', () => {
    expect(strokeDiff(2, 3)).toBe(-1);
    expect(strokeDiff(5, 3)).toBe(2);
  });
  it('strokeLabel', () => {
    expect(strokeLabel(0)).toBe('Par');
    expect(strokeLabel(-1)).toBe('Birdie');
    expect(strokeLabel(-2)).toBe('Eagle');
    expect(strokeLabel(1)).toBe('Bogey');
    expect(strokeLabel(3)).toBe('+3');
  });
});
