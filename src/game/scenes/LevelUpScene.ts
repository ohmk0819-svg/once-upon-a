import Phaser from "phaser";
import { LevelUpOption } from "../types/gameTypes";
import { GameScene } from "./GameScene";

export class LevelUpScene extends Phaser.Scene {
  private options: LevelUpOption[] = [];

  constructor() {
    super("LevelUpScene");
  }

  create(data: { options: LevelUpOption[]; level: number; title?: string }): void {
    this.options = data.options;
    this.add.rectangle(640, 360, 1280, 720, 0x243a4a, 0.46);
    this.add.text(640, 92, data.title ?? `Level ${data.level}! Choose a story gift`, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "34px",
      color: "#ffffff",
      stroke: "#2d4b5b",
      strokeThickness: 5
    }).setOrigin(0.5);

    const startX = 160;
    for (let i = 0; i < this.options.length; i += 1) {
      this.createCard(startX + i * 340, 170, this.options[i], i);
    }

    this.input.keyboard!.on("keydown-ONE", () => this.choose(0));
    this.input.keyboard!.on("keydown-TWO", () => this.choose(1));
    this.input.keyboard!.on("keydown-THREE", () => this.choose(2));
    this.input.keyboard!.on("keydown-ENTER", () => this.choose(0));
  }

  private createCard(x: number, y: number, option: LevelUpOption, index: number): void {
    const card = this.add.graphics();
    card.fillStyle(0xfffef2, 0.96);
    card.lineStyle(5, 0x6bb7c8, 1);
    card.fillRoundedRect(x, y, 300, 370, 8);
    card.strokeRoundedRect(x, y, 300, 370, 8);

    const hover = this.add.rectangle(x + 150, y + 185, 300, 370, 0xffffff, 0)
      .setStrokeStyle(0, 0xffffff, 0)
      .setDepth(6);
    const title = this.add.text(x + 150, y + 22, option.title, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "20px",
      color: "#2d4b5b",
      align: "center",
      wordWrap: { width: 250 }
    }).setOrigin(0.5, 0);

    const kind = this.add.text(x + 150, y + 64, option.itemKind, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "13px",
      color: "#ffffff",
      backgroundColor: "#4fc3c7",
      padding: { x: 12, y: 5 }
    }).setOrigin(0.5);

    const icon = this.add.rectangle(x + 150, y + 126, 72, 72, option.color).setStrokeStyle(4, 0xffffff);
    this.add.text(x + 150, y + 126, option.iconKey, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "13px",
      color: "#2d4b5b",
      align: "center",
      stroke: "#ffffff",
      strokeThickness: 2
    }).setOrigin(0.5);

    if (option.isNew || option.isMax) {
      this.add.text(x + 252, y + 94, option.isNew ? "NEW" : "MAX", {
        fontFamily: "Verdana, sans-serif",
        fontSize: "14px",
        color: "#ffffff",
        backgroundColor: option.isNew ? "#ff8a65" : "#7e57c2",
        padding: { x: 8, y: 4 }
      }).setOrigin(0.5);
    }

    const level = option.type === "heal" ? "Recovery" : option.type === "evolution" ? "EVO" : `Lv ${option.currentLevel} -> ${option.nextLevel}`;
    const levelText = this.add.text(x + 150, y + 182, level, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "17px",
      color: "#4f9cab"
    }).setOrigin(0.5);
    const desc = this.add.text(x + 150, y + 216, option.description, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "15px",
      color: "#406578",
      align: "center",
      wordWrap: { width: 236 }
    }).setOrigin(0.5, 0);
    const key = this.add.text(x + 150, y + 322, option.type === "evolution" ? `EVO  Press ${index + 1}` : `Press ${index + 1}`, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "18px",
      color: "#ffffff",
      backgroundColor: "#4fc3c7",
      padding: { x: 18, y: 9 }
    }).setOrigin(0.5);

    const hitArea = this.add.rectangle(x + 150, y + 185, 300, 370, 0xffffff, 0).setInteractive({ useHandCursor: true });
    hitArea.on("pointerdown", () => this.choose(index));
    hitArea.on("pointerover", () => {
      icon.setScale(1.08);
      hover.setStrokeStyle(5, 0xfff176, 0.95);
    });
    hitArea.on("pointerout", () => {
      icon.setScale(1);
      hover.setStrokeStyle(0, 0xffffff, 0);
    });

    void kind;
    void title;
    void levelText;
    void desc;
    void key;
  }

  private choose(index: number): void {
    const option = this.options[index];
    if (!option) {
      return;
    }
    const gameScene = this.scene.get("GameScene") as GameScene;
    this.scene.stop("LevelUpScene");
    gameScene.chooseLevelUpOption(option);
  }
}
