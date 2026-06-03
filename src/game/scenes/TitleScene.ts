import Phaser from "phaser";
import { t } from "../data/localization";
import { SaveSystem } from "../systems/SaveSystem";

export class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  create(): void {
    const save = SaveSystem.load();
    const language = save.settings?.language ?? "en";
    this.cameras.main.setBackgroundColor("#9cefd6");
    this.drawStorybookBackground();
    this.add.text(640, 118, t(language, "title"), {
      fontFamily: "Georgia, serif",
      fontSize: "74px",
      color: "#2d4b5b",
      stroke: "#fff7d6",
      strokeThickness: 8
    }).setOrigin(0.5);
    this.add.text(640, 194, t(language, "subtitle"), {
      fontFamily: "Verdana, sans-serif",
      fontSize: "23px",
      color: "#406578"
    }).setOrigin(0.5);
    this.add.text(640, 248, `${t(language, "storyShards")}: ${save.currency}`, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "20px",
      color: "#ffffff",
      stroke: "#4f9cab",
      strokeThickness: 4
    }).setOrigin(0.5);

    const items = [
      { label: t(language, "play"), scene: "CharacterSelectScene" },
      { label: t(language, "upgrades"), scene: "UpgradesScene" },
      { label: t(language, "collection"), scene: "CollectionScene" },
      { label: t(language, "achievements"), scene: "AchievementsScene" },
      { label: t(language, "settings"), scene: "SettingsScene" }
    ];
    items.forEach((item, index) => this.createMenuButton(640, 326 + index * 62, item.label, () => this.scene.start(item.scene)));
  }

  private createMenuButton(x: number, y: number, label: string, action: () => void): void {
    const button = this.add.rectangle(x, y, 320, 48, 0xfffef2, 0.95)
      .setStrokeStyle(4, 0x6bb7c8)
      .setInteractive({ useHandCursor: true });
    this.add.text(x, y, label, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "23px",
      color: "#2d4b5b",
      stroke: "#ffffff",
      strokeThickness: 3
    }).setOrigin(0.5);
    button.on("pointerover", () => button.setFillStyle(0xfff176, 0.97));
    button.on("pointerout", () => button.setFillStyle(0xfffef2, 0.95));
    button.on("pointerdown", action);
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
