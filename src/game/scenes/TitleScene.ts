import Phaser from "phaser";
import { localization } from "../data/localization";

export class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#9cefd6");
    this.drawStorybookBackground();
    this.add.text(640, 210, localization.en.title, {
      fontFamily: "Georgia, serif",
      fontSize: "74px",
      color: "#2d4b5b",
      stroke: "#fff7d6",
      strokeThickness: 8
    }).setOrigin(0.5);
    this.add.text(640, 300, localization.en.subtitle, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "24px",
      color: "#406578"
    }).setOrigin(0.5);
    this.add.text(640, 420, "Press Enter to Start", {
      fontFamily: "Verdana, sans-serif",
      fontSize: "28px",
      color: "#ffffff",
      stroke: "#4f9cab",
      strokeThickness: 5
    }).setOrigin(0.5);
    this.input.keyboard!.once("keydown-ENTER", () => this.scene.start("CharacterSelectScene"));
  }

  private drawStorybookBackground(): void {
    this.add.rectangle(640, 540, 1280, 220, 0x8edb74);
    this.add.rectangle(640, 642, 1280, 120, 0xc88955, 0.38);
    for (let i = 0; i < 26; i += 1) {
      const x = 40 + i * 52;
      this.add.circle(x, 520 + Math.sin(i) * 18, 18, i % 2 === 0 ? 0xffb3c7 : 0xfff176, 0.9);
      this.add.rectangle(x, 548, 6, 42, 0x6fc47e);
    }
    for (let i = 0; i < 8; i += 1) {
      const x = 80 + i * 170;
      this.add.rectangle(x, 460, 72, 130, 0x7ccf6a);
      this.add.circle(x, 395, 58, 0xa8e27f);
      this.add.rectangle(x + 42, 500, 46, 30, 0xfff7d6).setRotation(0.18);
    }
  }
}
