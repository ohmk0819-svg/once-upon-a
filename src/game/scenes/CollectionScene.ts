import Phaser from "phaser";
import { bosses } from "../data/bosses";
import { characters } from "../data/characters";
import { enemies } from "../data/enemies";
import { evolutions } from "../data/evolutions";
import { t } from "../data/localization";
import { passives } from "../data/passives";
import { stages } from "../data/stages";
import { weapons } from "../data/weapons";
import { SaveSystem } from "../systems/SaveSystem";
import { Language } from "../types/gameTypes";

const TABS = ["Characters", "Stages", "Bosses", "Weapons", "Passives", "Evolutions", "Enemies"];

export class CollectionScene extends Phaser.Scene {
  private tabIndex = 0;

  constructor() {
    super("CollectionScene");
  }

  create(): void {
    this.render();
  }

  private render(): void {
    this.children.removeAll();
    const save = SaveSystem.load();
    const language = save.settings?.language ?? "en";
    this.cameras.main.setBackgroundColor("#a9d9ef");
    this.add.rectangle(640, 360, 1280, 720, 0xa9d9ef);
    this.add.text(640, 42, t(language, "collection"), {
      fontFamily: "Verdana, sans-serif",
      fontSize: "36px",
      color: "#2d4b5b",
      stroke: "#ffffff",
      strokeThickness: 5
    }).setOrigin(0.5);

    TABS.forEach((tab, index) => {
      const button = this.add.rectangle(118 + index * 172, 92, 150, 38, index === this.tabIndex ? 0xfff176 : 0xfffef2, 0.95)
        .setStrokeStyle(3, 0x6bb7c8)
        .setInteractive({ useHandCursor: true });
      this.add.text(118 + index * 172, 92, this.getTabLabel(tab, language), { fontFamily: "Verdana, sans-serif", fontSize: "15px", color: "#2d4b5b" }).setOrigin(0.5);
      button.on("pointerdown", () => {
        this.tabIndex = index;
        this.render();
      });
    });

    this.renderItems(save);
    this.add.text(640, 682, `${t(language, "tabsHint")}     ${t(language, "titleShortcut")}`, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "20px",
      color: "#ffffff",
      stroke: "#4f9cab",
      strokeThickness: 5
    }).setOrigin(0.5);
    this.input.keyboard!.once("keydown-ESC", () => this.scene.start("TitleScene"));
    this.input.keyboard!.once("keydown-T", () => this.scene.start("TitleScene"));
    this.input.keyboard!.once("keydown-LEFT", () => {
      this.tabIndex = Phaser.Math.Wrap(this.tabIndex - 1, 0, TABS.length);
      this.render();
    });
    this.input.keyboard!.once("keydown-RIGHT", () => {
      this.tabIndex = Phaser.Math.Wrap(this.tabIndex + 1, 0, TABS.length);
      this.render();
    });
  }

  private renderItems(save: ReturnType<typeof SaveSystem.load>): void {
    const language = save.settings?.language ?? "en";
    const tab = TABS[this.tabIndex];
    const data = this.getTabData(tab, language);
    const discovered = this.getDiscoveredSet(save, tab);
    data.forEach((item, index) => {
      const col = index % 4;
      const row = Math.floor(index / 4);
      const x = 82 + col * 302;
      const y = 132 + row * 86;
      const isKnown = discovered.has(item.id);
      this.add.rectangle(x + 140, y + 36, 280, 72, isKnown ? 0xfffef2 : 0xe0e7ef, 0.94)
        .setStrokeStyle(3, isKnown ? 0x6bb7c8 : 0x9aa7b0);
      this.add.text(x + 16, y + 10, isKnown ? item.name : t(language, "unknown"), {
        fontFamily: "Verdana, sans-serif",
        fontSize: "16px",
        color: "#2d4b5b",
        wordWrap: { width: 240 }
      });
      this.add.text(x + 16, y + 34, isKnown ? item.description : item.hint, {
        fontFamily: "Verdana, sans-serif",
        fontSize: "12px",
        color: "#406578",
        wordWrap: { width: 245 }
      });
    });
  }

  private getTabData(tab: string, language: Language): Array<{ id: string; name: string; description: string; hint: string }> {
    if (tab === "Characters") return characters.map((item) => ({ id: item.id, name: item.name[language], description: item.description[language], hint: language === "ko" ? "이 캐릭터를 선택하면 공개됩니다." : "Choose this character to reveal their page." }));
    if (tab === "Stages") return stages.map((item) => ({ id: item.id, name: item.name[language], description: item.description[language], hint: language === "ko" ? "이 스테이지에 입장하면 공개됩니다." : "Enter this stage to reveal its page." }));
    if (tab === "Bosses") return bosses.map((item) => ({ id: item.id, name: item.name[language], description: language === "ko" ? "보스 패턴 기록됨." : "Boss patterns recorded.", hint: language === "ko" ? "이 보스를 쓰러뜨리면 공개됩니다." : "Defeat this boss to reveal its page." }));
    if (tab === "Weapons") return weapons.map((item) => ({ id: item.id, name: item.name[language], description: item.role[language], hint: language === "ko" ? "레벨업에서 이 무기를 찾으세요." : "Find this weapon in a level-up." }));
    if (tab === "Passives") return passives.map((item) => ({ id: item.id, name: item.name[language], description: item.levels[0].description[language], hint: language === "ko" ? "레벨업에서 이 패시브를 찾으세요." : "Find this passive in a level-up." }));
    if (tab === "Enemies") return enemies.map((item) => ({ id: item.id, name: item.name[language], description: `${t(language, "hp")} ${item.hp} / Damage ${item.damage}`, hint: language === "ko" ? "이 적을 만나면 공개됩니다." : "Encounter this enemy to reveal it." }));
    return evolutions.map((item) => {
      const firstRequirement = item.requiredWeaponIds?.[0] ?? item.requiredBaseWeaponId ?? "A story weapon";
      const known = `${item.description[language]}\n${t(language, "required")}: ${(item.requiredWeaponIds ?? [item.requiredBaseWeaponId]).filter(Boolean).join(" + ")} ${(item.requiredPassiveIds ?? []).join(" + ")}`;
      return {
        id: item.id,
        name: item.name[language],
        description: known,
        hint: `${t(language, "required")}: ${firstRequirement} + ???. ${t(language, "hint")}: ${item.description[language]}`
      };
    });
  }

  private getTabLabel(tab: string, language: Language): string {
    if (language === "en") {
      return tab;
    }
    const labels: Record<string, string> = {
      Characters: "캐릭터",
      Stages: "스테이지",
      Bosses: "보스",
      Weapons: "무기",
      Passives: "패시브",
      Evolutions: "진화",
      Enemies: "적"
    };
    return labels[tab] ?? tab;
  }

  private getDiscoveredSet(save: ReturnType<typeof SaveSystem.load>, tab: string): Set<string> {
    if (tab === "Characters") return new Set(save.discoveredCharacters);
    if (tab === "Stages") return new Set(save.discoveredStages);
    if (tab === "Bosses") return new Set(save.discoveredBosses);
    if (tab === "Weapons") return new Set(save.discoveredWeapons);
    if (tab === "Passives") return new Set(save.discoveredPassives);
    if (tab === "Evolutions") return new Set(save.discoveredEvolutions);
    return new Set(save.discoveredEnemies);
  }
}
