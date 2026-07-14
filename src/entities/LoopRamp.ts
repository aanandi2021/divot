/**
 * LoopRamp — a segmented ring channel that keeps the ball on track through
 * a full 360° loop. Two concentric rings (outer + inner) approximated by N
 * thin wall segments each, with entry AND exit gaps so the ball is forced
 * to enter one side and emerge from the other.
 *
 * Validated in µ4-loop.html micro-MVP.
 * See spec HOLE-8, HOLE-13.
 */
import Phaser from 'phaser';

export interface LoopRampOpts {
  cx: number;
  cy: number;
  outerRadius: number;
  channelWidth: number;
  /** Number of ring segments (24 = every 15°) */
  segments?: number;
  /** Entry gap start/end angles (radians, 0=east, PI/2=south) */
  entryStart: number;
  entryEnd: number;
  /** Exit gap start/end angles (radians). If omitted, entry-only (rare). */
  exitStart?: number;
  exitEnd?: number;
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
    bgGfx.fillStyle(0x5a8a3a, 1);
    bgGfx.fillCircle(opts.cx, opts.cy, innerR);

    // Segment gap-check helper — a segment is "in a gap" if its arc [a1,a2]
    // is fully inside the gap arc [start,end].
    const isInGap = (a1: number, a2: number, start: number, end: number): boolean => {
      // Normalise angles to [0, 2π)
      const norm = (a: number) => ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const na1 = norm(a1);
      const na2 = norm(a2);
      const ns = norm(start);
      const ne = norm(end);
      // Handle wrap-around gaps
      if (ns <= ne) {
        return na1 >= ns && na2 <= ne;
      }
      // Gap wraps past 0
      return (na1 >= ns || na2 <= ne) && !(na1 <= ne && na2 >= ns && ns > ne);
    };

    for (let i = 0; i < segments; i++) {
      const a1 = (i / segments) * Math.PI * 2;
      const a2 = ((i + 1) / segments) * Math.PI * 2;
      const inEntry = isInGap(a1, a2, opts.entryStart, opts.entryEnd);
      const inExit =
        opts.exitStart !== undefined && opts.exitEnd !== undefined
          ? isInGap(a1, a2, opts.exitStart, opts.exitEnd)
          : false;
      if (inEntry || inExit) continue;
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
