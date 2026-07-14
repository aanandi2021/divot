/**
 * SaveSystem — read/write the divot.save blob in localStorage.
 * Migration-safe: checks the version field, falls back to empty on corrupted JSON.
 * See constitution.md Principle VI, spec.md FR-060/061/062.
 */
import type { SaveState, MedalTier } from '@/contracts/SaveState';
import { emptySave } from '@/contracts/SaveState';

const KEY = 'divot.save';

export class SaveSystem {
  static load(): SaveState {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return emptySave();
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 1) return parsed as SaveState;
      return emptySave();
    } catch {
      return emptySave();
    }
  }

  static save(state: SaveState): void {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      // Storage may be disabled or full; fail silently.
    }
  }

  static clear(): void {
    try {
      localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
  }

  static recordScore(
    save: SaveState,
    holeId: number,
    strokes: number,
    newMedal: MedalTier | null
  ): SaveState {
    const next: SaveState = {
      ...save,
      medals: { ...save.medals },
      bestScores: { ...save.bestScores },
    };
    const prevBest = save.bestScores[holeId];
    if (prevBest === undefined || strokes < prevBest) {
      next.bestScores[holeId] = strokes;
    }
    if (newMedal) {
      const rank: Record<MedalTier, number> = { bronze: 1, silver: 2, gold: 3 };
      const prev = save.medals[holeId];
      if (!prev || rank[newMedal] > rank[prev]) {
        next.medals[holeId] = newMedal;
      }
    }
    return next;
  }

  static setUnlocked(save: SaveState, unlocked: boolean): SaveState {
    return { ...save, backSixUnlocked: unlocked };
  }

  static setMuted(save: SaveState, muted: boolean): SaveState {
    return { ...save, mutedAudio: muted };
  }
}
