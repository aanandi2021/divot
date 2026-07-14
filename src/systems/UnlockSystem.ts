/**
 * UnlockSystem — determines whether Back Six should be unlocked.
 * See spec.md FR-040/041/042.
 */
import type { SaveState } from '@/contracts/SaveState';

const FRONT_NINE_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export function isBackSixUnlocked(save: SaveState): boolean {
  if (save.backSixUnlocked) return true; // sticky
  return FRONT_NINE_IDS.every((id) => save.medals[id] !== undefined);
}
