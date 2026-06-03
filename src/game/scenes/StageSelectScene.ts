import Phaser from "phaser";
import { getBoss } from "../data/bosses";
import { t } from "../data/localization";
import { stages } from "../data/stages";
import { SaveSystem } from "../systems/SaveSystem";
import { GameMode, Language, StageDifficulty } from "../types/gameTypes";

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
  private mode: GameMode = "story";
  private language: Language = "en";

  constructor() {
    super("StageSelectScene");
  }

  create(data: { characterId?: string; mode?: GameMode }): void {
    this.characterId = data.characterId ?? "pinocchio";
    this.mode = data.mode ?? this.mode ?? "story";
    this.language = SaveSystem.load().settings?.language ?? "en";
    this.devMode = new URLSearchParams(window.location.search).get("dev") === "1";
    this.cameras.main.setBackgroundColor("#b7ef9b");
    this.add.rectangle(640, 360, 1280, 720, 0xb7ef9b);
    this.add.text(640, 54, t(this.language, "stageSelect"), {
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
    this.createModeButtons();

    const startX = 58;
    for (let i = 0; i < stages.length; i += 1) {
      this.createStageCard(startX + i * 306, 126, i);
    }

    this.add.text(640, 650, `${t(this.language, "selectControls")}     ${t(this.language, "quickPick")}     ${t(this.language, "enterStart")}     ${t(this.language, "escCharacters")}`, {
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
    const boss = getBoss(stage.bossId ?? "bigBadWolf");
    const unlocked = this.isStageCardUnlocked(stage.id, stage.bossId ?? "bigBadWolf", index);
    const stats = SaveSystem.load().stageStats?.[stage.id];
    const palette = stage.colorPalette ?? { background: 0xb4ee81, ground: 0x8edb74, accent: 0xc88955 };
    this.add.rectangle(x + 138, y + 232, 276, 464, 0xfffef2, 0.94).setStrokeStyle(5, palette.accent);
    this.add.rectangle(x + 138, y + 116, 236, 112, palette.background, 0.92).setStrokeStyle(4, 0xffffff);
    this.add.circle(x + 74, y + 114, 24, palette.accent, 0.75);
    this.add.circle(x + 202, y + 120, 18, palette.ground, 0.78);
    this.add.rectangle(x + 138, y + 144, 168, 18, palette.ground, 0.7).setRotation(-0.08);
    const outline = this.add.rectangle(x + 138, y + 232, 276, 464, 0xffffff, 0).setStrokeStyle(0, 0xfff176);
    this.cardOutlines[index] = outline;

    this.add.text(x + 138, y + 24, `${index + 1}. ${stage.name[this.language]}`, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "21px",
      color: "#2d4b5b",
      align: "center",
      wordWrap: { width: 230 }
    }).setOrigin(0.5, 0);
    this.add.text(x + 138, y + 190, stage.description[this.language], {
      fontFamily: "Verdana, sans-serif",
      fontSize: "15px",
      color: "#406578",
      align: "center",
      wordWrap: { width: 230 }
    }).setOrigin(0.5, 0);
    this.add.text(x + 138, y + 304, `${t(this.language, "difficulty")}: ${(stage.difficulty ?? "normal").toUpperCase()}`, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "16px",
      color: DIFFICULTY_COLORS[stage.difficulty ?? "normal"],
      stroke: "#ffffff",
      strokeThickness: 3
    }).setOrigin(0.5);
    this.add.text(x + 138, y + 342, `${t(this.language, "boss")}: ${boss.name[this.language]}\n${t(this.language, "normal")} 15:00  ${t(this.language, "dev")} 03:00\n${t(this.language, "best")} ${stats ? Math.floor(stats.bestTime).toString() + "s" : "-"}`,
      {
        fontFamily: "Verdana, sans-serif",
        fontSize: "15px",
        color: "#4f6d7a",
        align: "center",
        lineSpacing: 8
      }
    ).setOrigin(0.5, 0);

    if (!unlocked) {
      this.add.rectangle(x + 138, y + 232, 276, 464, 0x243a4a, 0.46);
      this.add.text(x + 138, y + 232, `${t(this.language, "locked")}\n${this.getUnlockText(index)}`, {
        fontFamily: "Verdana, sans-serif",
        fontSize: "18px",
        color: "#ffffff",
        align: "center",
        stroke: "#2d4b5b",
        strokeThickness: 4,
        wordWrap: { width: 220 }
      }).setOrigin(0.5);
    }

    this.add.rectangle(x + 138, y + 232, 276, 464, 0xffffff, 0)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.selectedIndex = index;
        this.refreshSelection();
        if (unlocked) {
          this.startGame();
        }
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
    const stage = stages[this.selectedIndex];
    if (!this.isStageCardUnlocked(stage.id, stage.bossId ?? "bigBadWolf", this.selectedIndex)) {
      return;
    }
    this.scene.start("GameScene", {
      characterId: this.characterId,
      stageId: stage.id,
      mode: this.mode
    });
  }

  private createModeButtons(): void {
    const modes: Array<{ id: GameMode; label: string }> = [
      { id: "story", label: t(this.language, "modeStory") },
      { id: "freeSurvival", label: t(this.language, "modeSurvival") },
      { id: "bossPractice", label: t(this.language, "modeBossPractice") }
    ];
    modes.forEach((mode, index) => {
      const x = 460 + index * 180;
      const button = this.add.rectangle(x, 96, 160, 34, this.mode === mode.id ? 0xfff176 : 0xfffef2, 0.95)
        .setStrokeStyle(3, 0x6bb7c8)
        .setInteractive({ useHandCursor: true });
      this.add.text(x, 96, mode.label, { fontFamily: "Verdana, sans-serif", fontSize: "15px", color: "#2d4b5b" }).setOrigin(0.5);
      button.on("pointerdown", () => {
        this.scene.restart({ characterId: this.characterId, mode: mode.id });
      });
    });
  }

  private isStageCardUnlocked(stageId: string, bossId: string, index: number): boolean {
    if (this.devMode) {
      return true;
    }
    const save = SaveSystem.load();
    if (this.mode === "bossPractice") {
      return save.clearedBosses.includes(bossId);
    }
    return (save.unlockedStages ?? ["topsyTurvyStorybookForest"]).includes(stageId) || index === 0;
  }

  private getUnlockText(index: number): string {
    if (this.mode === "bossPractice") {
      return this.language === "ko" ? "스토리 모드에서 이 보스를 쓰러뜨리면 연습할 수 있습니다." : "Defeat this boss in Story Mode to practice.";
    }
    if (this.language === "ko") {
      return index === 1
        ? "뒤섞인 동화의 숲을 클리어하면 해금됩니다."
        : index === 2
          ? "과자 오두막 축제를 클리어하면 해금됩니다."
          : "자정의 궁전을 클리어하면 해금됩니다.";
    }
    return index === 1
      ? "Clear Topsy-Turvy Storybook Forest to unlock."
      : index === 2
        ? "Clear Candy Cottage Carnival to unlock."
        : "Clear Midnight Palace to unlock.";
  }
}
