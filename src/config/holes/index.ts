/** Central hole registry — imported by ClubhouseScene and HoleScene. */
import { HOLE_0_RANGE } from './hole-0-range';
import { HOLE_1 } from './hole-1-straight';
import { HOLE_2 } from './hole-2-dogleg';
import type { HoleConfig } from '@/contracts/HoleConfig';

export const HOLES: HoleConfig[] = [HOLE_0_RANGE, HOLE_1, HOLE_2];

// Placeholder metadata for holes not yet implemented — used by CourseMap
// to render the locked pins.
export interface PinMeta {
  id: number;
  name: string;
  par: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  implemented: boolean;
  frontNine: boolean; // true for holes 1-9, false for Back Six
}

export const ALL_PINS: PinMeta[] = [
  { id: 0, name: 'Driving Range', par: 0, difficulty: 1, implemented: true, frontNine: false },
  { id: 1, name: 'Straight & True', par: 2, difficulty: 1, implemented: true, frontNine: true },
  { id: 2, name: 'The Dogleg', par: 3, difficulty: 2, implemented: true, frontNine: true },
  { id: 3, name: 'The Windmill', par: 3, difficulty: 2, implemented: false, frontNine: true },
  { id: 4, name: 'The Bumper Alley', par: 3, difficulty: 2, implemented: false, frontNine: true },
  { id: 5, name: 'The Waterfall', par: 3, difficulty: 3, implemented: false, frontNine: true },
  { id: 6, name: 'The Sliding Gate', par: 3, difficulty: 3, implemented: false, frontNine: true },
  { id: 7, name: 'The Volcano Green', par: 3, difficulty: 3, implemented: false, frontNine: true },
  { id: 8, name: 'The Loop-the-Loop', par: 2, difficulty: 4, implemented: false, frontNine: true },
  { id: 9, name: 'The Pit', par: 3, difficulty: 3, implemented: false, frontNine: true },
  { id: 10, name: 'The Tunnel Fork', par: 3, difficulty: 3, implemented: false, frontNine: false },
  { id: 11, name: 'The Pendulum', par: 3, difficulty: 4, implemented: false, frontNine: false },
  { id: 12, name: 'The Ridgeline', par: 3, difficulty: 4, implemented: false, frontNine: false },
  { id: 13, name: 'The Corkscrew', par: 3, difficulty: 4, implemented: false, frontNine: false },
  { id: 14, name: 'The Ferry', par: 3, difficulty: 4, implemented: false, frontNine: false },
  { id: 15, name: 'The Championship', par: 4, difficulty: 5, implemented: false, frontNine: false },
];
