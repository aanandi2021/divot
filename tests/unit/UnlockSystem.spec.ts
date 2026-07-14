import { describe, it, expect } from 'vitest';
import { isBackSixUnlocked } from '@/systems/UnlockSystem';
import { emptySave } from '@/contracts/SaveState';

describe('UnlockSystem', () => {
  it('locked by default', () => {
    expect(isBackSixUnlocked(emptySave())).toBe(false);
  });

  it('locked with 8 of 9 medals', () => {
    const s = emptySave();
    for (let id = 1; id <= 8; id++) s.medals[id] = 'bronze';
    expect(isBackSixUnlocked(s)).toBe(false);
  });

  it('unlocks with all 9 Front Nine medals', () => {
    const s = emptySave();
    for (let id = 1; id <= 9; id++) s.medals[id] = 'bronze';
    expect(isBackSixUnlocked(s)).toBe(true);
  });

  it('sticky — stays unlocked once set', () => {
    const s = emptySave();
    s.backSixUnlocked = true;
    expect(isBackSixUnlocked(s)).toBe(true);
  });

  it('mixed medal tiers still count', () => {
    const s = emptySave();
    s.medals[1] = 'bronze';
    s.medals[2] = 'silver';
    s.medals[3] = 'gold';
    for (let id = 4; id <= 9; id++) s.medals[id] = 'bronze';
    expect(isBackSixUnlocked(s)).toBe(true);
  });
});
