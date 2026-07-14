/**
 * Result banner shown when a hole is completed. Animated fade-in with
 * medal scale-up flourish.
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
  const dpr = window.devicePixelRatio || 2;

  const bg = scene.add
    .rectangle(W / 2, H / 2, 500, 260, 0x0a0805, 0.94)
    .setStrokeStyle(3, 0xf0d670)
    .setDepth(50)
    .setAlpha(0)
    .setScale(0.85);

  const title = scene.add
    .text(W / 2, H / 2 - 85, 'HOLE COMPLETE', {
      fontFamily: FONT_UI,
      fontSize: '22px',
      color: '#f0d670',
      fontStyle: 'bold',
    })
    .setOrigin(0.5)
    .setResolution(dpr)
    .setDepth(51)
    .setAlpha(0);

  const medalTxt = opts.medal ? opts.medal.toUpperCase() : 'BOGEY';
  const medalColor =
    opts.medal === 'gold'
      ? '#f0c840'
      : opts.medal === 'silver'
        ? '#d0d0d0'
        : opts.medal === 'bronze'
          ? '#c87a3a'
          : '#a25a3a';
  const medalText = scene.add
    .text(W / 2, H / 2 - 40, medalTxt, {
      fontFamily: FONT_UI,
      fontSize: '36px',
      color: medalColor,
      fontStyle: 'bold',
    })
    .setOrigin(0.5)
    .setResolution(dpr)
    .setDepth(51)
    .setAlpha(0)
    .setScale(0.3);

  const diff = opts.strokes - opts.par;
  const diffStr = diff === 0 ? 'PAR' : diff > 0 ? `+${diff}` : `${diff}`;
  const strokesText = scene.add
    .text(W / 2, H / 2, `${opts.strokes} shots · ${diffStr}`, {
      fontFamily: FONT_MONO,
      fontSize: '14px',
      color: '#c8b088',
    })
    .setOrigin(0.5)
    .setResolution(dpr)
    .setDepth(51)
    .setAlpha(0);

  const bestText = scene.add
    .text(W / 2, H / 2 + 24, `best: ${opts.best}`, {
      fontFamily: FONT_MONO,
      fontSize: '11px',
      color: '#8a7050',
    })
    .setOrigin(0.5)
    .setResolution(dpr)
    .setDepth(51)
    .setAlpha(0);

  scene.tweens.add({ targets: bg, alpha: 0.94, scale: 1, duration: 260, ease: 'Back.easeOut' });
  scene.tweens.add({ targets: title, alpha: 1, duration: 250, delay: 180 });
  scene.tweens.add({
    targets: medalText,
    alpha: 1,
    scale: 1,
    duration: 400,
    delay: 380,
    ease: 'Back.easeOut',
  });
  scene.tweens.add({ targets: strokesText, alpha: 1, duration: 250, delay: 600 });
  scene.tweens.add({ targets: bestText, alpha: 1, duration: 250, delay: 720 });

  const btnY = H / 2 + 70;
  scene.time.delayedCall(800, () => {
    if (opts.onNext) {
      new UiButton(scene, W / 2 - 260, btnY, 160, 42, 'REPLAY', opts.onReplay);
      new UiButton(scene, W / 2 - 80, btnY, 160, 42, 'CLUBHOUSE', opts.onClubhouse);
      new UiButton(scene, W / 2 + 100, btnY, 160, 42, 'NEXT HOLE', opts.onNext);
    } else {
      new UiButton(scene, W / 2 - 180, btnY, 160, 42, 'REPLAY', opts.onReplay);
      new UiButton(scene, W / 2 + 20, btnY, 160, 42, 'CLUBHOUSE', opts.onClubhouse);
    }
  });
}
