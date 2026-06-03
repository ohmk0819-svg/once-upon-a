import Phaser from "phaser";
import "./style.css";
import { BootScene } from "./game/scenes/BootScene";
import { PreloadScene } from "./game/scenes/PreloadScene";
import { TitleScene } from "./game/scenes/TitleScene";
import { CharacterSelectScene } from "./game/scenes/CharacterSelectScene";
import { StageSelectScene } from "./game/scenes/StageSelectScene";
import { AchievementsScene } from "./game/scenes/AchievementsScene";
import { CollectionScene } from "./game/scenes/CollectionScene";
import { GameScene } from "./game/scenes/GameScene";
import { LevelUpScene } from "./game/scenes/LevelUpScene";
import { PauseScene } from "./game/scenes/PauseScene";
import { ResultScene } from "./game/scenes/ResultScene";
import { SettingsScene } from "./game/scenes/SettingsScene";
import { TutorialScene } from "./game/scenes/TutorialScene";
import { UpgradesScene } from "./game/scenes/UpgradesScene";

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
    UpgradesScene,
    CollectionScene,
    AchievementsScene,
    SettingsScene,
    CharacterSelectScene,
    StageSelectScene,
    GameScene,
    LevelUpScene,
    PauseScene,
    TutorialScene,
    ResultScene
  ]
};

new Phaser.Game(config);
