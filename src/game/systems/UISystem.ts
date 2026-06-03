import Phaser from "phaser";
import { t } from "../data/localization";
import { getPassive } from "../data/passives";
import { getWeapon } from "../data/weapons";
import { Boss } from "../entities/Boss";
import { Player } from "../entities/Player";
import { LevelSystem } from "./LevelSystem";
import { SaveSystem } from "./SaveSystem";
import { AimMode, Language, PassiveState, StageData, WeaponState } from "../types/gameTypes";
import { formatTime } from "../utils/math";

export class UISystem {
  private root: Phaser.GameObjects.Group;
  private hudText: Phaser.GameObjects.Text;
  private bars: Phaser.GameObjects.Graphics;
  private itemText: Phaser.GameObjects.Text;
  private bossText: Phaser.GameObjects.Text;
  private slotLabels: Phaser.GameObjects.Text[] = [];
  private slotSignature = "";

  constructor(private scene: Phaser.Scene) {
    this.root = scene.add.group();
    this.bars = scene.add.graphics().setDepth(100);
    this.hudText = scene.add.text(18, 14, "", {
      fontFamily: "Verdana, sans-serif",
      fontSize: "18px",
      color: "#2d4b5b",
      stroke: "#ffffff",
      strokeThickness: 4
    }).setDepth(101);
    this.itemText = scene.add.text(18, 196, "", {
      fontFamily: "Verdana, sans-serif",
      fontSize: "13px",
      color: "#2d4b5b",
      stroke: "#ffffff",
      strokeThickness: 3
    }).setDepth(101);
    this.bossText = scene.add.text(640, 20, "", {
      fontFamily: "Verdana, sans-serif",
      fontSize: "18px",
      color: "#633f49",
      stroke: "#ffffff",
      strokeThickness: 4,
      align: "center"
    }).setOrigin(0.5, 0).setDepth(101);
    this.root.addMultiple([this.bars, this.hudText, this.itemText, this.bossText]);
    for (const child of this.root.getChildren()) {
      (child as Phaser.GameObjects.GameObject & { setScrollFactor?: (x: number, y?: number) => void }).setScrollFactor?.(0);
    }
  }

  update(
    player: Player,
    levelSystem: LevelSystem,
    elapsedSeconds: number,
    weaponStates: WeaponState[],
    passiveStates: PassiveState[],
    aimMode: AimMode,
    boss?: Boss,
    stage?: StageData,
    devMode = false,
    bossTimeSeconds = 900
  ): void {
    const language = SaveSystem.load().settings?.language ?? "en";
    const gameplayTime = elapsedSeconds * 1000;
    this.bars.clear();
    this.drawPanel(10, 10, 470, 172);
    this.drawBar(24, 82, 215, 16, player.hp / player.stats.maxHp, 0xff6f91, 0xffffff);
    this.drawBar(24, 110, 215, 12, levelSystem.exp / levelSystem.requiredExp, 0x4dd0e1, 0xffffff);

    const dashRatio = player.getDashCooldownRatio(gameplayTime);
    const dashText = !player.dashUnlocked
      ? `${t(language, "fairyDash")}: ${t(language, "unlocksAt")} Lv7`
      : dashRatio <= 0
        ? `${t(language, "fairyDash")} ${t(language, "ready")}`
        : `${t(language, "fairyDash")} ${Math.ceil(dashRatio * 6)}s`;
    const ultimateRatio = player.getUltimateCooldownRatio(gameplayTime);
    const ultText = ultimateRatio <= 0 ? t(language, "ready") : `${Math.ceil(ultimateRatio * 90)}s`;
    const bossLine = boss && boss.active ? `${t(language, "boss")}: ${boss.bossDef.name[language]}` : `${t(language, "bossIn")} ${formatTime(Math.max(0, bossTimeSeconds - elapsedSeconds))}`;
    this.hudText.setText(
      `${t(language, "character")}: ${player.character.name[language]}${devMode ? `   ${t(language, "devMode")}` : ""}\n` +
        `${t(language, "stage")}: ${stage?.name[language] ?? "Topsy-Turvy Storybook Forest"}\n` +
        `${t(language, "hp")} ${Math.ceil(player.hp)}/${player.stats.maxHp}   Lv ${levelSystem.level}\n` +
        `${t(language, "exp")}                         ${t(language, "time")} ${formatTime(elapsedSeconds)}\n` +
        `${t(language, "aim")}: ${aimMode === "auto" ? t(language, "auto") : t(language, "cursor")}   ${bossLine}\n` +
        `${dashText}   ${t(language, "ultimateCooldown")} ${ultText}   ${t(language, "regen")} ${player.stats.hpRegenPerSecond.toFixed(1)}/s`
    );

    this.drawLoadoutSlots(weaponStates, passiveStates, language);

    if (boss && boss.active) {
      this.bossText.setText(`${boss.bossDef.name[language]}`);
      this.drawPanel(380, 48, 500, 24);
      this.drawBar(394, 56, 472, 10, boss.hp / boss.maxHp, 0xff8a65, 0xffffff);
    } else {
      this.bossText.setText("");
    }
  }

