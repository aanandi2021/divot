/**
 * BootScene — waits for fonts, then transitions to Clubhouse.
 * Fonts come from Google Fonts CDN via index.html <link>, so we just poll.
 */
import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create(): void {
    // Wait briefly for webfonts to load, then start
    const start = () => this.scene.start('Clubhouse');
    if ((document as unknown as { fonts?: { ready?: Promise<unknown> } }).fonts?.ready) {
      (document as unknown as { fonts: { ready: Promise<unknown> } }).fonts.ready.then(() => start());
    } else {
      this.time.delayedCall(200, start);
    }

    // Simple loading text
    const { width: W, height: H } = this.scale;
    this.add
      .text(W / 2, H / 2, 'DIVOT', {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '48px',
        color: '#f0d670',
        fontStyle: '700',
      })
      .setOrigin(0.5);
    this.add
      .text(W / 2, H / 2 + 44, 'loading…', {
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '13px',
        color: '#a89880',
      })
      .setOrigin(0.5);
  }
}
