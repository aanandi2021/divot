/**
 * RangeScene — Hole 0: infinite balls, distance markers, no cup.
 * Reuses the fairway/wall drawing pattern from HoleScene but with respawn logic.
 */
import Phaser from 'phaser';
import { HOLE_0_RANGE } from '@/config/holes/hole-0-range';
import { GAME } from '@/config/game';
import { PAL } from '@/util/palette';
import { Ball } from '@/entities/Ball';
import { Wall } from '@/entities/Wall';
import { drawTeeMat } from '@/entities/TeeMat';
import { AimSystem } from '@/systems/AimSystem';
import { AudioSystem } from '@/systems/AudioSystem';
import { HudChip } from '@/ui/HudChip';
import { UiButton } from '@/ui/UiButton';

const PX_PER_METER = 22;

export class RangeScene extends Phaser.Scene {
  private ball!: Ball;
  private aim!: AimSystem;
  private audio!: AudioSystem;
  private shotStartX = 0;
  private shotStartY = 0;
  private lastDistance = 0;
  private ballStopped = true;
  private hudDist!: HudChip;
  private hudShots!: HudChip;
  private shotsTaken = 0;

  constructor() {
    super('Range');
  }

  create(): void {
    const W = GAME.width, H = GAME.height;
    this.audio = new AudioSystem();
    this.shotsTaken = 0;
    this.lastDistance = 0;
    this.ballStopped = true;

    // Background
    this.add.rectangle(0, 0, W, H, PAL.concrete).setOrigin(0);

    // Fairway
    const g = this.add.graphics();
    g.fillStyle(PAL.grass, 1);
    g.fillRect(60, 200, 1080, 360);
    for (let i = 0; i < 600; i++) {
      g.fillStyle(Math.random() < 0.5 ? 0x486828 : 0x6a9a4a, 0.5);
      g.fillCircle(60 + Math.random() * 1080, 200 + Math.random() * 360, 0.7);
    }

    // Distance markers
    const startX = 140 + 30; // just past the ball
    const markers = [5, 10, 20, 30, 40];
    markers.forEach((m) => {
      const px = startX + m * PX_PER_METER;
      if (px > 1140) return;
      g.lineStyle(2, 0xffffff, 0.5);
      g.beginPath();
      g.moveTo(px, 200);
      g.lineTo(px, 560);
      g.strokePath();
      this.add
        .text(px, 542, `${m}m`, {
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '11px',
          color: '#ffffff',
        })
        .setOrigin(0.5);
    });

    // Walls
    HOLE_0_RANGE.walls.forEach((w) => new Wall(this, w.x, w.y, w.w, w.h));

    // Tee
    const tee = HOLE_0_RANGE.tee;
    drawTeeMat(this, tee.x - 24 - 30, tee.y - 12, 48, 24, 'TEE');

    // HUD
    new HudChip(this, 20, 20, 'HOLE', 'RANGE (0)');
    this.hudShots = new HudChip(this, 180, 20, 'SHOTS', '0');
    this.hudDist = new HudChip(this, 340, 20, 'LAST DIST', '—');
    new UiButton(this, W - 200, 20, 180, 44, 'RETURN TO CLUBHOUSE', () =>
      this.scene.start('Clubhouse')
    );

    // Ball at tee (offset a bit from the mat so vector arrow has room)
    this.ball = new Ball(this, tee.x, tee.y);

    // Aim
    this.aim = new AimSystem(this, this.ball);
    this.aim.onFire(() => {
      this.shotsTaken++;
      this.shotStartX = this.ball.x;
      this.shotStartY = this.ball.y;
      this.hudShots.update(String(this.shotsTaken));
      this.audio.putt();
    });

    // Wall bounces
    this.matter.world.on('collisionstart', (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
      for (const pair of event.pairs) {
        const a = pair.bodyA as unknown as { label: string; velocity: { x: number; y: number } };
        const b = pair.bodyB as unknown as { label: string; velocity: { x: number; y: number } };
        const ballBody = a.label === 'ball' ? a : b.label === 'ball' ? b : null;
        if (!ballBody) continue;
        const other = a === ballBody ? b.label : a.label;
        if (other === 'wall') {
          this.audio.bounce(Math.hypot(ballBody.velocity.x, ballBody.velocity.y));
        }
      }
    });

    // Escape → clubhouse
    this.input.keyboard?.on('keydown-ESC', () => this.scene.start('Clubhouse'));

    // Update
    this.events.on('update', () => this.tick());

    // Help
    this.add
      .text(
        W / 2,
        H - 40,
        'click ball → drag cursor away (arrow appears) → click to fire · ESC returns to clubhouse',
        {
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '12px',
          color: '#5a4a30',
        }
      )
      .setOrigin(0.5);
  }

  private tick(): void {
    this.ball.syncGraphics();
    const spd = this.ball.speed;
    if (spd > 0.3) this.audio.updateRoll(spd);
    else this.audio.stopRoll();

    if (!this.ballStopped && spd < 0.15) {
      this.ballStopped = true;
      this.lastDistance = Math.round(
        Phaser.Math.Distance.Between(this.shotStartX, this.shotStartY, this.ball.x, this.ball.y) /
          PX_PER_METER
      );
      this.hudDist.update(`${this.lastDistance}m`);
      // Respawn ball at tee after brief pause
      this.time.delayedCall(700, () => {
        this.ball.setPosition(HOLE_0_RANGE.tee.x, HOLE_0_RANGE.tee.y);
      });
    }
    if (spd > 0.5) this.ballStopped = false;
  }
}
