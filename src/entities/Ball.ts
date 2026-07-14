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
    // shadow — slightly offset behind direction of travel
    g.fillStyle(0x000000, 0.35);
    g.fillEllipse(2, 4, 18, 6);
    // body
    g.fillStyle(PAL.ball, 1);
    g.fillCircle(0, 0, BALL_RADIUS);
    g.lineStyle(1, 0x8a8878, 1);
    g.strokeCircle(0, 0, BALL_RADIUS);
    // rotating stripe — colored band that spins with motion
    g.fillStyle(0xc04030, 0.85);
    // A thin ellipse whose long axis rotates
    const stripe = 5;
    g.save();
    g.rotateCanvas(this.angle);
    g.fillStyle(0xc04030, 0.9);
    g.fillEllipse(0, 0, BALL_RADIUS * 1.8, stripe * 0.6);
    // Two small red dots at stripe ends for extra motion legibility
    g.fillStyle(0x8a2010, 0.9);
    g.fillCircle(BALL_RADIUS * 0.75, 0, 1.4);
    g.fillCircle(-BALL_RADIUS * 0.75, 0, 1.4);
    g.restore();
    // Highlight — always upper-left in world space (so it doesn't rotate)
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
    // Rotate the stripe based on distance travelled this frame.
    // A rolling ball rotates once per (2π × radius) of travel; we can approximate
    // by using angular = velocity magnitude / radius, scaled slightly for visual pop.
    const angular = this.speed / BALL_RADIUS;
    // Direction of the rotation follows the motion vector
    if (this.speed > 0.05) {
      this.angle += angular * 0.017 * Math.sign(this.vx || 1);
      // Actually, more correctly: rotate perpendicular to motion vector.
      // For a topdown view, the stripe should visually spin around the axis
      // of motion. We approximate by rotating the stripe angle continuously.
    }
    this.gfx.setPosition(this.x, this.y);
    this.render();
  }
}
