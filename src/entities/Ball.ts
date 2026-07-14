/**
 * Ball — Matter physics body wrapped with a Graphics visual.
 * Physics values ported from Sketch 01 where they were validated as "good."
 * Includes a rotating stripe so motion is visually legible.
 */
import Phaser from 'phaser';
import { PAL } from '@/util/palette';

export const BALL_RADIUS = 8;
export const BALL_FRICTION = 0.02;
export const BALL_FRICTION_AIR = 0.025;
export const BALL_BOUNCE = 0.6;

export class Ball {
  scene: Phaser.Scene;
  body: MatterJS.BodyType;
  gfx: Phaser.GameObjects.Graphics;
  private angle = 0; // visual rotation (radians)

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

    this.gfx = scene.add.graphics();
    this.gfx.setDepth(5);
  }

  private render(): void {
    const g = this.gfx;
    g.clear();
    // Shadow
    g.fillStyle(0x000000, 0.35);
    g.fillEllipse(2, 4, 18, 6);
    // Body
    g.fillStyle(PAL.ball, 1);
    g.fillCircle(0, 0, BALL_RADIUS);
    g.lineStyle(1, 0x8a8878, 1);
    g.strokeCircle(0, 0, BALL_RADIUS);
    // Asymmetric rotating pattern — red stripe + a distinct off-center dot.
    // The dot makes rotation legible even at glance because it's non-symmetric.
    g.save();
    g.rotateCanvas(this.angle);
    // Full-diameter red stripe (thin)
    g.fillStyle(0xc04030, 0.9);
    g.fillEllipse(0, 0, BALL_RADIUS * 1.85, 2.4);
    // Off-center marker dot — this is the "rolling" indicator
    g.fillStyle(0x1a1810, 1);
    g.fillCircle(BALL_RADIUS * 0.55, 0, 1.8);
    g.restore();
    // Fixed highlight (world-space, not rotating)
    g.fillStyle(0xffffff, 0.9);
    g.fillCircle(-2.5, -2.5, 2.5);
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
    this.angle = 0;
  }
  setFrictionAir(f: number): void {
    (this.body as unknown as { frictionAir: number }).frictionAir = f;
  }
  hide(): void {
    this.gfx.setVisible(false);
  }
  show(): void {
    this.gfx.setVisible(true);
  }
  scaleTo(s: number): void {
    this.gfx.setScale(s);
  }
  setAlpha(a: number): void {
    this.gfx.setAlpha(a);
  }

  syncGraphics(): void {
    // Real rolling: pattern rotation rate is ω = v/r. For a top-down 2D game
    // the rotation axis is perpendicular to the motion vector, but visually
    // we approximate by rotating the pattern around the ball center in the
    // direction of motion (right-hand rule with motion vector).
    const speed = this.speed;
    if (speed > 0.05) {
      // ω = v/r · sign of motion. Coefficient tuned so wheel visibly rolls.
      // Direction: cross product of motion with the screen normal (into page)
      // — for a ball moving right, positive angular velocity in screen space.
      const dt = (this.scene.game.loop.rawDelta || 16) / 1000;
      const omega = speed / BALL_RADIUS; // radians/sec (per unit)
      // Sign follows motion direction — rolling forward should look forward
      const sign = this.vx !== 0 ? Math.sign(this.vx) : Math.sign(this.vy);
      this.angle += omega * dt * sign;
    }
    this.gfx.setPosition(this.x, this.y);
    this.render();
  }
}
