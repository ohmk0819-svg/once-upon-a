import Phaser from "phaser";
import { characters } from "../data/characters";
import { t } from "../data/localization";
import { getPassive } from "../data/passives";
import { getWeapon } from "../data/weapons";
import { SaveSystem } from "../systems/SaveSystem";
import { Language } from "../types/gameTypes";

export class CharacterSelectScene extends Phaser.Scene {
  private selectedIndex = 0;
  private cardOutlines: Phaser.GameObjects.Rectangle[] = [];
  private previewSprites: Phaser.GameObjects.Image[] = [];
  private detailText?: Phaser.GameObjects.Text;
  private devMode = false;
  private language: Language = "en";

  constructor() {
    super("CharacterSelectScene");
  }

  create(): void {
    const save = SaveSystem.load();
    this.language = save.settings?.language ?? "en";
    this.devMode = new URLSearchParams(window.location.search).get("dev") === "1";
    this.selectedIndex = Math.max(0, characters.findIndex((character) => character.id === (save.lastSelectedCharacter ?? save.lastCharacterId)));
    this.cameras.main.setBackgroundColor("#b7ef9b");
    this.add.rectangle(640, 360, 1280, 720, 0xb7ef9b);
    this.add.text(640, 70, t(this.language, "characterSelect"), {
      fontFamily: "Verdana, sans-serif",
      fontSize: "42px",
      color: "#2d4b5b",
      stroke: "#ffffff",
      strokeThickness: 6
    }).setOrigin(0.5);

    const startX = 58;
    for (let i = 0; i < characters.length; i += 1) {
      this.createCharacterCard(startX + i * 306, 140, i);
    }

    this.add.rectangle(640, 590, 1120, 78, 0xfffef2, 0.9).setStrokeStyle(4, 0x6bb7c8);
    this.detailText = this.add.text(640, 590, "", {
      fontFamily: "Verdana, sans-serif",
      fontSize: "15px",
      color: "#2d4b5b",
      align: "center",
      lineSpacing: 6,
      wordWrap: { width: 1060 }
    }).setOrigin(0.5);

    this.add.text(640, 650, `${t(this.language, "selectControls")}     ${t(this.language, "quickPick")}     ${t(this.language, "enterStart")}`, {
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
    ["ONE", "TWO", "THREE", "FOUR"].forEach((key, index) => {
      this.input.keyboard!.on(`keydown-${key}`, () => {
        this.selectedIndex = index;
        this.refreshSelection();
        this.startGame();
      });
    });
    this.refreshSelection();
  }

  private createCharacterCard(x: number, y: number, index: number): void {
    const character = characters[index];
    const unlocked = this.isCharacterUnlocked(character.id);
    this.add.rectangle(x + 138, y + 210, 276, 420, 0xfffef2, 0.94).setStrokeStyle(5, 0x6bb7c8);
    const outline = this.add.rectangle(x + 138, y + 210, 276, 420, 0xffffff, 0).setStrokeStyle(0, 0xfff176);
    this.cardOutlines[index] = outline;

    this.add.text(x + 138, y + 24, `${index + 1}. ${character.name[this.language]}`, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "23px",
      color: "#2d4b5b",
      align: "center",
      wordWrap: { width: 230 }
    }).setOrigin(0.5, 0);
    this.add.text(x + 138, y + 60, character.name[this.language === "en" ? "ko" : "en"], {
      fontFamily: "Verdana, sans-serif",
      fontSize: "15px",
      color: "#4f6d7a",
      align: "center",
      wordWrap: { width: 230 }
    }).setOrigin(0.5, 0);

    const sprite = this.add.image(x + 138, y + 140, this.getTextureFor(character.visualType)).setScale(1.8);
    this.previewSprites[index] = sprite;
    this.add.rectangle(x + 138, y + 218, 86, 20, character.color, 0.85).setStrokeStyle(3, 0xffffff);

    this.add.text(x + 138, y + 250, character.description[this.language], {
      fontFamily: "Verdana, sans-serif",
      fontSize: "15px",
      color: "#406578",
      align: "center",
      wordWrap: { width: 230 }
    }).setOrigin(0.5, 0);
    this.add.text(x + 138, y + 350, `${t(this.language, "difficulty")}: ${this.formatDifficulty(character.difficulty)}`, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "16px",
      color: character.difficulty === "easy" ? "#2e7d32" : "#ad5f00",
      stroke: "#ffffff",
      strokeThickness: 3
    }).setOrigin(0.5);
    this.add.text(x + 138, y + 380, `${t(this.language, "base")}: ${getWeapon(character.baseWeaponId).name[this.language]}\n${t(this.language, "passive")}: ${getPassive(character.passiveId).name[this.language]}`, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "13px",
      color: "#4f6d7a",
      align: "center",
      wordWrap: { width: 230 }
    }).setOrigin(0.5, 0);

    if (!unlocked) {
      this.add.rectangle(x + 138, y + 210, 276, 420, 0x243a4a, 0.46);
      this.add.text(x + 138, y + 214, `${t(this.language, "locked")}\n${this.getCharacterUnlockText(character.id)}`, {
        fontFamily: "Verdana, sans-serif",
        fontSize: "18px",
        color: "#ffffff",
        align: "center",
        stroke: "#2d4b5b",
        strokeThickness: 4,
        wordWrap: { width: 220 }
      }).setOrigin(0.5);
    }

