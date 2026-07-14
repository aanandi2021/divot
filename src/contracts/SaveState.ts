/**
 * Persisted player state stored in localStorage under `divot.save`.
 * See spec.md §Key Entities and constitution.md Principle VI.
 */
export type MedalTier = 'bronze' | 'silver' | 'gold';

export interface SaveState {
  version: 1;
  medals: Record<number, MedalTier>;
  bestScores: Record<number, number>;
  backSixUnlocked: boolean;
  /** True once the player has seen the "Back Six unlocked!" celebration. */
  hasSeenBackSixCelebration?: boolean;
  mutedAudio: boolean;
}

export function emptySave(): SaveState {
  return {
    version: 1,
    medals: {},
    bestScores: {},
    backSixUnlocked: true, // all levels open for playtest
    hasSeenBackSixCelebration: true,
    mutedAudio: false,
  };
}
