import Phaser from "phaser";
import { BossData, EnemyData } from "../types/gameTypes";
import { Enemy } from "./Enemy";

export class Boss extends Enemy {
  readonly bossDef: BossData;

  constructor(scene: Phaser.Scene, x: number, y: number, data: BossData) {
    const enemyShape: EnemyData = {
      id: data.id,
      name: data.name,
      hp: data.hp,
      damage: data.damage,
      moveSpeed: data.moveSpeed,
      expDrop: 0,
      behavior: "eliteChase",
      visualType: "bigCuteWolf",
      color: data.color
    };
    super(scene, x, y, enemyShape, true);
    this.bossDef = data;
    this.setTexture("boss-big-bad-wolf");
    if (data.color) {
      this.setTint(data.color);
    }
    this.setCircle(42);
    this.setScale(1.15);
    this.setDepth(36);
  }
}
