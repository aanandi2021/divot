/**
 * BootScene — waits for critical fonts to actually load (not just DOM ready),
 * then transitions to Clubhouse.
 */
import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create(): void {
    const { width: W, height: H } = this.scale;
    // Loading placeholder — uses a system font so it renders even before Fredoka loads
    this.add
      .text(W / 2, H / 2, 'DIVOT', {
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontSize: '48px',
        color: '#f0d670',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setResolution(2);
    this.add
      .text(W / 2, H / 2 + 44, 'loading…', {
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontSize: '13px',
        color: '#a89880',
      })
      .setOrigin(0.5)
      .setResolution(2);

    // Force-load the critical fonts we use in the game
    const fontsApi = (document as unknown as {
      fonts?: { load(spec: string): Promise<unknown>; ready?: Promise<unknown> };
    }).fonts;
    const start = () => this.scene.start('Clubhouse');
    if (fontsApi) {
      Promise.all([
        fontsApi.load('700 52px "Fredoka"'),
        fontsApi.load('500 16px "Fredoka"'),
        fontsApi.load('500 13px "IBM Plex Mono"'),
        fontsApi.ready ?? Promise.resolve(),
      ])
        .then(() => start())
        .catch(() => start());
    } else {
      this.time.delayedCall(300, start);
    }
  }
}

