/**
 * HudChip — small reusable HUD tile ("HOLE: 3 · PAR 3", etc.)
 */
import Phaser from 'phaser';

export class HudChip {
  private valueText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, label: string, initial: string) {
    const w = 140, h = 42;
    const bg = scene.add.rectangle(x, y, w, h, 0x1a1510, 0.88).setOrigin(0, 0);
    bg.setStrokeStyle(1, 0x8a6a3a);
    bg.setDepth(30);
    scene.add
      .text(x + w / 2, y + 6, label, {
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '9px',
        color: '#a89880',
      })
      .setOrigin(0.5, 0)
      .setDepth(31);
    this.valueText = scene.add
      .text(x + w / 2, y + 20, initial, {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '16px',
        color: '#f0d670',
      })
      .setOrigin(0.5, 0)
      .setDepth(31);
  }

  update(v: string): void {
    this.valueText.setText(v);
  }
}
