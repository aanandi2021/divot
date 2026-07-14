/**
 * ClubhouseScene — course-map hub with 16 pins (Range + 15 holes).
 * Only implemented holes are clickable. Back Six show a padlock unless unlocked.
 */
import Phaser from 'phaser';
import { FONT_UI, FONT_MONO } from '@/util/fonts';
import { ALL_PINS } from '@/config/holes';
import { SaveSystem } from '@/systems/SaveSystem';
import { isBackSixUnlocked } from '@/systems/UnlockSystem';
import type { MedalTier } from '@/contracts/SaveState';

export class ClubhouseScene extends Phaser.Scene {
  constructor() {
    super('Clubhouse');
  }

  create(): void {
    const { width: W, height: H } = this.scale;
    // Rich green background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x2a4a20, 0x2a4a20, 0x1a3a18, 0x1a3a18, 1);
    bg.fillRect(0, 0, W, H);

    // Title
    this.add
      .text(W / 2, 48, 'DIVOT', {
        fontFamily: FONT_UI,
        fontSize: '52px',
        color: '#f0d670',
        fontStyle: '700',
      })
      .setOrigin(0.5)
      .setResolution(2);
    this.add
      .text(W / 2, 92, 'the clubhouse', {
        fontFamily: FONT_MONO,
        fontSize: '13px',
        color: '#a89880',
      })
      .setOrigin(0.5)
      .setResolution(2);

    // Save summary
    const save = SaveSystem.load();
    const unlocked = isBackSixUnlocked(save);
    if (unlocked && !save.backSixUnlocked) {
      SaveSystem.save(SaveSystem.setUnlocked(save, true));
    }
    const bronzeCount = Object.values(save.medals).filter((m) => m === 'bronze').length;
    const silverCount = Object.values(save.medals).filter((m) => m === 'silver').length;
    const goldCount = Object.values(save.medals).filter((m) => m === 'gold').length;
    this.add
      .text(W / 2, 118, `🥉 ${bronzeCount}   🥈 ${silverCount}   🥇 ${goldCount}`, {
        fontFamily: FONT_MONO,
        fontSize: '13px',
        color: '#c8b088',
      })
      .setOrigin(0.5);

    // First-time Back Six unlock celebration
    if (unlocked && !save.hasSeenBackSixCelebration) {
      this.time.delayedCall(400, () => this.showUnlockCelebration());
      const next = { ...save, hasSeenBackSixCelebration: true, backSixUnlocked: true };
      SaveSystem.save(next);
    }

    // Course-map layout: 4 columns × 4 rows-ish
    const startY = 170;
    const pinW = 172, pinH = 96;
    const gapX = 12, gapY = 12;
    const cols = 4;
    const totalW = cols * pinW + (cols - 1) * gapX;
    const startX = (W - totalW) / 2;

    ALL_PINS.forEach((pin, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (pinW + gapX);
      const y = startY + row * (pinH + gapY);
      const locked = !pin.implemented || (!pin.frontNine && pin.id > 0 && !unlocked);

      const gfx = this.add.graphics();
      const bgCol = locked ? 0x3a2818 : 0x8a5a28;
      gfx.fillStyle(bgCol, 1);
      gfx.fillRoundedRect(x, y, pinW, pinH, 10);
      gfx.lineStyle(2, locked ? 0x1a0a08 : 0x3a1808, 1);
      gfx.strokeRoundedRect(x, y, pinW, pinH, 10);

      // Medal indicator
      const medal = save.medals[pin.id] as MedalTier | undefined;
      if (medal) {
        const c = medal === 'gold' ? 0xf0c840 : medal === 'silver' ? 0xd0d0d0 : 0xc87a3a;
        gfx.fillStyle(c, 1);
        gfx.fillCircle(x + pinW - 16, y + 16, 8);
        gfx.lineStyle(1, 0x000000, 1);
        gfx.strokeCircle(x + pinW - 16, y + 16, 8);
      }

      // Best score
      const best = save.bestScores[pin.id];
      if (best !== undefined && pin.id !== 0) {
        this.add
          .text(x + 12, y + 10, `best ${best}`, {
            fontFamily: FONT_MONO,
            fontSize: '10px',
            color: '#c8b088',
          })
          .setDepth(2);
      }

      // Pin ID + name
      const label = pin.id === 0 ? pin.name : `${pin.id} · ${pin.name}`;
      this.add
        .text(x + pinW / 2, y + pinH / 2 - 6, label, {
          fontFamily: FONT_UI,
          fontSize: '13px',
          color: locked ? '#6a5a48' : '#ffe0b0',
          fontStyle: '700',
          align: 'center',
          wordWrap: { width: pinW - 20 },
        })
        .setOrigin(0.5)
        .setDepth(2);

      if (!pin.implemented) {
        this.add
          .text(x + pinW / 2, y + pinH - 16, 'coming soon', {
            fontFamily: FONT_MONO,
            fontSize: '9px',
            color: '#8a7060',
          })
          .setOrigin(0.5)
          .setDepth(2);
      } else if (locked) {
        this.add
          .text(x + pinW / 2, y + pinH - 16, '🔒 locked', {
            fontFamily: FONT_MONO,
            fontSize: '9px',
            color: '#8a7060',
          })
          .setOrigin(0.5)
          .setDepth(2);
      } else {
        // Star difficulty
        this.add
          .text(x + pinW / 2, y + pinH - 16, '⭐'.repeat(pin.difficulty), {
            fontSize: '10px',
          })
          .setOrigin(0.5)
          .setDepth(2);
      }

      // Interactive if unlocked
      if (!locked) {
        const zone = this.add
          .zone(x, y, pinW, pinH)
          .setOrigin(0)
          .setInteractive({ useHandCursor: true });
        zone.setDepth(3);
        zone.on('pointerover', () => {
          gfx.clear();
          gfx.fillStyle(0xa87038, 1);
          gfx.fillRoundedRect(x, y, pinW, pinH, 10);
          gfx.lineStyle(3, 0xf0d670, 1);
          gfx.strokeRoundedRect(x, y, pinW, pinH, 10);
          if (medal) {
            const c =
              medal === 'gold' ? 0xf0c840 : medal === 'silver' ? 0xd0d0d0 : 0xc87a3a;
            gfx.fillStyle(c, 1);
            gfx.fillCircle(x + pinW - 16, y + 16, 8);
            gfx.lineStyle(1, 0x000000, 1);
            gfx.strokeCircle(x + pinW - 16, y + 16, 8);
          }
        });
        zone.on('pointerout', () => {
          gfx.clear();
          gfx.fillStyle(bgCol, 1);
          gfx.fillRoundedRect(x, y, pinW, pinH, 10);
          gfx.lineStyle(2, 0x3a1808, 1);
          gfx.strokeRoundedRect(x, y, pinW, pinH, 10);
          if (medal) {
            const c =
              medal === 'gold' ? 0xf0c840 : medal === 'silver' ? 0xd0d0d0 : 0xc87a3a;
            gfx.fillStyle(c, 1);
            gfx.fillCircle(x + pinW - 16, y + 16, 8);
            gfx.lineStyle(1, 0x000000, 1);
            gfx.strokeCircle(x + pinW - 16, y + 16, 8);
          }
        });
        zone.on('pointerdown', () => {
          if (pin.id === 0) {
            this.scene.start('Range');
          } else {
            this.scene.start('Hole', { holeId: pin.id });
          }
        });
      }
    });

    // Footer help
    this.add
      .text(W / 2, H - 30, 'click a pin to play · earn medals on all 9 front nine to unlock the back six', {
        fontFamily: FONT_MONO,
        fontSize: '10px',
        color: '#8a7060',
      })
      .setOrigin(0.5);
  }

