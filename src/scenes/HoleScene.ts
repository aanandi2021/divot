/**
 * HoleScene — generic scene that plays any HoleConfig.
 * Loads walls, tee, cup, ball; wires AimSystem; tracks shots; awards medals.
 */
import Phaser from 'phaser';
import type { HoleConfig } from '@/contracts/HoleConfig';
import { HOLES } from '@/config/holes';
import { GAME } from '@/config/game';
import { PAL } from '@/util/palette';
import { Ball, BALL_FRICTION_AIR } from '@/entities/Ball';
import { Wall } from '@/entities/Wall';
import { Windmill } from '@/entities/Windmill';
import { Bumper } from '@/entities/Bumper';
import { drawCup, CUP_CAPTURE_RADIUS, CUP_MAX_CAPTURE_SPEED } from '@/entities/Cup';
import { drawTeeMat } from '@/entities/TeeMat';
import { AimSystem } from '@/systems/AimSystem';
import { AudioSystem } from '@/systems/AudioSystem';
import { computeMedal } from '@/systems/ScoreSystem';
import { SaveSystem } from '@/systems/SaveSystem';
import { HudChip } from '@/ui/HudChip';
import { UiButton } from '@/ui/UiButton';
import { showResult } from '@/ui/ResultBanner';

export class HoleScene extends Phaser.Scene {
  private cfg!: HoleConfig;
  private ball!: Ball;
  private aim!: AimSystem;
  private audio!: AudioSystem;
  private shots = 0;
  private complete = false;
  private hudShots!: HudChip;
  private hudBest!: HudChip;
  private windmills: Windmill[] = [];

  constructor() {
    super('Hole');
  }

  init(data: { holeId?: number }): void {
    const id = data.holeId ?? 1;
    const cfg = HOLES.find((h) => h.id === id);
    if (!cfg) throw new Error(`Unknown hole id: ${id}`);
    this.cfg = cfg;
  }

  create(): void {
    const W = GAME.width, H = GAME.height;
    this.shots = 0;
    this.complete = false;
    this.audio = new AudioSystem();
    const save = SaveSystem.load();
    this.audio.setMuted(save.mutedAudio);

    // Background — concrete surround
    this.add.rectangle(0, 0, W, H, PAL.concrete).setOrigin(0);

    // Astroturf fairway = interior of outer walls
    // Compute bounds from walls (rough): assume the first 4 walls form the outer rect.
    const outer = this.getOuterBounds();
    this.drawFairway(outer.x, outer.y, outer.w, outer.h);

    // Draw walls (boundary vs block affects rendering)
    this.cfg.walls.forEach((w) => new Wall(this, w.x, w.y, w.w, w.h, w.kind ?? 'boundary'));

    // Draw obstacles (windmills etc.)
    this.windmills = [];
    for (const o of this.cfg.obstacles) {
      if (o.kind === 'windmill') {
        this.windmills.push(
          new Windmill(this, {
            cx: o.x,
            cy: o.y,
            baseRadius: o.radius,
            bladeLength: o.bladeLength,
            rpm: o.rpm,
          })
        );
      } else if (o.kind === 'bumper') {
        new Bumper(this, o.x, o.y, o.radius);
      }
      // Other obstacle kinds: TBD (sliding-gate, pendulum, ferry, tunnel, loop)
    }

    // Tee mat
    drawTeeMat(this, this.cfg.tee.x - 24, this.cfg.tee.y - 12, 48, 24, `TEE ${this.cfg.id}`);

    // Cup
    if (this.cfg.cup.radius && this.cfg.cup.radius > 0) {
      drawCup(this, this.cfg.cup.x, this.cfg.cup.y, String(this.cfg.id));
    }

    // Ball
    this.ball = new Ball(this, this.cfg.tee.x, this.cfg.tee.y);

    // Aim
    this.aim = new AimSystem(this, this.ball);
    this.aim.onFire(() => {
      if (this.complete) return;
      this.shots++;
      this.hudShots.update(String(this.shots));
      this.audio.putt();
    });

    // HUD
    new HudChip(this, 20, 20, 'HOLE', `${this.cfg.id} · PAR ${this.cfg.par}`);
    this.hudShots = new HudChip(this, 180, 20, 'SHOTS', '0');
    const best = save.bestScores[this.cfg.id];
    this.hudBest = new HudChip(this, 340, 20, 'BEST', best !== undefined ? String(best) : '—');
    new UiButton(this, W - 200, 20, 180, 44, 'QUIT TO CLUBHOUSE', () =>
      this.scene.start('Clubhouse')
    );

    // Wall / windmill bounce sfx
    this.matter.world.on('collisionstart', (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
      for (const pair of event.pairs) {
        const a = pair.bodyA as unknown as { label: string; velocity: { x: number; y: number } };
        const b = pair.bodyB as unknown as { label: string; velocity: { x: number; y: number } };
        const ballBody = a.label === 'ball' ? a : b.label === 'ball' ? b : null;
        if (!ballBody) continue;
        const other = a === ballBody ? b.label : a.label;
        if (other === 'wall' || other === 'windmill' || other === 'windmill-base' || other === 'bumper') {
          this.audio.bounce(Math.hypot(ballBody.velocity.x, ballBody.velocity.y));
        }
      }
    });

    // Escape to quit
    this.input.keyboard?.on('keydown-ESC', () => this.scene.start('Clubhouse'));

    // Update loop
    this.events.on('update', (_t: number, dt: number) => this.tick(dt));
  }

