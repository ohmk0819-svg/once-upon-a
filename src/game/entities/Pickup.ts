import Phaser from "phaser";
import { Player } from "./Player";

export class Pickup extends Phaser.Physics.Arcade.Sprite {
  expValue: number;

  constructor(scene: Phaser.Scene, x: number, y: number, expValue: number) {
    super(scene, x, y, "pickup-exp");
    this.expValue = expValue;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCircle(8);
    this.setDepth(25);
  }

  updatePickup(player: Player): void {
    const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    if (distance < 80) {
      const direction = new Phaser.Math.Vector2(player.x - this.x, player.y - this.y).normalize();
      const speed = Phaser.Math.Linear(160, 520, 1 - distance / 80);
      this.setVelocity(direction.x * speed, direction.y * speed);
    } else {
      this.setVelocity(0, 0);
    }
  }
}