    this.add.rectangle(x + 138, y + 210, 276, 420, 0xffffff, 0)
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
    this.selectedIndex = Phaser.Math.Wrap(this.selectedIndex + direction, 0, characters.length);
    this.refreshSelection();
  }

  private refreshSelection(): void {
    this.cardOutlines.forEach((outline, index) => {
      outline.setStrokeStyle(index === this.selectedIndex ? 6 : 0, 0xfff176, 0.95);
    });
    this.previewSprites.forEach((sprite, index) => {
      sprite.setScale(index === this.selectedIndex ? 2.05 : 1.8);
    });
    this.refreshDetailPanel();
  }

  private startGame(): void {
    const character = characters[this.selectedIndex];
    if (!this.isCharacterUnlocked(character.id)) {
      return;
    }
    SaveSystem.setLastCharacter(character.id);
    this.scene.start("StageSelectScene", { characterId: character.id });
  }

  private getTextureFor(visualType: string): string {
    const map: Record<string, string> = {
      roundWoodcutter: "player-woodcutter",
      brightBlueWoodenDoll: "player-pinocchio",
      brightCinderella: "player-cinderella",
      brightMomotaro: "player-momotaro"
    };
    return map[visualType] ?? "player-pinocchio";
  }

  private formatDifficulty(difficulty: string): string {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  }

  private refreshDetailPanel(): void {
    if (!this.detailText) {
      return;
    }
    const character = characters[this.selectedIndex];
    const base = getWeapon(character.baseWeaponId);
    const passive = getPassive(character.passiveId);
    this.detailText.setText(
      `${t(this.language, "base")}: ${base.name[this.language]}   ${t(this.language, "passive")}: ${passive.name[this.language]} - ${this.passiveSummary(character.passiveId)}   ${t(this.language, "ultimate")}: ${this.ultimateName(character.ultimateId)} - ${this.ultimateSummary(character.ultimateId)}\n` +
        `${t(this.language, "hp")} ${character.maxHp} | ${t(this.language, "regen")} ${character.hpRegenPerSecond}/s | ${t(this.language, "speed")} ${character.moveSpeed.toFixed(2)} | ${t(this.language, "crit")} ${Math.round(character.critChance * 100)}%`
    );
  }

  private passiveSummary(passiveId: string): string {
    const summaries: Record<string, string> = {
      honestHands: "Catch axes to gain speed and damage.",
      growingWoodenHeart: "Gains attack speed every level.",
      midnightFootwork: "Moving and dashing empower her attacks.",
      oniIslandBanner: "Defeated enemies may return as allies."
    };
    if (this.language === "ko") {
      const koSummaries: Record<string, string> = {
        honestHands: "도끼를 받아 속도와 공격력을 얻습니다.",
        growingWoodenHeart: "레벨업할수록 공격 속도가 오릅니다.",
        midnightFootwork: "이동과 대시가 공격을 강화합니다.",
        oniIslandBanner: "쓰러진 적이 아군으로 돌아올 수 있습니다."
      };
      return koSummaries[passiveId] ?? "동화 속 패시브 능력입니다.";
    }
    return summaries[passiveId] ?? "A storybook passive skill.";
  }

  private ultimateName(ultimateId: string): string {
    const names: Record<string, string> = {
      honestAxeStorm: "Honest Axe Storm",
      realBoyMight: "Real Boy Might",
      pumpkinCarriageParade: "Pumpkin Carriage Parade",
      oniIslandExpedition: "Oni Island Expedition"
    };
    if (this.language === "ko") {
      const koNames: Record<string, string> = {
        honestAxeStorm: "정직한 도끼 폭풍",
        realBoyMight: "진짜 소년의 힘",
        pumpkinCarriageParade: "호박 마차 행진",
        oniIslandExpedition: "도깨비섬 원정"
      };
      return koNames[ultimateId] ?? "궁극기";
    }
    return names[ultimateId] ?? "Ultimate";
  }

  private ultimateSummary(ultimateId: string): string {
    const summaries: Record<string, string> = {
      honestAxeStorm: "Throws a storm of axes forward.",
      realBoyMight: "Becomes powerful and briefly invulnerable.",
      pumpkinCarriageParade: "Carriages sweep across the screen.",
      oniIslandExpedition: "Momotaro and companions power up together."
    };
    if (this.language === "ko") {
      const koSummaries: Record<string, string> = {
        honestAxeStorm: "앞으로 도끼 폭풍을 던집니다.",
        realBoyMight: "잠시 강해지고 무적이 됩니다.",
        pumpkinCarriageParade: "마차가 화면을 가로지릅니다.",
        oniIslandExpedition: "모모타로와 동료들이 함께 강화됩니다."
      };
      return koSummaries[ultimateId] ?? "강력한 동화 기술입니다.";
    }
    return summaries[ultimateId] ?? "A powerful storybook skill.";
  }

  private isCharacterUnlocked(characterId: string): boolean {
    return this.devMode || (SaveSystem.load().unlockedCharacters ?? ["pinocchio", "woodcutter"]).includes(characterId);
  }

  private getCharacterUnlockText(characterId: string): string {
    if (this.language === "ko") {
      if (characterId === "cinderella") {
        return "스테이지 1을 클리어하면 해금됩니다.";
      }
      if (characterId === "momotaro") {
        return "스테이지 2를 클리어하면 해금됩니다.";
      }
      return "이야기를 더 진행하세요.";
    }
    if (characterId === "cinderella") {
      return "Clear Stage 1 to unlock.";
    }
    if (characterId === "momotaro") {
      return "Clear Stage 2 to unlock.";
    }
    return "Keep reading the story.";
  }
}
