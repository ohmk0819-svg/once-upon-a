import Phaser from "phaser";

export class DamageText extends Phaser.GameObjects.Text {
  constructor(scene: Phaser.Scene, x: number, y: number, value: number, isCrit: boolean) {
    super(scene, x, y, `${Math.ceil(value)}`, {
      fontFamily: "Verdana, sans-serif",
      fontSize: isCrit ? "22px" : "16px",
      color: isCrit ? "#ff5f93" : "#ffffff",
      stroke: isCrit ? "#fff176" : "#37556b",
      strokeThickness: 4
    });
    scene.add.existing(this);
    this.setDepth(80);
    this.setOrigin(0.5);

    scene.tweens.add({
      targets: this,
      y: y - 34,
      alpha: 0,
      duration: 620,
      ease: "Sine.easeOut",
      onComplete: () => this.destroy()
    });
  }
}
