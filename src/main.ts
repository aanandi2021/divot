/**
 * main.ts — Phaser.Game bootstrap.
 * Scale.RESIZE + high-DPI canvas so text renders crisp at native pixel size.
 */
import Phaser from 'phaser';
import { BootScene } from '@/scenes/BootScene';
import { ClubhouseScene } from '@/scenes/ClubhouseScene';
import { HoleScene } from '@/scenes/HoleScene';
import { RangeScene } from '@/scenes/RangeScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#2a2418',
  scale: {
    // RESIZE fills the window at native pixel size — no bilinear stretch blur.
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  // High-DPI rendering: use device pixel ratio so text is crisp on Retina.
  render: {
    antialias: true,
    roundPixels: true,
    pixelArt: false,
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: { x: 0, y: 0 },
      debug: false,
      enableSleeping: false,
    },
  },
  scene: [BootScene, ClubhouseScene, RangeScene, HoleScene],
};

new Phaser.Game(config);
