import Phaser from "phaser";
import { SaveSystem } from "../systems/SaveSystem";
import { Language } from "../types/gameTypes";
import { GameScene } from "./GameScene";

const STEPS: Record<Language, string[]> = {
  en: [
    "Move with WASD or Arrow Keys.",
    "Attacks are automatic.",
    "Press Space or Shift to dash once Fairy Dash is unlocked.",
    "Press Tab or C to switch aim mode.",
    "Pick upgrades when you level up.",
    "Defeat the boss to clear the stage."
  ],
  ko: [
    "WASD 또는 방향키로 이동합니다.",
    "공격은 자동으로 발동됩니다.",
    "페어리 대시가 해금되면 Space 또는 Shift로 대시합니다.",
    "Tab 또는 C로 조준 모드를 전환합니다.",
    "레벨업할 때 성장 선택지를 고릅니다.",
    "보스를 쓰러뜨리면 스테이지를 클리어합니다."
  ]
};

export class TutorialScene extends Phaser.Scene {
  private step = 0;
  private language: Language = "en";

  constructor() {
    super("TutorialScene");
  }

  create(): void {
    this.language = SaveSystem.load().settings?.language ?? "en";
    this.render();
    this.input.keyboard!.on("keydown-ENTER", () => this.next());
    this.input.keyboard!.on("keydown-ESC", () => this.finish());
    this.input.on("pointerdown", () => this.next());
  }

  private render(): void {
    this.children.removeAll();
    this.add.rectangle(640, 360, 1280, 720, 0x243a4a, 0.48);
    this.add.rectangle(640, 360, 680, 260, 0xfffef2, 0.96).setStrokeStyle(5, 0x6bb7c8);
    const steps = STEPS[this.language];
    this.add.text(640, 280, this.language === "ko" ? "동화책 기본기" : "Storybook Basics", {
      fontFamily: "Georgia, serif",
      fontSize: "42px",
      color: "#2d4b5b",
      stroke: "#ffffff",
      strokeThickness: 5
    }).setOrigin(0.5);
    this.add.text(640, 360, steps[this.step], {
      fontFamily: "Verdana, sans-serif",
      fontSize: "24px",
      color: "#406578",
      align: "center",
      wordWrap: { width: 560 }
    }).setOrigin(0.5);
    this.add.text(640, 452, `${this.language === "ko" ? "Enter / 클릭: 다음     Esc: 건너뛰기" : "Enter / Click: Next     Esc: Skip"}     ${this.step + 1}/${steps.length}`, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "18px",
      color: "#ffffff",
      stroke: "#4f9cab",
      strokeThickness: 5
    }).setOrigin(0.5);
  }

  private next(): void {
    this.step += 1;
    if (this.step >= STEPS[this.language].length) {
      this.finish();
      return;
    }
    this.render();
  }

  private finish(): void {
    const save = SaveSystem.load();
    save.tutorialSeen = true;
    SaveSystem.save(save);
    const gameScene = this.scene.get("GameScene") as GameScene;
    gameScene.markGameplayResumed();
    this.scene.stop();
    this.scene.resume("GameScene");
  }
}
