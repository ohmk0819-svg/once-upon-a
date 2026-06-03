import Phaser from "phaser";
import { Enemy } from "./Enemy";

export class Projectile extends Phaser.Physics.Arcade.Sprite {
  damage: number;
  sourceId: string;
  expiresAt: number;
  target?: Enemy;
  homingStrength: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    damage: number,
    sourceId: string,
    velocity: Phaser.Math.Vector2,
    lifeMs = 2600,
    target?: Enemy,
    homingStrength = 0
  ) {
    super(scene, x, y, texture);
    const now = (scene as any).getGameplayTime?.() ?? scene.time.now;
    this.damage = damage;
    this.sourceId = sourceId;
    this.expiresAt = now + lifeMs;
    this.target = target;
    this.homingStrength = homingStrength;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCircle(9);
    this.setDepth(45);
    this.setVelocity(velocity.x, velocity.y);
  }

  updateProjectile(time: number): void {
    if (time >= this.expiresAt) {
      this.destroy();
      return;
    }
    if (this.target && this.target.active && this.homingStrength > 0) {
      const current = new Phaser.Math.Vector2(this.body.velocity.x, this.body.velocity.y);
      const desired = new Phaser.Math.Vector2(this.target.x - this.x, this.target.y - this.y).normalize().scale(current.length());
      current.lerp(desired, this.homingStrength);
      this.setVelocity(current.x, current.y);
    }
    this.rotation += 0.16;
  }
}
