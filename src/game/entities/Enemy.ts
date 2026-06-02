import Phaser from "phaser";
import { EnemyData } from "../types/gameTypes";

const ENEMY_TEXTURES: Record<string, string> = {
  cuteWolf: "enemy-small-wolf",
  gingerbreadSoldier: "enemy-cookie",
  roundMushroom: "enemy-mushroom",
  bigCuteWolf: "enemy-big-wolf"
};

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  readonly dataDef: EnemyData;
  hp: number;
  maxHp: number;
  isElite: boolean;
  lastHitAt = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, data: EnemyData, isElite = false) {
    super(scene, x, y, ENEMY_TEXTURES[data.visualType] ?? "enemy-small-wolf");
    this.dataDef = data;
    this.hp = data.hp;
    this.maxHp = data.hp;
    this.isElite = isElite;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(isElite ? 35 : 30);
    this.setCollideWorldBounds(false);
    this.setCircle(isElite ? 24 : 15);
    this.setScale(isElite ? 1.25 : 1);
  }

  updateChase(target: Phaser.Math.Vector2, slowFactor = 1): void {
    const direction = new Phaser.Math.Vector2(target.x - this.x, target.y - this.y);
    if (direction.lengthSq() === 0) {
      this.setVelocity(0, 0);
      return;
    }
    direction.normalize();
    const behaviorSpeed = this.dataDef.behavior === "slowChase" ? this.dataDef.moveSpeed * 0.82 : this.dataDef.moveSpeed;
    this.setVelocity(direction.x * behaviorSpeed * slowFactor, direction.y * behaviorSpeed * slowFactor);
  }

  takeDamage(amount: number): boolean {
    this.hp -= amount;
    this.setTint(0xffffff);
    this.scene.time.delayedCall(70, () => {
      if (this.active) {
        this.clearTint();
      }
    });
    return this.hp <= 0;
  }
}
