import { describe, it, expect, beforeEach } from 'vitest';
import { SaveSystem } from '@/systems/SaveSystem';
import { emptySave } from '@/contracts/SaveState';

describe('SaveSystem', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns emptySave when no save exists', () => {
    const s = SaveSystem.load();
    expect(s).toEqual(emptySave());
  });

  it('round-trips a save', () => {
    const s = emptySave();
    s.medals[1] = 'silver';
    s.bestScores[1] = 2;
    SaveSystem.save(s);
    const loaded = SaveSystem.load();
    expect(loaded.medals[1]).toBe('silver');
    expect(loaded.bestScores[1]).toBe(2);
  });

  it('recovers from corrupted JSON', () => {
    localStorage.setItem('divot.save', '{not valid json');
    const s = SaveSystem.load();
    expect(s).toEqual(emptySave());
  });

  it('recovers from wrong version', () => {
    localStorage.setItem('divot.save', JSON.stringify({ version: 99, medals: {}, bestScores: {} }));
    const s = SaveSystem.load();
    expect(s).toEqual(emptySave());
  });

  it('recordScore updates best when lower', () => {
    let s = emptySave();
    s = SaveSystem.recordScore(s, 1, 3, 'bronze');
    expect(s.bestScores[1]).toBe(3);
    s = SaveSystem.recordScore(s, 1, 2, 'silver');
    expect(s.bestScores[1]).toBe(2);
  });

  it('recordScore does NOT overwrite best when higher', () => {
    let s = emptySave();
    s = SaveSystem.recordScore(s, 1, 2, 'silver');
    s = SaveSystem.recordScore(s, 1, 4, null);
    expect(s.bestScores[1]).toBe(2);
    expect(s.medals[1]).toBe('silver');
  });

  it('medal upgrades preserve higher tier', () => {
    let s = emptySave();
    s = SaveSystem.recordScore(s, 1, 3, 'bronze');
    s = SaveSystem.recordScore(s, 1, 3, 'bronze'); // re-bronze
    expect(s.medals[1]).toBe('bronze');
    s = SaveSystem.recordScore(s, 1, 2, 'silver');
    expect(s.medals[1]).toBe('silver');
    s = SaveSystem.recordScore(s, 1, 3, 'bronze'); // do not downgrade
    expect(s.medals[1]).toBe('silver');
  });
});
