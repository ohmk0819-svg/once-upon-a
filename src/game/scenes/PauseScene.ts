import Phaser from "phaser";
import { t } from "../data/localization";
import { SaveSystem } from "../systems/SaveSystem";
import { GameMode } from "../types/gameTypes";
import { GameScene } from "./GameScene";

export class PauseScene extends Phaser.Scene {
  private characterId = "pinocchio";
  private stageId = "topsyTurvyStorybookForest";
  private mode: GameMode = "story";

  constructor() {
    super("PauseScene");
  }

  create(data: { characterId?: string; stageId?: string; mode?: GameMode }): void {
    this.characterId = data.characterId ?? this.characterId;
    this.stageId = data.stageId ?? this.stageId;
    this.mode = data.mode ?? this.mode;
    const language = SaveSystem.load().settings?.language ?? "en";
    this.add.rectangle(640, 360, 1280, 720, 0x243a4a, 0.5);
    this.add.rectangle(640, 360, 440, 360, 0xfffef2, 0.96).setStrokeStyle(5, 0x6bb7c8);
    this.add.text(640, 226, t(language, "paused"), {
      fontFamily: "Georgia, serif",
      fontSize: "48px",
      color: "#2d4b5b",
      stroke: "#ffffff",
      strokeThickness: 6
    }).setOrigin(0.5);
    this.add.text(640, 304, `${t(language, "controls")}\n${t(language, "pauseControls")}`, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "17px",
      color: "#406578",
      align: "center",
      lineSpacing: 8
    }).setOrigin(0.5);

    this.createButton(640, 430, t(language, "resume"), () => this.resumeGame());
    this.createButton(540, 504, t(language, "restart"), () => this.restartGame());
    this.createButton(740, 504, t(language, "mainTitle"), () => this.returnToTitle());

    this.input.keyboard!.once("keydown-ESC", () => this.resumeGame());
    this.input.keyboard!.once("keydown-ENTER", () => this.resumeGame());
    this.input.keyboard!.once("keydown-R", () => this.restartGame());
    this.input.keyboard!.once("keydown-T", () => this.returnToTitle());
  }

  private createButton(x: number, y: number, label: string, action: () => void): void {
    const button = this.add.rectangle(x, y, 160, 48, 0x80deea, 0.92)
      .setStrokeStyle(3, 0xffffff)
      .setInteractive({ useHandCursor: true });
    this.add.text(x, y, label, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "20px",
      color: "#2d4b5b",
      stroke: "#ffffff",
      strokeThickness: 3
    }).setOrigin(0.5);
    button.on("pointerover", () => button.setFillStyle(0xfff176, 0.96));
    button.on("pointerout", () => button.setFillStyle(0x80deea, 0.92));
    button.on("pointerdown", action);
  }

  private resumeGame(): void {
    const gameScene = this.scene.get("GameScene") as GameScene;
    gameScene.markGameplayResumed();
    this.scene.stop();
    this.scene.resume("GameScene");
  }

  private restartGame(): void {
    this.scene.stop("GameScene");
    this.scene.start("GameScene", { characterId: this.characterId, stageId: this.stageId, mode: this.mode });
  }

  private returnToTitle(): void {
    this.scene.stop("GameScene");
    this.scene.start("TitleScene");
  }
}