  private drawPanel(x: number, y: number, width: number, height: number): void {
    this.bars.fillStyle(0xfffef2, 0.84);
    this.bars.lineStyle(3, 0x6bb7c8, 0.9);
    this.bars.fillRoundedRect(x, y, width, height, 8);
    this.bars.strokeRoundedRect(x, y, width, height, 8);
  }

  private drawBar(x: number, y: number, width: number, height: number, ratio: number, color: number, bgColor: number): void {
    const safeRatio = Phaser.Math.Clamp(ratio, 0, 1);
    this.bars.fillStyle(bgColor, 0.95);
    this.bars.fillRoundedRect(x, y, width, height, 5);
    this.bars.fillStyle(color, 0.95);
    this.bars.fillRoundedRect(x, y, width * safeRatio, height, 5);
    this.bars.lineStyle(2, 0x37556b, 0.45);
    this.bars.strokeRoundedRect(x, y, width, height, 5);
  }

  private drawLoadoutSlots(weaponStates: WeaponState[], passiveStates: PassiveState[], language: Language): void {
    const weaponSlots = weaponStates.map((state) => {
      const weapon = getWeapon(state.id);
      return {
        label: weapon.iconKey,
        level: state.level,
        status: weapon.combo ? "Combo" : weapon.evolved ? "EVO" : `Lv.${state.level}`,
        color: weapon.evolved ? 0xfff176 : weapon.combo ? 0xffab91 : 0x80deea
      };
    });
    const passiveSlots = passiveStates.map((state) => ({ label: getPassive(state.id).iconKey, level: state.level, color: 0xffcc80 }));
    const weaponCountText = `${t(language, "weapons")} ${weaponStates.length}/6${weaponStates.length >= 6 ? ` ${t(language, "max")}` : ""}`;
    const passiveCountText = `${t(language, "passives")} ${passiveStates.length}/6${passiveStates.length >= 6 ? ` ${t(language, "max")}` : ""}`;
    const signature = JSON.stringify({ weaponSlots, passiveSlots, weaponCountText, passiveCountText });

    this.drawPanel(10, 190, 500, 138);
    this.itemText.setText(`${weaponCountText}\n\n\n${passiveCountText}`);

    weaponSlots.forEach((slot, index) => this.drawSlotBox(84 + index * 68, 204, slot.color));
    passiveSlots.forEach((slot, index) => this.drawSlotBox(84 + index * 68, 272, slot.color));

    if (signature === this.slotSignature) {
      return;
    }
    this.slotSignature = signature;
    for (const label of this.slotLabels) {
      label.destroy();
    }
    this.slotLabels = [];

    weaponSlots.forEach((slot, index) => this.createSlotLabel(84 + index * 68, 204, slot.label, slot.status));
    passiveSlots.forEach((slot, index) => this.createSlotLabel(84 + index * 68, 272, slot.label, `Lv.${slot.level}`));
  }

  private drawSlotBox(x: number, y: number, color: number): void {
    this.bars.fillStyle(color, 0.82);
    this.bars.lineStyle(3, 0xffffff, 0.9);
    this.bars.fillRoundedRect(x, y, 58, 48, 7);
    this.bars.strokeRoundedRect(x, y, 58, 48, 7);
  }

  private createSlotLabel(x: number, y: number, label: string, status: string): void {
    const text = this.scene.add.text(x + 29, y + 24, `${label}\n${status}`, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "11px",
      color: "#2d4b5b",
      align: "center",
      stroke: "#ffffff",
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(101).setScrollFactor(0);
    this.slotLabels.push(text);
  }
}
