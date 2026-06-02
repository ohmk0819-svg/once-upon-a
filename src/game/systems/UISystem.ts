import Phaser from "phaser";
import { getPassive } from "../data/passives";
import { getWeapon } from "../data/weapons";
import { Boss } from "../entities/Boss";
import { Player } from "../entities/Player";
import { LevelSystem } from "./LevelSystem";
import { PassiveState, WeaponState } from "../types/gameTypes";
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
    this.itemText = scene.add.text(18, 150, "", {
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
    boss?: Boss
  ): void {
    this.bars.clear();
    this.drawPanel(10, 10, 356, 126);
    this.drawBar(24, 42, 215, 16, player.hp / player.stats.maxHp, 0xff6f91, 0xffffff);
    this.drawBar(24, 70, 215, 12, levelSystem.exp / levelSystem.requiredExp, 0x4dd0e1, 0xffffff);

    const dashText = player.dashUnlocked ? `${Math.ceil(player.getDashCooldownRatio(this.scene.time.now) * 6)}s` : "Lv7";
    const ultText = player.getUltimateCooldownRatio(this.scene.time.now) <= 0 ? "Ready" : `${Math.ceil(player.getUltimateCooldownRatio(this.scene.time.now) * 90)}s`;
    this.hudText.setText(
      `HP ${Math.ceil(player.hp)}/${player.stats.maxHp}   Lv ${levelSystem.level}\n` +
        `EXP                         Time ${formatTime(elapsedSeconds)}\n` +
        `Fairy Dash ${dashText}   Ultimate ${ultText}   Regen ${player.stats.hpRegenPerSecond.toFixed(1)}/s`
    );

    this.drawLoadoutSlots(weaponStates, passiveStates);

    if (boss && boss.active) {
      this.bossText.setText(`${boss.bossDef.name.en}`);
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

  private drawLoadoutSlots(weaponStates: WeaponState[], passiveStates: PassiveState[]): void {
    const weaponSlots = weaponStates.map((state) => ({ label: getWeapon(state.id).iconKey, level: state.level, color: 0x80deea }));
    const passiveSlots = passiveStates.map((state) => ({ label: getPassive(state.id).iconKey, level: state.level, color: 0xffcc80 }));
    const signature = JSON.stringify({ weaponSlots, passiveSlots });

    this.drawPanel(10, 144, 458, 138);
    this.itemText.setText("Weapons\n\n\nPassives");

    weaponSlots.forEach((slot, index) => this.drawSlotBox(84 + index * 68, 158, slot.color));
    passiveSlots.forEach((slot, index) => this.drawSlotBox(84 + index * 68, 226, slot.color));

    if (signature === this.slotSignature) {
      return;
    }
    this.slotSignature = signature;
    for (const label of this.slotLabels) {
      label.destroy();
    }
    this.slotLabels = [];

    weaponSlots.forEach((slot, index) => this.createSlotLabel(84 + index * 68, 158, slot.label, slot.level));
    passiveSlots.forEach((slot, index) => this.createSlotLabel(84 + index * 68, 226, slot.label, slot.level));
  }

  private drawSlotBox(x: number, y: number, color: number): void {
    this.bars.fillStyle(color, 0.82);
    this.bars.lineStyle(3, 0xffffff, 0.9);
    this.bars.fillRoundedRect(x, y, 58, 48, 7);
    this.bars.strokeRoundedRect(x, y, 58, 48, 7);
  }

  private createSlotLabel(x: number, y: number, label: string, level: number): void {
    const text = this.scene.add.text(x + 29, y + 24, `${label}\nLv.${level}`, {
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