  private showUnlockCelebration(): void {
    const { width: W, height: H } = this.scale;
    const overlay = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.6).setDepth(50);
    const bannerBg = this.add
      .rectangle(W / 2, H / 2, 560, 220, 0x1a1510, 0.98)
      .setStrokeStyle(4, 0xf0c840)
      .setDepth(51);
    const t1 = this.add
      .text(W / 2, H / 2 - 50, '🎉  BACK SIX UNLOCKED  🎉', {
        fontFamily: FONT_UI,
        fontSize: '26px',
        color: '#f0c840',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setResolution(window.devicePixelRatio || 2)
      .setDepth(52)
      .setAlpha(0);
    const t2 = this.add
      .text(W / 2, H / 2 + 4, 'You earned medals on every hole of the Front Nine.', {
        fontFamily: FONT_MONO,
        fontSize: '13px',
        color: '#c8b088',
      })
      .setOrigin(0.5)
      .setResolution(window.devicePixelRatio || 2)
      .setDepth(52)
      .setAlpha(0);
    const t3 = this.add
      .text(W / 2, H / 2 + 40, 'The Mystery Course awaits.', {
        fontFamily: FONT_MONO,
        fontSize: '13px',
        color: '#a89880',
        fontStyle: 'italic',
      })
      .setOrigin(0.5)
      .setResolution(window.devicePixelRatio || 2)
      .setDepth(52)
      .setAlpha(0);
    // Fade in text
    this.tweens.add({ targets: [t1, t2, t3], alpha: 1, duration: 500, delay: 200, ease: 'Quad.easeOut' });
    // Auto-dismiss after 4s
    this.time.delayedCall(4000, () => {
      this.tweens.add({
        targets: [overlay, bannerBg, t1, t2, t3],
        alpha: 0,
        duration: 400,
        onComplete: () => {
          overlay.destroy();
          bannerBg.destroy();
          t1.destroy();
          t2.destroy();
          t3.destroy();
        },
      });
    });
  }
}
