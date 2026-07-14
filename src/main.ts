/**
 * main.ts — Phaser.Game bootstrap.
 * Constitution VIII sketch pattern was Phaser CDN + vanilla JS. This is the v1: Vite + TS.
 */
import Phaser from 'phaser';
import { GAME } from '@/config/game';
import { BootScene } from '@/scenes/BootScene';
import { ClubhouseScene } from '@/scenes/ClubhouseScene';
import { HoleScene } from '@/scenes/HoleScene';
import { RangeScene } from '@/scenes/RangeScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#2a2418',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME.width,
    height: GAME.height,
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: { x: 0, y: 0 }, // top-down — no gravity
      debug: false,
      enableSleeping: false,
    },
  },
  scene: [BootScene, ClubhouseScene, RangeScene, HoleScene],
};

new Phaser.Game(config);
