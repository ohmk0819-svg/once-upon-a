import Phaser from "phaser";
import { getCharacter } from "../data/characters";

export class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super("CharacterSelectScene");
  }

  create(): void {
    const pinocchio = getCharacter("pinocchio");
    this.cameras.main.setBackgroundColor("#b7ef9b");
    this.add.rectangle(640, 360, 1280, 720, 0xb7ef9b);
    this.add.text(640, 92, "Character Select", {
      fontFamily: "Verdana, sans-serif",
      fontSize: "42px",
      color: "#2d4b5b",
      stroke: "#ffffff",
      strokeThickness: 6
    }).setOrigin(0.5);

    const card = this.add.graphics();
    card.fillStyle(0xfffef2, 0.92);
    card.lineStyle(5, 0x6bb7c8, 1);
    card.fillRoundedRect(420, 165, 440, 360, 8);
    card.strokeRoundedRect(420, 165, 440, 360, 8);

    this.add.image(640, 270, "player-pinocchio").setScale(2.1);
    this.add.text(640, 350, `${pinocchio.name.en} / ${pinocchio.name.ko}`, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "30px",
      color: "#2d4b5b"
    }).setOrigin(0.5);
    this.add.text(640, 406, pinocchio.description.en, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "17px",
      color: "#406578",
      align: "center",
      wordWrap: { width: 350 }
    }).setOrigin(0.5);

    const start = this.add.text(640, 585, "Start", {
      fontFamily: "Verdana, sans-serif",
      fontSize: "28px",
      color: "#ffffff",
      backgroundColor: "#4fc3c7",
      padding: { x: 32, y: 14 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    start.on("pointerdown", () => this.startGame());
    this.input.keyboard!.once("keydown-ENTER", () => this.startGame());
  }

  private startGame(): void {
    this.scene.start("GameScene", { characterId: "pinocchio" });
  }
}
