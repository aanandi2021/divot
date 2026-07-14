/**
 * Wall — static Matter body + wooden-plank Graphics render.
 * Corner butt-joint detail flagged as TODO for art-pass polish (Constitution IV).
 */
import Phaser from 'phaser';
import { PAL } from '@/util/palette';

export class Wall {
  body: MatterJS.BodyType;

  constructor(scene: Phaser.Scene, x: number, y: number, w: number, h: number) {
    // Static rectangle body
    this.body = scene.matter.add.rectangle(x + w / 2, y + h / 2, w, h, {
      isStatic: true,
      friction: 0.05,
      restitution: 0.7,
      label: 'wall',
    }) as MatterJS.BodyType;

    Wall.render(scene.add.graphics().setDepth(1), x, y, w, h);
  }

  static render(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number): void {
    // shadow into playfield
    g.fillStyle(0x000000, 0.35);
    g.fillRect(x + 3, y + 4, w, h);
    // wood body
    g.fillStyle(PAL.wood, 1);
    g.fillRect(x, y, w, h);
    // top highlight edge
    g.fillStyle(PAL.woodHighlight, 1);
    g.fillRect(x, y, w, 2);
    if (w < h) g.fillRect(x, y, 2, h);
    // plank divisions every ~80px
    g.lineStyle(1.5, PAL.woodEdge, 1);
    if (w > h) {
      for (let i = 80; i < w; i += 80) {
        g.beginPath();
        g.moveTo(x + i, y);
        g.lineTo(x + i, y + h);
        g.strokePath();
      }
    } else {
      for (let i = 80; i < h; i += 80) {
        g.beginPath();
        g.moveTo(x, y + i);
        g.lineTo(x + w, y + i);
        g.strokePath();
      }
    }
    // outline
    g.lineStyle(1.5, PAL.woodEdge, 1);
    g.strokeRect(x + 0.75, y + 0.75, w - 1.5, h - 1.5);
  }
}
