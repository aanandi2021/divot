/**
 * HudChip — small reusable HUD tile ("HOLE: 3 · PAR 3", etc.)
 */
import Phaser from 'phaser';
import { FONT_UI, FONT_MONO } from '@/util/fonts';

export class HudChip {
  private valueText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, label: string, initial: string) {
    const w = 140, h = 44;
    const dpr = window.devicePixelRatio || 2;
    const bg = scene.add.rectangle(x, y, w, h, 0x1a1510, 0.88).setOrigin(0, 0);
    bg.setStrokeStyle(1, 0x8a6a3a);
    bg.setDepth(30);
    scene.add
      .text(x + w / 2, y + 7, label, {
        fontFamily: FONT_MONO,
        fontSize: '10px',
        color: '#a89880',
      })
      .setOrigin(0.5, 0)
      .setResolution(dpr)
      .setDepth(31);
    this.valueText = scene.add
      .text(x + w / 2, y + 22, initial, {
        fontFamily: FONT_UI,
        fontSize: '17px',
        color: '#f0d670',
        fontStyle: 'bold',
      })
      .setOrigin(0.5, 0)
      .setResolution(dpr)
      .setDepth(31);
  }

  update(v: string): void {
    this.valueText.setText(v);
  }
}
