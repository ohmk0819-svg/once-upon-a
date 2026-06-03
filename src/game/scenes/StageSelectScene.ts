import Phaser from "phaser";
import { stages } from "../data/stages";
import { SaveSystem } from "../systems/SaveSystem";
import { StageDifficulty } from "../types/gameTypes";

const DIFFICULTY_COLORS: Record<StageDifficulty, string> = {
  easy: "#2e7d32",
  normal: "#0277bd",
  hard: "#8e24aa",
  expert: "#c62828"
};

export class StageSelectScene extends Phaser.Scene {
  private selectedIndex = 0;
  private cardOutlines: Phaser.GameObjects.Rectangle[] = [];
  private characterId = "pinocchio";
  private devMode = false;

  constructor() {
    super("StageSelectScene");
  }

  create(data: { characterId?: string }): void {
    this.characterId = data.characterId ?? "pinocchio";
    this.devMode = new URLSearchParams(window.location.search).get("dev") === "1";
    this.cameras.main.setBackgroundColor("#b7ef9b");
    this.add.rectangle(640, 360, 1280, 720, 0xb7ef9b);
    this.add.text(640, 54, "Stage Select", {
      fontFamily: "Verdana, sans-serif",
      fontSize: "42px",
      color: "#2d4b5b",
      stroke: "#ffffff",
      strokeThickness: 6
    }).setOrigin(0.5);
    if (this.devMode) {
      this.add.text(1114, 36, "DEV MODE", {
        fontFamily: "Verdana, sans-serif",
        fontSize: "20px",
        color: "#c62828",
        stroke: "#ffffff",
        strokeThickness: 4
      }).setOrigin(0.5);
    }

    const startX = 58;
    for (let i = 0; i < stages.length; i += 1) {
      this.createStageCard(startX + i * 306, 126, i);
    }

    this.add.text(640, 650, "A/D or Arrows: Select     1-4: Quick Pick     Enter: Start     Esc: Characters", {
      fontFamily: "Verdana, sans-serif",
      fontSize: "20px",
      color: "#ffffff",
      stroke: "#4f9cab",
      strokeThickness: 5
    }).setOrigin(0.5);

    this.input.keyboard!.on("keydown-LEFT", () => this.moveSelection(-1));
    this.input.keyboard!.on("keydown-A", () => this.moveSelection(-1));
    this.input.keyboard!.on("keydown-RIGHT", () => this.moveSelection(1));
    this.input.keyboard!.on("keydown-D", () => this.moveSelection(1));
    this.input.keyboard!.on("keydown-ENTER", () => this.startGame());
    this.input.keyboard!.on("keydown-ESC", () => this.scene.start("CharacterSelectScene"));
    ["ONE", "TWO", "THREE", "FOUR"].forEach((key, index) => {
      this.input.keyboard!.on(`keydown-${key}`, () => {
        this.selectedIndex = index;
        this.refreshSelection();
        this.startGame();
      });
    });
    this.refreshSelection();
  }

  private createStageCard(x: number, y: number, index: number): void {
    const stage = stages[index];
    const stats = SaveSystem.load().stageStats?.[stage.id];
    const palette = stage.colorPalette ?? { background: 0xb4ee81, ground: 0x8edb74, accent: 0xc88955 };
    this.add.rectangle(x + 138, y + 232, 276, 464, 0xfffef2, 0.94).setStrokeStyle(5, palette.accent);
    this.add.rectangle(x + 138, y + 116, 236, 112, palette.background, 0.92).setStrokeStyle(4, 0xffffff);
    this.add.circle(x + 74, y + 114, 24, palette.accent, 0.75);
    this.add.circle(x + 202, y + 120, 18, palette.ground, 0.78);
    this.add.rectangle(x + 138, y + 144, 168, 18, palette.ground, 0.7).setRotation(-0.08);
    const outline = this.add.rectangle(x + 138, y + 232, 276, 464, 0xffffff, 0).setStrokeStyle(0, 0xfff176);
    this.cardOutlines[index] = outline;

    this.add.text(x + 138, y + 24, `${index + 1}. ${stage.name.en}`, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "21px",
      color: "#2d4b5b",
      align: "center",
      wordWrap: { width: 230 }
    }).setOrigin(0.5, 0);
    this.add.text(x + 138, y + 190, stage.description?.en ?? "", {
      fontFamily: "Verdana, sans-serif",
      fontSize: "15px",
      color: "#406578",
      align: "center",
      wordWrap: { width: 230 }
    }).setOrigin(0.5, 0);
    this.add.text(x + 138, y + 304, `Difficulty: ${(stage.difficulty ?? "normal").toUpperCase()}`, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "16px",
      color: DIFFICULTY_COLORS[stage.difficulty ?? "normal"],
      stroke: "#ffffff",
      strokeThickness: 3
    }).setOrigin(0.5);
    this.add.text(x + 138, y + 342, `Boss: ${stage.bossId ?? "bigBadWolf"}\nNormal 15:00  Dev 03:00\nBest ${stats ? Math.floor(stats.bestTime).toString() + "s" : "-"}`,
      {
        fontFamily: "Verdana, sans-serif",
        fontSize: "15px",
        color: "#4f6d7a",
        align: "center",
        lineSpacing: 8
      }
    ).setOrigin(0.5, 0);

    this.add.rectangle(x + 138, y + 232, 276, 464, 0xffffff, 0)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.selectedIndex = index;
        this.refreshSelection();
        this.startGame();
      })
      .on("pointerover", () => {
        this.selectedIndex = index;
        this.refreshSelection();
      });
  }

  private moveSelection(direction: number): void {
    this.selectedIndex = Phaser.Math.Wrap(this.selectedIndex + direction, 0, stages.length);
    this.refreshSelection();
  }

  private refreshSelection(): void {
    this.cardOutlines.forEach((outline, index) => {
      outline.setStrokeStyle(index === this.selectedIndex ? 6 : 0, 0xfff176, 0.95);
    });
  }

  private startGame(): void {
    this.scene.start("GameScene", {
      characterId: this.characterId,
      stageId: stages[this.selectedIndex].id
    });
  }
}
