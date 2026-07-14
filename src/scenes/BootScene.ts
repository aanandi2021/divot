/**
 * BootScene — transitions to Clubhouse. Uses system fonts so no CDN wait needed.
 */
import Phaser from 'phaser';
import { FONT_UI, FONT_MONO } from '@/util/fonts';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create(): void {
    const { width: W, height: H } = this.scale;
    this.add
      .text(W / 2, H / 2, 'DIVOT', {
        fontFamily: FONT_UI,
        fontSize: '56px',
        color: '#f0d670',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setResolution(window.devicePixelRatio || 2);
    this.add
      .text(W / 2, H / 2 + 48, 'loading…', {
        fontFamily: FONT_MONO,
        fontSize: '14px',
        color: '#a89880',
      })
      .setOrigin(0.5)
      .setResolution(window.devicePixelRatio || 2);
    // System fonts render instantly — go quickly
    this.time.delayedCall(120, () => this.scene.start('Clubhouse'));
  }
}

