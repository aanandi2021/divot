/**
 * Result banner shown when a hole is completed.
 */
import Phaser from 'phaser';
import { FONT_UI, FONT_MONO } from '@/util/fonts';
import type { MedalTier } from '@/contracts/SaveState';
import { UiButton } from '@/ui/UiButton';

export interface ResultOpts {
  holeName: string;
  strokes: number;
  par: number;
  medal: MedalTier | null;
  best: number;
  onReplay: () => void;
  onClubhouse: () => void;
  onNext?: () => void;
}

export function showResult(scene: Phaser.Scene, opts: ResultOpts): void {
  const { width: W, height: H } = scene.scale;
  const bg = scene.add.rectangle(W / 2, H / 2, 500, 260, 0x0a0805, 0.94).setStrokeStyle(3, 0xf0d670);
  bg.setDepth(50);

  scene.add
    .text(W / 2, H / 2 - 85, 'HOLE COMPLETE', {
      fontFamily: FONT_UI,
      fontSize: '22px',
      color: '#f0d670',
      fontStyle: '700',
    })
    .setOrigin(0.5)
    .setDepth(51);

  const medalTxt = opts.medal ? opts.medal.toUpperCase() : 'BOGEY';
  const medalColor =
    opts.medal === 'gold'
      ? '#f0c840'
      : opts.medal === 'silver'
        ? '#d0d0d0'
        : opts.medal === 'bronze'
          ? '#c87a3a'
          : '#a25a3a';
  scene.add
    .text(W / 2, H / 2 - 40, medalTxt, {
      fontFamily: FONT_UI,
      fontSize: '36px',
      color: medalColor,
      fontStyle: '700',
    })
    .setOrigin(0.5)
    .setDepth(51);

  const diff = opts.strokes - opts.par;
  const diffStr = diff === 0 ? 'PAR' : diff > 0 ? `+${diff}` : `${diff}`;
  scene.add
    .text(W / 2, H / 2, `${opts.strokes} shots · ${diffStr}`, {
      fontFamily: FONT_MONO,
      fontSize: '14px',
      color: '#c8b088',
    })
    .setOrigin(0.5)
    .setDepth(51);

  scene.add
    .text(W / 2, H / 2 + 24, `best: ${opts.best}`, {
      fontFamily: FONT_MONO,
      fontSize: '11px',
      color: '#8a7050',
    })
    .setOrigin(0.5)
    .setDepth(51);

  const btnY = H / 2 + 70;
  if (opts.onNext) {
    new UiButton(scene, W / 2 - 260, btnY, 160, 42, 'REPLAY', opts.onReplay);
    new UiButton(scene, W / 2 - 80, btnY, 160, 42, 'CLUBHOUSE', opts.onClubhouse);
    new UiButton(scene, W / 2 + 100, btnY, 160, 42, 'NEXT HOLE', opts.onNext);
  } else {
    new UiButton(scene, W / 2 - 180, btnY, 160, 42, 'REPLAY', opts.onReplay);
    new UiButton(scene, W / 2 + 20, btnY, 160, 42, 'CLUBHOUSE', opts.onClubhouse);
  }
}
