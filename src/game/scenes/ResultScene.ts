import Phaser from "phaser";
import { formatTime } from "../utils/math";

export class ResultScene extends Phaser.Scene {
  constructor() {
    super("ResultScene");
  }

  create(data: { characterId?: string; stageId?: string; clear: boolean; survivalTime: number; kills: number; level: number; currencyEarned: number; devMode?: boolean }): void {
    this.cameras.main.setBackgroundColor(data.clear ? "#b7ef9b" : "#a9d9ef");
    this.add.rectangle(640, 360, 1280, 720, data.clear ? 0xb7ef9b : 0xa9d9ef);
    this.add.text(640, 140, data.clear ? "Clear" : "Game Over", {
      fontFamily: "Georgia, serif",
      fontSize: "68px",
      color: "#2d4b5b",
      stroke: "#fff7d6",
      strokeThickness: 8
    }).setOrigin(0.5);

    this.add.text(
      640,
      280,
        `Survival Time  ${formatTime(data.survivalTime)}\n` +
        `Kills  ${data.kills}\n` +
        `Level  ${data.level}\n` +
        `Story Fragments  +${data.currencyEarned}` +
        (data.devMode ? "\nDev run - records not saved" : ""),
      {
        fontFamily: "Verdana, sans-serif",
        fontSize: "26px",
        color: "#2d4b5b",
        align: "center",
        lineSpacing: 18
      }
    ).setOrigin(0.5);

    this.add.text(640, 540, "Enter: Retry     T: Title", {
      fontFamily: "Verdana, sans-serif",
      fontSize: "24px",
      color: "#ffffff",
      stroke: "#4f9cab",
      strokeThickness: 5
    }).setOrigin(0.5);

    this.input.keyboard!.once("keydown-ENTER", () => this.scene.start("GameScene", { characterId: data.characterId ?? "pinocchio", stageId: data.stageId ?? "topsyTurvyStorybookForest" }));
    this.input.keyboard!.once("keydown-T", () => this.scene.start("TitleScene"));
  }
}
