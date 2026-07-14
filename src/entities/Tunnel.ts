/**
 * Tunnel — a portal pair. Ball entering one exits the other with preserved
 * speed but re-aimed velocity based on the exit portal's orientation.
 * See spec HOLE-9.
 */
import Phaser from 'phaser';
import type { Ball } from '@/entities/Ball';

export interface TunnelOpts {
  entry: { x: number; y: number };
  exit: { x: number; y: number };
  radius: number;
  /** If provided, exit velocity is oriented in this direction (degrees, 0=east) */
  exitDirectionDeg?: number;
}

const CD_MS = 300; // portal cooldown to avoid instant re-entry loop

export class Tunnel {
  constructor(scene: Phaser.Scene, ball: Ball, opts: TunnelOpts) {
    // Visual — dark circular hole at each end
    for (const p of [opts.entry, opts.exit]) {
      const g = scene.add.graphics().setDepth(0.5);
      g.fillStyle(0x1a0a08, 1);
      g.fillCircle(p.x, p.y, opts.radius);
      g.lineStyle(2, 0x000000, 1);
      g.strokeCircle(p.x, p.y, opts.radius);
      // Inner dark gradient hint
      g.fillStyle(0x000000, 0.6);
      g.fillCircle(p.x, p.y, opts.radius * 0.55);
    }
    // Per-frame check — if ball is inside entry, teleport to exit
    let lastTeleport = -1e9;
    scene.matter.world.on('beforeupdate', () => {
      const now = scene.time.now;
      if (now - lastTeleport < CD_MS) return;
      const bx = ball.x, by = ball.y;
      const dEntry = Math.hypot(bx - opts.entry.x, by - opts.entry.y);
      const dExit = Math.hypot(bx - opts.exit.x, by - opts.exit.y);
      if (dEntry < opts.radius) {
        const spd = ball.speed;
        let vx: number, vy: number;
        if (opts.exitDirectionDeg !== undefined) {
          const a = (opts.exitDirectionDeg * Math.PI) / 180;
          vx = Math.cos(a) * spd;
          vy = Math.sin(a) * spd;
        } else {
          vx = ball.vx; vy = ball.vy;
        }
        // Teleport just past the exit rim in the direction of exit velocity
        const push = opts.radius + 12;
        const nx = spd > 0 ? vx / spd : 1, ny = spd > 0 ? vy / spd : 0;
        ball.setPosition(opts.exit.x + nx * push, opts.exit.y + ny * push);
        ball.setVelocity(vx, vy);
        lastTeleport = now;
      } else if (dExit < opts.radius) {
        // Reverse routing (rare but symmetric)
        const spd = ball.speed;
        const nx = spd > 0 ? ball.vx / spd : -1, ny = spd > 0 ? ball.vy / spd : 0;
        ball.setPosition(opts.entry.x + nx * (opts.radius + 12), opts.entry.y + ny * (opts.radius + 12));
        ball.setVelocity(ball.vx, ball.vy);
        lastTeleport = now;
      }
    });
  }
}
