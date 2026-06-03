import Phaser from "phaser";
import { achievements } from "../data/achievements";
import { t } from "../data/localization";
import { SaveSystem } from "../systems/SaveSystem";

export class AchievementsScene extends Phaser.Scene {
  constructor() {
    super("AchievementsScene");
  }

  create(): void {
    const save = SaveSystem.load();
    const language = save.settings?.language ?? "en";
    const unlocked = new Set(save.unlockedAchievements ?? []);
    this.cameras.main.setBackgroundColor("#ffd3e2");
    this.add.rectangle(640, 360, 1280, 720, 0xffd3e2);
    this.add.text(640, 42, `${t(language, "achievements")} ${unlocked.size}/${achievements.length}`, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "36px",
      color: "#2d4b5b",
      stroke: "#ffffff",
      strokeThickness: 5
    }).setOrigin(0.5);

    achievements.forEach((achievement, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 74 + col * 580;
      const y = 84 + row * 30;
      const done = unlocked.has(achievement.id);
      this.add.rectangle(x + 270, y + 14, 540, 26, done ? 0xfffef2 : 0xe9d7df, 0.94)
        .setStrokeStyle(2, done ? 0x6bb7c8 : 0xcaaab6);
      this.add.text(x + 10, y + 5, `${done ? t(language, "done") : t(language, "locked")} ${achievement.name[language]}`, {
        fontFamily: "Verdana, sans-serif",
        fontSize: "13px",
        color: "#2d4b5b"
      });
      this.add.text(x + 330, y + 5, `+${achievement.rewardCurrency}`, {
        fontFamily: "Verdana, sans-serif",
        fontSize: "13px",
        color: "#7e57c2"
      });
    });

    this.add.text(640, 682, t(language, "titleShortcut"), {
      fontFamily: "Verdana, sans-serif",
      fontSize: "20px",
      color: "#ffffff",
      stroke: "#4f9cab",
      strokeThickness: 5
    }).setOrigin(0.5);
    this.input.keyboard!.once("keydown-ESC", () => this.scene.start("TitleScene"));
    this.input.keyboard!.once("keydown-T", () => this.scene.start("TitleScene"));
  }
}
