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
    // Shadow
    g.fillStyle(0x000000, 0.4);
    g.fillRect(x + 3, y + 4, w, h);
    // Base wood colour
    g.fillStyle(PAL.wood, 1);
    g.fillRect(x, y, w, h);
    // Top-light highlight (light source top-left)
    g.fillStyle(PAL.woodHighlight, 1);
    g.fillRect(x, y, w, 2);
    if (w < h) g.fillRect(x, y, 2, h);
    // Wood grain lines (subtle horizontal streaks)
    g.lineStyle(0.5, PAL.woodEdge, 0.35);
    const isHoriz = w > h;
    if (isHoriz) {
      for (let i = 3; i < h - 3; i += 2) {
        const wave = Math.sin(x * 0.05 + i) * 0.6;
        g.beginPath();
        g.moveTo(x, y + i + wave);
        g.lineTo(x + w, y + i + wave);
        g.strokePath();
      }
    } else {
      for (let i = 3; i < w - 3; i += 2) {
        const wave = Math.sin(y * 0.05 + i) * 0.6;
        g.beginPath();
        g.moveTo(x + i + wave, y);
        g.lineTo(x + i + wave, y + h);
        g.strokePath();
      }
    }
    // Plank divisions with visible butt-joints — 80px spacing.
    // At each division: a darker seam + a slight highlight on one side (raked).
    g.lineStyle(1.5, PAL.woodEdge, 1);
    if (isHoriz) {
      for (let i = 80; i < w; i += 80) {
        // Seam
        g.beginPath();
        g.moveTo(x + i, y);
        g.lineTo(x + i, y + h);
        g.strokePath();
        // Rake highlight on the right side of the seam
        g.fillStyle(0xa87038, 0.5);
        g.fillRect(x + i + 1, y + 1, 1, h - 2);
      }
    } else {
      for (let i = 80; i < h; i += 80) {
        g.beginPath();
        g.moveTo(x, y + i);
        g.lineTo(x + w, y + i);
        g.strokePath();
        g.fillStyle(0xa87038, 0.5);
        g.fillRect(x + 1, y + i + 1, w - 2, 1);
      }
    }
    // Outer outline
    g.lineStyle(1.5, PAL.woodEdge, 1);
    g.strokeRect(x + 0.75, y + 0.75, w - 1.5, h - 1.5);
    // Butt-joint corner caps — small dark shadows at the four corners
    // These make the plank butt-joints "read" at corners even if they're
    // just abutting the perpendicular wall.
    g.fillStyle(0x1a0a04, 0.7);
    g.fillRect(x, y, 3, 3);
    g.fillRect(x + w - 3, y, 3, 3);
    g.fillRect(x, y + h - 3, 3, 3);
    g.fillRect(x + w - 3, y + h - 3, 3, 3);
    // Nail heads — one at each end (real minigolf 2×6 fastener detail)
    g.fillStyle(0x2a1a10, 1);
    if (isHoriz) {
      g.fillCircle(x + 4, y + h / 2, 1.2);
      g.fillCircle(x + w - 4, y + h / 2, 1.2);
    } else {
      g.fillCircle(x + w / 2, y + 4, 1.2);
      g.fillCircle(x + w / 2, y + h - 4, 1.2);
    }
  }

  /**
   * Interior block wall — a big rectangular obstacle that isn't the
   * course perimeter. Renders as *out-of-bounds concrete* so the
   * playable area reads as an L-shape / U-shape / whatever the config
   * intends, not as a giant wooden pillar in the middle.
   */
  static renderBlock(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number): void {
    g.fillStyle(PAL.concrete, 1);
    g.fillRect(x, y, w, h);
    for (let i = 0; i < Math.floor((w * h) / 90); i++) {
      const alpha = 0.35 + Math.random() * 0.35;
      const shade =
        Math.random() < 0.5 ? 0x9a9084 : Math.random() < 0.5 ? 0x807870 : 0xc8c0b4;
      g.fillStyle(shade, alpha);
      g.fillRect(x + Math.random() * w, y + Math.random() * h, 1.5, 1.5);
    }
    g.lineStyle(2, 0x3a2818, 1);
    g.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    g.fillStyle(0x000000, 0.15);
    g.fillRect(x + 1, y + 1, w - 2, 3);
    g.fillRect(x + 1, y + 1, 3, h - 2);
  }
}
