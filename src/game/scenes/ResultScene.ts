import Phaser from "phaser";
import { getCharacter } from "../data/characters";
import { t } from "../data/localization";
import { getStage } from "../data/stages";
import { SaveSystem } from "../systems/SaveSystem";
import { GameMode, Language } from "../types/gameTypes";
import { formatTime } from "../utils/math";

export class ResultScene extends Phaser.Scene {
  constructor() {
    super("ResultScene");
  }

  create(data: {
    characterId?: string;
    stageId?: string;
    clear: boolean;
    survivalTime: number;
    kills: number;
    level: number;
    currencyEarned: number;
    devMode?: boolean;
    mode?: GameMode;
    achievementsUnlocked?: string[];
  }): void {
    const language = SaveSystem.load().settings?.language ?? "en";
    const mode = data.mode ?? "story";
    const title = mode === "bossPractice" ? t(language, "bossPractice") : mode === "freeSurvival" ? t(language, "survivalEnd") : data.clear ? t(language, "clear") : t(language, "gameOver");
    const character = getCharacter(data.characterId ?? "pinocchio");
    const stage = getStage(data.stageId ?? "topsyTurvyStorybookForest");
    this.cameras.main.setBackgroundColor(data.clear ? "#b7ef9b" : "#a9d9ef");
    this.add.rectangle(640, 360, 1280, 720, data.clear ? 0xb7ef9b : 0xa9d9ef);
    this.add.text(640, 96, title, {
      fontFamily: "Georgia, serif",
      fontSize: "64px",
      color: "#2d4b5b",
      stroke: "#fff7d6",
      strokeThickness: 8
    }).setOrigin(0.5);

    const achievements = data.achievementsUnlocked?.length
      ? `${t(language, "achievementsUnlocked")}: ${data.achievementsUnlocked.length}\n${data.achievementsUnlocked.slice(0, 4).join(", ")}`
      : `${t(language, "achievementsUnlocked")}: 0`;
    this.add.text(
      640,
      292,
      `${t(language, "character")}  ${character.name[language]}\n` +
        `${t(language, "stage")}  ${stage.name[language]}\n` +
        `${t(language, "mode")}  ${this.formatMode(mode, language)}\n` +
        `${t(language, "survivalTime")}  ${formatTime(data.survivalTime)}\n` +
        `${t(language, "level")}  ${data.level}    ${t(language, "kills")}  ${data.kills}\n` +
        `${t(language, "bossDefeated")}  ${data.clear ? t(language, "yes") : t(language, "no")}\n` +
        `${t(language, "storyShardsEarned")}  +${data.devMode || mode === "bossPractice" ? 0 : data.currencyEarned}\n` +
        `${achievements}` +
        (data.devMode ? `\n${t(language, "devRunNotSaved")}` : ""),
      {
        fontFamily: "Verdana, sans-serif",
        fontSize: "22px",
        color: "#2d4b5b",
        align: "center",
        lineSpacing: 10
      }
    ).setOrigin(0.5);

    this.add.text(640, 618, `${t(language, "enterRetry")}     T: ${t(language, "mainTitle")}`, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "24px",
      color: "#ffffff",
      stroke: "#4f9cab",
      strokeThickness: 5
    }).setOrigin(0.5);

    this.input.keyboard!.once("keydown-ENTER", () => this.scene.start("GameScene", { characterId: character.id, stageId: stage.id, mode }));
    this.input.keyboard!.once("keydown-T", () => this.scene.start("TitleScene"));
  }

  private formatMode(mode: GameMode, language: Language): string {
    if (mode === "freeSurvival") {
      return t(language, "modeSurvival");
    }
    if (mode === "bossPractice") {
      return t(language, "modeBossPractice");
    }
    return t(language, "modeStory");
  }
}
