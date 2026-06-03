import Phaser from "phaser";
import { t } from "../data/localization";
import { SaveSystem } from "../systems/SaveSystem";
import { AimMode, Language } from "../types/gameTypes";

export class SettingsScene extends Phaser.Scene {
  private resetArmed = false;

  constructor() {
    super("SettingsScene");
  }

  create(): void {
    this.render();
  }

  private render(): void {
    this.children.removeAll();
    const save = SaveSystem.load();
    const settings = save.settings!;
    const language = settings.language;
    this.cameras.main.setBackgroundColor("#cfe7ff");
    this.add.rectangle(640, 360, 1280, 720, 0xcfe7ff);
    this.add.text(640, 64, t(language, "settings"), {
      fontFamily: "Verdana, sans-serif",
      fontSize: "38px",
      color: "#2d4b5b",
      stroke: "#ffffff",
      strokeThickness: 5
    }).setOrigin(0.5);

    const rows: Array<[string, string, () => void]> = [
      [t(language, "language"), settings.language === "en" ? t(language, "english") : t(language, "korean"), () => this.updateSetting({ language: settings.language === "en" ? "ko" : "en" })],
      [t(language, "volumeMaster"), `${Math.round(settings.masterVolume * 100)}%`, () => this.updateSetting({ masterVolume: this.nextVolume(settings.masterVolume) })],
      [t(language, "volumeBgm"), `${Math.round(settings.bgmVolume * 100)}%`, () => this.updateSetting({ bgmVolume: this.nextVolume(settings.bgmVolume) })],
      [t(language, "volumeSfx"), `${Math.round(settings.sfxVolume * 100)}%`, () => this.updateSetting({ sfxVolume: this.nextVolume(settings.sfxVolume) })],
      [t(language, "screenShake"), settings.screenShake ? t(language, "on") : t(language, "off"), () => this.updateSetting({ screenShake: !settings.screenShake })],
      [t(language, "aimModeDefault"), settings.defaultAimMode === "auto" ? t(language, "auto") : t(language, "cursor"), () => this.updateSetting({ defaultAimMode: (settings.defaultAimMode === "auto" ? "cursor" : "auto") as AimMode })],
      [t(language, "damageNumbers"), settings.damageNumbers ? t(language, "on") : t(language, "off"), () => this.updateSetting({ damageNumbers: !settings.damageNumbers })],
      [t(language, "reducedEffects"), settings.reducedEffects ? t(language, "on") : t(language, "off"), () => this.updateSetting({ reducedEffects: !settings.reducedEffects })],
      [t(language, "tutorial"), save.tutorialSeen ? t(language, "showAgainNextRun") : t(language, "willShow"), () => this.markTutorialUnseen()],
      [t(language, "resetSaveData"), this.resetArmed ? t(language, "confirmReset") : t(language, "pressTwice"), () => this.resetSave()]
    ];

    rows.forEach(([label, value, action], index) => {
      const y = 132 + index * 48;
      const button = this.add.rectangle(640, y, 620, 38, 0xfffef2, 0.94)
        .setStrokeStyle(3, 0x6bb7c8)
        .setInteractive({ useHandCursor: true });
      this.add.text(360, y, label, { fontFamily: "Verdana, sans-serif", fontSize: "18px", color: "#2d4b5b" }).setOrigin(0, 0.5);
      this.add.text(920, y, value, { fontFamily: "Verdana, sans-serif", fontSize: "18px", color: "#4f6d7a" }).setOrigin(1, 0.5);
      button.on("pointerdown", action);
    });

    this.add.text(640, 650, `${t(language, "clickRows")}     ${t(language, "titleShortcut")}`, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "20px",
      color: "#ffffff",
      stroke: "#4f9cab",
      strokeThickness: 5
    }).setOrigin(0.5);
    this.input.keyboard!.once("keydown-ESC", () => this.scene.start("TitleScene"));
    this.input.keyboard!.once("keydown-T", () => this.scene.start("TitleScene"));
  }

  private updateSetting(settings: { language?: Language; masterVolume?: number; bgmVolume?: number; sfxVolume?: number; screenShake?: boolean; defaultAimMode?: AimMode; damageNumbers?: boolean; reducedEffects?: boolean }): void {
    this.resetArmed = false;
    SaveSystem.updateSettings(settings);
    this.render();
  }

  private markTutorialUnseen(): void {
    const save = SaveSystem.load();
    save.tutorialSeen = false;
    SaveSystem.save(save);
    this.render();
  }

  private resetSave(): void {
    if (!this.resetArmed) {
      this.resetArmed = true;
      this.render();
      return;
    }
    SaveSystem.reset();
    this.resetArmed = false;
    this.render();
  }

  private nextVolume(value: number): number {
    return value >= 1 ? 0 : Math.round((value + 0.25) * 100) / 100;
  }
}
