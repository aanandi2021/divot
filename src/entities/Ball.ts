/**
 * Ball — Matter physics body wrapped with a Graphics visual.
 * Physics values ported from Sketch 01 where they were validated as "good."
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

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    // Create the Matter body (invisible; we draw a Graphics on top each frame)
    const image = scene.matter.add.image(x, y, '__DEFAULT');
    image.setVisible(false);
    image.setCircle(BALL_RADIUS);
    image.setFriction(BALL_FRICTION);
    image.setFrictionAir(BALL_FRICTION_AIR);
    image.setBounce(BALL_BOUNCE);
    (image.body as MatterJS.BodyType).label = 'ball';
    this.body = image.body as MatterJS.BodyType;

    // Draw once — we'll reposition each frame via update
    this.gfx = scene.add.graphics();
    this.gfx.setDepth(5);
    this.render();
  }

  private render(): void {
    const g = this.gfx;
    g.clear();
    // shadow
    g.fillStyle(0x000000, 0.35);
    g.fillEllipse(2, 4, 18, 6);
    // body
    g.fillStyle(PAL.ball, 1);
    g.fillCircle(0, 0, BALL_RADIUS);
    g.lineStyle(1, 0x8a8878, 1);
    g.strokeCircle(0, 0, BALL_RADIUS);
    // highlight
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
  }
  setFrictionAir(f: number): void {
    (this.body as unknown as { frictionAir: number }).frictionAir = f;
  }

  syncGraphics(): void {
    this.gfx.setPosition(this.x, this.y);
  }
}
