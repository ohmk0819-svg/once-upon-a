import Phaser from "phaser";
import "./style.css";
import { BootScene } from "./game/scenes/BootScene";
import { PreloadScene } from "./game/scenes/PreloadScene";
import { TitleScene } from "./game/scenes/TitleScene";
import { CharacterSelectScene } from "./game/scenes/CharacterSelectScene";
import { GameScene } from "./game/scenes/GameScene";
import { LevelUpScene } from "./game/scenes/LevelUpScene";
import { ResultScene } from "./game/scenes/ResultScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game",
  width: 1280,
  height: 720,
  backgroundColor: "#9be883",
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { x: 0, y: 0 }
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [
    BootScene,
    PreloadScene,
    TitleScene,
    CharacterSelectScene,
    GameScene,
    LevelUpScene,
    ResultScene
  ]
};

new Phaser.Game(config);
