/**
 * LoopRamp — a segmented ring channel that keeps the ball on track through
 * a full 360° loop. Two concentric rings (outer + inner) approximated by N
 * thin wall segments each, with a gap for entry/exit.
 *
 * Validated in µ4-loop.html micro-MVP.
 * See spec HOLE-8.
 */
import Phaser from 'phaser';

export interface LoopRampOpts {
  cx: number;
  cy: number;
  outerRadius: number;
  channelWidth: number;
  /** Number of ring segments (24 = every 15°) */
  segments?: number;
  /** Entry gap: start and end angles in radians (0 = right, PI/2 = down) */
  entryStart: number;
  entryEnd: number;
}

export class LoopRamp {
  constructor(scene: Phaser.Scene, opts: LoopRampOpts) {
    const segments = opts.segments ?? 24;
    const outerR = opts.outerRadius;
    const innerR = outerR - opts.channelWidth;
    // Channel floor background
    const bgGfx = scene.add.graphics().setDepth(0.5);
    bgGfx.fillStyle(0x484438, 0.55);
    bgGfx.fillCircle(opts.cx, opts.cy, outerR);
    // Inner floor is grass again
    bgGfx.fillStyle(0x5a8a3a, 1);
    bgGfx.fillCircle(opts.cx, opts.cy, innerR);
    // Approximate rings with N segments each, skipping the entry gap
    for (let i = 0; i < segments; i++) {
      const a1 = (i / segments) * Math.PI * 2;
      const a2 = ((i + 1) / segments) * Math.PI * 2;
      if (a1 >= opts.entryStart && a2 <= opts.entryEnd) continue;
      LoopRamp.buildRingSegment(scene, opts.cx, opts.cy, a1, a2, outerR, 8, 'loop-outer');
      LoopRamp.buildRingSegment(scene, opts.cx, opts.cy, a1, a2, innerR, 8, 'loop-inner');
    }
  }

  static buildRingSegment(
    scene: Phaser.Scene,
    cx: number,
    cy: number,
    a1: number,
    a2: number,
    radius: number,
    thickness: number,
    label: string
  ): void {
    const midA = (a1 + a2) / 2;
    const px = cx + Math.cos(midA) * radius;
    const py = cy + Math.sin(midA) * radius;
    const chord = 2 * radius * Math.sin((a2 - a1) / 2);
    const bodyAngle = midA + Math.PI / 2;
    scene.matter.add.rectangle(px, py, chord, thickness, {
      isStatic: true,
      friction: 0.05,
      restitution: 0.7,
      label,
      angle: bodyAngle,
    });
    // Visual segment — polished steel look
    const g = scene.add.graphics().setDepth(2);
    g.save();
    g.translateCanvas(px, py);
    g.rotateCanvas(bodyAngle);
    g.fillStyle(0x000000, 0.35);
    g.fillRect(-chord / 2 + 2, -thickness / 2 + 2, chord, thickness);
    g.fillStyle(0x808080, 1);
    g.fillRect(-chord / 2, -thickness / 2, chord, thickness);
    g.fillStyle(0xa8a8a8, 1);
    g.fillRect(-chord / 2, -thickness / 2, chord, 2);
    g.lineStyle(1, 0x3a3a3a, 1);
    g.strokeRect(-chord / 2 + 0.5, -thickness / 2 + 0.5, chord - 1, thickness - 1);
    g.restore();
  }
}
