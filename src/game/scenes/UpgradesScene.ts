import Phaser from "phaser";
import { t } from "../data/localization";
import { metaUpgrades, getMetaUpgradeCost } from "../data/metaUpgrades";
import { SaveSystem } from "../systems/SaveSystem";

export class UpgradesScene extends Phaser.Scene {
  constructor() {
    super("UpgradesScene");
  }

  create(): void {
    this.render();
  }

  private render(): void {
    this.children.removeAll();
    const save = SaveSystem.load();
    const language = save.settings?.language ?? "en";
    this.cameras.main.setBackgroundColor("#b7ef9b");
    this.add.rectangle(640, 360, 1280, 720, 0xb7ef9b);
    this.add.text(640, 46, `${t(language, "upgrades")}   ${t(language, "storyShards")}: ${save.currency}`, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "34px",
      color: "#2d4b5b",
      stroke: "#ffffff",
      strokeThickness: 5
    }).setOrigin(0.5);

    metaUpgrades.forEach((upgrade, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 84 + col * 570;
      const y = 96 + row * 58;
      const level = save.metaUpgrades?.[upgrade.id] ?? 0;
      const maxed = level >= upgrade.maxLevel;
      const cost = getMetaUpgradeCost(upgrade, level);
      this.add.rectangle(x + 270, y + 24, 540, 50, 0xfffef2, 0.93).setStrokeStyle(3, maxed ? 0xfff176 : 0x6bb7c8);
      this.add.text(x + 12, y + 9, `${upgrade.name[language]} ${level}/${upgrade.maxLevel}${maxed ? ` ${t(language, "max")}` : ""}`, {
        fontFamily: "Verdana, sans-serif",
        fontSize: "16px",
        color: "#2d4b5b"
      });
      this.add.text(x + 12, y + 31, upgrade.description[language], {
        fontFamily: "Verdana, sans-serif",
        fontSize: "12px",
        color: "#406578"
      });
      const button = this.add.rectangle(x + 464, y + 24, 110, 34, maxed ? 0xcfd8dc : 0x80deea, 0.95)
        .setStrokeStyle(2, 0xffffff);
      this.add.text(x + 464, y + 24, maxed ? t(language, "done") : `${cost}`, {
        fontFamily: "Verdana, sans-serif",
        fontSize: "15px",
        color: "#2d4b5b",
        stroke: "#ffffff",
        strokeThickness: 2
      }).setOrigin(0.5);
      if (!maxed) {
        button.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
          SaveSystem.buyMetaUpgrade(upgrade.id, cost);
          this.render();
        });
      }
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
