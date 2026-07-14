/**
 * Ball — Matter physics body + Graphics visual.
 * Motion is sold via:
 * 1. A fading motion trail behind the ball (~8 recent positions)
 * 2. An asymmetric colored wedge whose orientation follows the motion vector
 *    (much clearer visual than a rotating symmetric stripe)
 */
import Phaser from 'phaser';
import { PAL } from '@/util/palette';

export const BALL_RADIUS = 8;
export const BALL_FRICTION = 0.02;
export const BALL_FRICTION_AIR = 0.025;
export const BALL_BOUNCE = 0.6;

const TRAIL_LEN = 10;

export class Ball {
  scene: Phaser.Scene;
  body: MatterJS.BodyType;
  gfx: Phaser.GameObjects.Graphics;
  trailGfx: Phaser.GameObjects.Graphics;
  private trail: { x: number; y: number; age: number }[] = [];
  private lastSampleTime = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    const image = scene.matter.add.image(x, y, '__DEFAULT');
    image.setVisible(false);
    image.setCircle(BALL_RADIUS);
    image.setFriction(BALL_FRICTION);
    image.setFrictionAir(BALL_FRICTION_AIR);
    image.setBounce(BALL_BOUNCE);
    (image.body as MatterJS.BodyType).label = 'ball';
    this.body = image.body as MatterJS.BodyType;

    // Trail renders BELOW the ball
    this.trailGfx = scene.add.graphics().setDepth(4);
    this.gfx = scene.add.graphics().setDepth(5);
  }

  private render(): void {
    const g = this.gfx;
    g.clear();
    // Shadow
    g.fillStyle(0x000000, 0.35);
    g.fillEllipse(2, 4, 18, 6);
    // Base white ball
    g.fillStyle(PAL.ball, 1);
    g.fillCircle(0, 0, BALL_RADIUS);
    g.lineStyle(1, 0x8a8878, 1);
    g.strokeCircle(0, 0, BALL_RADIUS);
    // Directional wedge — points in the direction of travel.
    // Two hemispheres: a colored one facing motion + a white one trailing.
    const speed = this.speed;
    if (speed > 0.2) {
      const motionAngle = Math.atan2(this.vy, this.vx);
      // Draw a red half-disc on the leading edge
      g.fillStyle(0xc84020, 0.85);
      g.beginPath();
      g.arc(0, 0, BALL_RADIUS - 1.5, motionAngle - Math.PI / 2, motionAngle + Math.PI / 2);
      g.closePath();
      g.fillPath();
      // Small dark spot at the very leading edge — draws the eye forward
      g.fillStyle(0x2a1010, 1);
      g.fillCircle(
        Math.cos(motionAngle) * (BALL_RADIUS - 3),
        Math.sin(motionAngle) * (BALL_RADIUS - 3),
        1.4
      );
    } else {
      // At rest — subtle idle stripe so it's not blank
      g.fillStyle(0xc84020, 0.7);
      g.fillEllipse(0, 0, BALL_RADIUS * 1.7, 2.4);
    }
    // Fixed highlight (world-space)
    g.fillStyle(0xffffff, 0.9);
    g.fillCircle(-2.5, -2.5, 2.5);
  }

  private renderTrail(): void {
    const g = this.trailGfx;
    g.clear();
    if (this.trail.length < 2) return;
    for (let i = 0; i < this.trail.length; i++) {
      const p = this.trail[i];
      const t = p.age / TRAIL_LEN;
      const a = (1 - t) * 0.35;
      const r = BALL_RADIUS * (1 - t * 0.7);
      g.fillStyle(0xffffff, a);
      g.fillCircle(p.x, p.y, r);
    }
  }

  get x(): number { return this.body.position.x; }
  get y(): number { return this.body.position.y; }
  get vx(): number { return this.body.velocity.x; }
  get vy(): number { return this.body.velocity.y; }
  get speed(): number { return Math.hypot(this.vx, this.vy); }

  stopped(threshold = 0.25): boolean {
    return this.speed < threshold;
  }

  setVelocity(vx: number, vy: number): void {
    this.scene.matter.body.setVelocity(this.body, { x: vx, y: vy });
  }
  setPosition(x: number, y: number): void {
    this.scene.matter.body.setPosition(this.body, { x, y });
    this.scene.matter.body.setVelocity(this.body, { x: 0, y: 0 });
    this.trail = [];
    this.trailGfx.clear();
  }
  setFrictionAir(f: number): void {
    (this.body as unknown as { frictionAir: number }).frictionAir = f;
  }

  syncGraphics(): void {
    const now = this.scene.time.now;
    const speed = this.speed;
    // Sample a trail point every 30ms while moving
    if (speed > 0.5 && now - this.lastSampleTime > 30) {
      // Age all existing trail points
      for (const p of this.trail) p.age += 1;
      // Drop old ones
      this.trail = this.trail.filter((p) => p.age < TRAIL_LEN);
      // Insert new point at current position
      this.trail.unshift({ x: this.x, y: this.y, age: 0 });
      this.lastSampleTime = now;
    } else if (speed <= 0.2 && this.trail.length > 0) {
      // Ball stopped — fade trail out fast
      for (const p of this.trail) p.age += 2;
      this.trail = this.trail.filter((p) => p.age < TRAIL_LEN);
    }
    this.renderTrail();
    this.gfx.setPosition(this.x, this.y);
    this.render();
  }
}
