import Phaser from "phaser";

export class InputSystem {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys: Record<string, Phaser.Input.Keyboard.Key>;

  constructor(scene: Phaser.Scene) {
    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.keys = scene.input.keyboard!.addKeys("W,A,S,D,SPACE,SHIFT,Q,R,ENTER,TAB,C") as Record<string, Phaser.Input.Keyboard.Key>;
    scene.input.keyboard!.addCapture("TAB");
  }

  getMoveVector(): Phaser.Math.Vector2 {
    const x =
      (this.cursors.left.isDown || this.keys.A.isDown ? -1 : 0) +
      (this.cursors.right.isDown || this.keys.D.isDown ? 1 : 0);
    const y =
      (this.cursors.up.isDown || this.keys.W.isDown ? -1 : 0) +
      (this.cursors.down.isDown || this.keys.S.isDown ? 1 : 0);
    return new Phaser.Math.Vector2(x, y);
  }

  dashPressed(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.keys.SPACE) || Phaser.Input.Keyboard.JustDown(this.keys.SHIFT);
  }

  ultimatePressed(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.keys.Q) || Phaser.Input.Keyboard.JustDown(this.keys.R);
  }

  aimTogglePressed(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.keys.TAB) || Phaser.Input.Keyboard.JustDown(this.keys.C);
  }
}
