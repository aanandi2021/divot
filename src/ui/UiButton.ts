import Phaser from 'phaser';

export class UiButton {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    w: number,
    h: number,
    label: string,
    onClick: () => void
  ) {
    const g = scene.add.graphics();
    g.fillStyle(0x8a5a28, 1);
    g.fillRoundedRect(x, y, w, h, 8);
    g.fillStyle(0xa87038, 1);
    g.fillRoundedRect(x, y, w, 6, { tl: 8, tr: 8, bl: 0, br: 0 });
    g.lineStyle(1.5, 0x3a1808, 1);
    g.strokeRoundedRect(x, y, w, h, 8);
    const t = scene.add
      .text(x + w / 2, y + h / 2, label, {
        fontFamily: 'Fredoka, sans-serif',
        fontSize: '14px',
        color: '#ffe0b0',
        fontStyle: '700',
      })
      .setOrigin(0.5);
    const zone = scene.add
      .zone(x, y, w, h)
      .setOrigin(0)
      .setInteractive({ useHandCursor: true });
    zone.on('pointerdown', () => onClick());
    zone.on('pointerover', () => t.setColor('#ffffff'));
    zone.on('pointerout', () => t.setColor('#ffe0b0'));
    g.setDepth(30);
    t.setDepth(31);
    zone.setDepth(32);
  }
}