  private tick(dt: number): void {
    // Advance obstacles
    for (const w of this.windmills) w.update(dt);
    this.ball.syncGraphics();
    const spd = this.ball.speed;
    if (spd > 0.3) this.audio.updateRoll(spd);
    else this.audio.stopRoll();

    if (this.complete) return;

    // Cup capture (distance + velocity, per Sketch 01 findings)
    if (this.cfg.cup.radius && this.cfg.cup.radius > 0) {
      const dx = this.ball.x - this.cfg.cup.x;
      const dy = this.ball.y - this.cfg.cup.y;
      const dist = Math.hypot(dx, dy);
      if (dist < CUP_CAPTURE_RADIUS) {
        if (spd < CUP_MAX_CAPTURE_SPEED) {
          this.finishHole();
        } else {
          // lip-out: tangential nudge
          const angle = Math.atan2(dy, dx) + Math.PI / 2;
          this.ball.setVelocity(Math.cos(angle) * spd * 0.8, Math.sin(angle) * spd * 0.8);
        }
      }
    }
  }

  private finishHole(): void {
    this.complete = true;
    this.aim.cancel();
    this.ball.setVelocity(0, 0);
    this.audio.stopRoll();
    this.audio.cupRattle();
    // Cup-drop animation: ball scales down + falls into hole center + fades
    const cupX = this.cfg.cup.x;
    const cupY = this.cfg.cup.y;
    this.tweens.add({
      targets: this.ball.gfx,
      x: cupX,
      y: cupY,
      scale: 0.35,
      alpha: 0.2,
      duration: 280,
      ease: 'Quad.easeIn',
      onUpdate: () => {
        // Lock physics position too so bounces don't fight the tween
        this.ball.setVelocity(0, 0);
      },
    });
    const medal = computeMedal(this.shots, this.cfg.par);
    if (medal) this.time.delayedCall(500, () => this.audio.medalJingle(medal));
    let save = SaveSystem.load();
    save = SaveSystem.recordScore(save, this.cfg.id, this.shots, medal);
    SaveSystem.save(save);
    const best = save.bestScores[this.cfg.id];
    this.hudBest.update(String(best));
    // Delay banner so the drop animation reads
    const holeId = this.cfg.id;
    const hasNext = HOLES.some((h) => h.id === holeId + 1);
    this.time.delayedCall(500, () => {
      showResult(this, {
        holeName: this.cfg.name,
        strokes: this.shots,
        par: this.cfg.par,
        medal,
        best: best!,
        onReplay: () => this.scene.restart({ holeId: this.cfg.id }),
        onClubhouse: () => this.scene.start('Clubhouse'),
        onNext: hasNext
          ? () => this.scene.restart({ holeId: this.cfg.id + 1 })
          : undefined,
      });
    });
  }

  private getOuterBounds(): { x: number; y: number; w: number; h: number } {
    // Naive: bounding box of all walls. Good enough for MVP.
    if (this.cfg.walls.length === 0) return { x: 0, y: 0, w: GAME.width, h: GAME.height };
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const w of this.cfg.walls) {
      minX = Math.min(minX, w.x);
      minY = Math.min(minY, w.y);
      maxX = Math.max(maxX, w.x + w.w);
      maxY = Math.max(maxY, w.y + w.h);
    }
    return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
  }

  private drawFairway(x: number, y: number, w: number, h: number): void {
    const g = this.add.graphics();
    g.fillStyle(PAL.grass, 1);
    g.fillRect(x, y, w, h);
    // stipple for grass texture
    for (let i = 0; i < 600; i++) {
      const px = x + Math.random() * w;
      const py = y + Math.random() * h;
      const s = Math.random() < 0.5 ? 0x486828 : 0x6a9a4a;
      g.fillStyle(s, 0.5);
      g.fillCircle(px, py, 0.7);
    }
    // subtle mowing stripes
    for (let i = 0; i < w; i += 32) {
      g.fillStyle(0x000000, 0.05);
      g.fillRect(x + i, y, 16, h);
    }
  }
  // silence unused-imports: BALL_FRICTION_AIR is referenced via Ball entity's defaults.
  static readonly _keepRef = BALL_FRICTION_AIR;
}
