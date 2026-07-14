/**
 * AimSystem — two-click cursor-vector aim.
 * Click 1 on ball → cursor becomes reticle.
 * Cursor position → vector arrow (cursor → ball) + power/distance readout.
 * Ball direction = opposite of cursor. Power = distance to cursor, capped.
 * Click 2 → fires with computed velocity.
 * See Constitution V + spec.md FR-010..017.
 */
import Phaser from 'phaser';
import { PAL } from '@/util/palette';
import { Ball } from '@/entities/Ball';

export interface AimResult {
  power: number; // 0..1
  angle: number; // radians (direction ball travels)
  velocity: { x: number; y: number };
}

export const AIM_MAX_POWER = 240; // pixels of drag → max power
export const AIM_FORCE_SCALE = 0.24; // multiplier for pixel-distance → Matter velocity

export class AimSystem {
  private ball: Ball;
  private active = false;
  private gfx: Phaser.GameObjects.Graphics;
  private readout: Phaser.GameObjects.Text;
  private onFireCb: ((r: AimResult) => void) | null = null;

  constructor(scene: Phaser.Scene, ball: Ball) {
    this.ball = ball;
    this.gfx = scene.add.graphics().setDepth(20);
    this.readout = scene.add
      .text(0, 0, '', {
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '13px',
        color: '#f0d670',
        backgroundColor: '#000000aa',
        padding: { x: 6, y: 3 },
      })
      .setDepth(21)
      .setVisible(false);

    scene.input.on('pointerdown', (p: Phaser.Input.Pointer) => this.onClick(p));
    scene.input.on('pointermove', (p: Phaser.Input.Pointer) => this.onMove(p));
    scene.input.keyboard?.on('keydown-ESC', () => this.cancel());
  }

  onFire(cb: (r: AimResult) => void): void {
    this.onFireCb = cb;
  }

  cancel(): void {
    this.active = false;
    this.gfx.clear();
    this.readout.setVisible(false);
  }

  private onClick(p: Phaser.Input.Pointer): void {
    if (!this.ball.stopped()) return;
    if (!this.active) {
      const d = Phaser.Math.Distance.Between(p.worldX, p.worldY, this.ball.x, this.ball.y);
      if (d < 32) {
        this.active = true;
        this.readout.setVisible(true);
        this.draw(p);
      }
      return;
    }
    this.fire(p);
  }

  private onMove(p: Phaser.Input.Pointer): void {
    if (!this.active) return;
    this.draw(p);
  }

  private draw(p: Phaser.Input.Pointer): void {
    const g = this.gfx;
    g.clear();
    const bx = this.ball.x, by = this.ball.y;
    const dx = p.worldX - bx, dy = p.worldY - by;
    const rawDist = Math.hypot(dx, dy);
    const dist = Math.min(rawDist, AIM_MAX_POWER);
    const power = dist / AIM_MAX_POWER;
    // arrow cursor → ball
    g.lineStyle(3, PAL.aimLine, 0.9);
    g.beginPath();
    g.moveTo(p.worldX, p.worldY);
    g.lineTo(bx, by);
    g.strokePath();
    // arrowhead
    const headLen = 10;
    const ang = Math.atan2(by - p.worldY, bx - p.worldX);
    g.fillStyle(PAL.aimLine, 0.9);
    g.beginPath();
    g.moveTo(bx, by);
    g.lineTo(bx - Math.cos(ang - Math.PI / 6) * headLen, by - Math.sin(ang - Math.PI / 6) * headLen);
    g.lineTo(bx - Math.cos(ang + Math.PI / 6) * headLen, by - Math.sin(ang + Math.PI / 6) * headLen);
    g.closePath();
    g.fillPath();
    // cursor dot
    g.fillStyle(PAL.aimDot, 0.9);
    g.fillCircle(p.worldX, p.worldY, 4);
    // power ring around ball
    g.lineStyle(3, 0xffe030, 0.4 + power * 0.6);
    g.strokeCircle(bx, by, 14 + power * 8);
    // readout
    this.readout.setText(`DIST ${Math.round(dist)}px · POWER ${Math.round(power * 100)}%`);
    this.readout.setPosition(p.worldX + 12, p.worldY + 12);
  }

  private fire(p: Phaser.Input.Pointer): void {
    const bx = this.ball.x, by = this.ball.y;
    const dx = p.worldX - bx, dy = p.worldY - by;
    const raw = Math.hypot(dx, dy);
    const dist = Math.min(raw, AIM_MAX_POWER);
    const nx = -dx / (raw || 1);
    const ny = -dy / (raw || 1);
    const vel = dist * AIM_FORCE_SCALE;
    const vx = nx * vel, vy = ny * vel;
    this.ball.setVelocity(vx, vy);
    this.active = false;
    this.gfx.clear();
    this.readout.setVisible(false);
    if (this.onFireCb) {
      this.onFireCb({
        power: dist / AIM_MAX_POWER,
        angle: Math.atan2(ny, nx),
        velocity: { x: vx, y: vy },
      });
    }
  }
}
