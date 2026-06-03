import Phaser from "phaser";

export class AreaEffect extends Phaser.GameObjects.Graphics {
  readonly xPos: number;
  readonly yPos: number;
  readonly radius: number;
  readonly damage: number;
  readonly sourceId: string;
  readonly expiresAt: number;
  nextTickAt: number;
  readonly tickMs: number;
  readonly knockback: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    radius: number,
    damage: number,
    sourceId: string,
    color: number,
    durationMs: number,
    tickMs = 450,
    knockback = 0
  ) {
    super(scene);
    const now = (scene as any).getGameplayTime?.() ?? scene.time.now;
    this.xPos = x;
    this.yPos = y;
    this.radius = radius;
    this.damage = damage;
    this.sourceId = sourceId;
    this.expiresAt = now + durationMs;
    this.nextTickAt = now;
    this.tickMs = tickMs;
    this.knockback = knockback;
    scene.add.existing(this);
    this.setDepth(20);
    this.fillStyle(color, 0.28);
    this.lineStyle(3, 0xffffff, 0.55);
    this.fillCircle(x, y, radius);
    this.strokeCircle(x, y, radius);
    scene.tweens.add({
      targets: this,
      alpha: 0.45,
      yoyo: true,
      repeat: -1,
      duration: 260
    });
  }

  shouldTick(time: number): boolean {
    if (time < this.nextTickAt) {
      return false;
    }
    this.nextTickAt = time + this.tickMs;
    return true;
  }
}
