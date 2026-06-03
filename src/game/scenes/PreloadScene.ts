import Phaser from "phaser";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  create(): void {
    this.createCircleTexture("player-woodcutter", 46, 0x8bc34a, 0x6d4c41);
    this.createCircleTexture("player-pinocchio", 46, 0x64c7ff, 0x2d6f9f);
    this.createCircleTexture("player-cinderella", 46, 0x90caf9, 0x9575cd);
    this.createCircleTexture("player-momotaro", 46, 0xffab91, 0xff7043);
    this.createCircleTexture("enemy-small-wolf", 34, 0xb4a18f, 0x6c5a51);
    this.createCircleTexture("enemy-cookie", 36, 0xd89b5d, 0x8d5f37);
    this.createCircleTexture("enemy-mushroom", 42, 0xff8aa4, 0x6fc47e);
    this.createCircleTexture("enemy-big-wolf", 64, 0xa7a39d, 0x645b55);
    this.createCircleTexture("boss-big-bad-wolf", 96, 0xb8afa5, 0x5f524b);
    this.createDiamondTexture("pickup-exp", 22, 0x35d8df, 0xffffff);
    this.createCircleTexture("projectile-breadcrumb", 20, 0xc58b4d, 0x8a5b32);
    this.createCircleTexture("projectile-apple", 21, 0xff5f7e, 0xffffff);
    this.createCircleTexture("projectile-bread", 21, 0xf5c16d, 0x8a5b32);
    this.createCircleTexture("projectile-bottle", 21, 0x80deea, 0xffffff);
    this.createCircleTexture("projectile-old-axe", 24, 0x8d6e63, 0xd7ccc8);
    this.createCircleTexture("projectile-silver-axe", 24, 0xcfd8dc, 0xffffff);
    this.createCircleTexture("projectile-golden-axe", 24, 0xffd54f, 0xffffff);
    this.createDiamondTexture("projectile-glass", 22, 0xb3e5fc, 0xffffff);
    this.createCircleTexture("projectile-bubble", 28, 0x9be7ff, 0xffffff);
    this.createDiamondTexture("projectile-mirror", 24, 0xe1f5fe, 0xffffff);
    this.createCircleTexture("projectile-peach-wave", 22, 0xffab91, 0xffffff);
    this.createCircleTexture("companion-dog", 26, 0xa9825a, 0x6d4c41);
    this.createCircleTexture("companion-monkey", 24, 0xd9894f, 0x6d4c41);
    this.createCircleTexture("companion-pheasant", 22, 0x4dd0e1, 0x43a047);
    this.createCircleTexture("companion-ally", 24, 0xffcc80, 0xffffff);
    this.scene.start("TitleScene");
  }

  private createCircleTexture(key: string, size: number, color: number, outline: number): void {
    const graphics = this.add.graphics();
    graphics.clear();
    graphics.fillStyle(color, 1);
    graphics.lineStyle(4, outline, 1);
    graphics.fillCircle(size / 2, size / 2, size / 2 - 4);
    graphics.strokeCircle(size / 2, size / 2, size / 2 - 4);
    graphics.fillStyle(0xffffff, 0.9);
    graphics.fillCircle(size * 0.36, size * 0.38, Math.max(2, size * 0.06));
    graphics.fillCircle(size * 0.62, size * 0.38, Math.max(2, size * 0.06));
    graphics.generateTexture(key, size, size);
    graphics.destroy();
  }

  private createDiamondTexture(key: string, size: number, color: number, outline: number): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(color, 1);
    graphics.lineStyle(3, outline, 1);
    graphics.beginPath();
    graphics.moveTo(size / 2, 1);
    graphics.lineTo(size - 1, size / 2);
    graphics.lineTo(size / 2, size - 1);
    graphics.lineTo(1, size / 2);
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();
    graphics.generateTexture(key, size, size);
    graphics.destroy();
  }
}
