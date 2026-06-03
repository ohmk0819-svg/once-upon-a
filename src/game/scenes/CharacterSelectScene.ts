import Phaser from "phaser";
import { characters } from "../data/characters";
import { SaveSystem } from "../systems/SaveSystem";

export class CharacterSelectScene extends Phaser.Scene {
  private selectedIndex = 0;
  private cardOutlines: Phaser.GameObjects.Rectangle[] = [];
  private previewSprites: Phaser.GameObjects.Image[] = [];

  constructor() {
    super("CharacterSelectScene");
  }

  create(): void {
    const save = SaveSystem.load();
    this.selectedIndex = Math.max(0, characters.findIndex((character) => character.id === (save.lastSelectedCharacter ?? save.lastCharacterId)));
    this.cameras.main.setBackgroundColor("#b7ef9b");
    this.add.rectangle(640, 360, 1280, 720, 0xb7ef9b);
    this.add.text(640, 70, "Character Select", {
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

    this.add.text(640, 650, "A/D or Arrows: Select     1-4: Quick Pick     Enter: Start", {
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
    this.add.rectangle(x + 138, y + 210, 276, 420, 0xfffef2, 0.94).setStrokeStyle(5, 0x6bb7c8);
    const outline = this.add.rectangle(x + 138, y + 210, 276, 420, 0xffffff, 0).setStrokeStyle(0, 0xfff176);
    this.cardOutlines[index] = outline;

    this.add.text(x + 138, y + 24, `${index + 1}. ${character.name.en}`, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "23px",
      color: "#2d4b5b",
      align: "center",
      wordWrap: { width: 230 }
    }).setOrigin(0.5, 0);
    this.add.text(x + 138, y + 60, character.name.ko, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "15px",
      color: "#4f6d7a",
      align: "center",
      wordWrap: { width: 230 }
    }).setOrigin(0.5, 0);

    const sprite = this.add.image(x + 138, y + 140, this.getTextureFor(character.visualType)).setScale(1.8);
    this.previewSprites[index] = sprite;
    this.add.rectangle(x + 138, y + 218, 86, 20, character.color, 0.85).setStrokeStyle(3, 0xffffff);

    this.add.text(x + 138, y + 250, character.description.en, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "15px",
      color: "#406578",
      align: "center",
      wordWrap: { width: 230 }
    }).setOrigin(0.5, 0);
    this.add.text(x + 138, y + 350, `Difficulty: ${this.formatDifficulty(character.difficulty)}`, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "16px",
      color: character.difficulty === "easy" ? "#2e7d32" : "#ad5f00",
      stroke: "#ffffff",
      strokeThickness: 3
    }).setOrigin(0.5);

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
  }

  private startGame(): void {
    const character = characters[this.selectedIndex];
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
}
