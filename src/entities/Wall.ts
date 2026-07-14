/**
 * Wall — static Matter body + wooden-plank Graphics render.
 * Corner butt-joint detail flagged as TODO for art-pass polish (Constitution IV).
 */
import Phaser from 'phaser';
import { PAL } from '@/util/palette';

export class Wall {
  body: MatterJS.BodyType;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    w: number,
    h: number,
    kind: 'boundary' | 'block' = 'boundary'
  ) {
    this.body = scene.matter.add.rectangle(x + w / 2, y + h / 2, w, h, {
      isStatic: true,
      friction: 0.05,
      restitution: 0.7,
      label: 'wall',
    }) as MatterJS.BodyType;

    const g = scene.add.graphics().setDepth(1);
    if (kind === 'block') Wall.renderBlock(g, x, y, w, h);
    else Wall.renderBoundary(g, x, y, w, h);
  }

  /** Wooden 2×6 plank border wall — the course perimeter. */
  static renderBoundary(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number): void {
    g.fillStyle(0x000000, 0.35);
    g.fillRect(x + 3, y + 4, w, h);
    g.fillStyle(PAL.wood, 1);
    g.fillRect(x, y, w, h);
    g.fillStyle(PAL.woodHighlight, 1);
    g.fillRect(x, y, w, 2);
    if (w < h) g.fillRect(x, y, 2, h);
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
    g.lineStyle(1.5, PAL.woodEdge, 1);
    g.strokeRect(x + 0.75, y + 0.75, w - 1.5, h - 1.5);
  }

  /**
   * Interior block wall — a big rectangular obstacle that isn't the
   * course perimeter. Renders as *out-of-bounds concrete* so the
   * playable area reads as an L-shape / U-shape / whatever the config
   * intends, not as a giant wooden pillar in the middle.
   */
  static renderBlock(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number): void {
    // Concrete slab matching the "outside the course" background
    g.fillStyle(PAL.concrete, 1);
    g.fillRect(x, y, w, h);
    // Aggregate speckle so it looks paved, not flat
    for (let i = 0; i < Math.floor((w * h) / 90); i++) {
      const alpha = 0.35 + Math.random() * 0.35;
      const shade =
        Math.random() < 0.5 ? 0x9a9084 : Math.random() < 0.5 ? 0x807870 : 0xc8c0b4;
      g.fillStyle(shade, alpha);
      g.fillRect(x + Math.random() * w, y + Math.random() * h, 1.5, 1.5);
    }
    // Dark border seam where concrete meets grass — reads as a curb
    g.lineStyle(2, 0x3a2818, 1);
    g.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    // Subtle inset shadow (light source top-left, so shadow along top+left inside edge)
    g.fillStyle(0x000000, 0.15);
    g.fillRect(x + 1, y + 1, w - 2, 3);
    g.fillRect(x + 1, y + 1, 3, h - 2);
  }
}
