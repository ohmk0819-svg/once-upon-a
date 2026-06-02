import Phaser from "phaser";
import { getEnemy } from "../data/enemies";
import { getBoss } from "../data/bosses";
import { Enemy } from "../entities/Enemy";
import { Boss } from "../entities/Boss";
import { StageData } from "../types/gameTypes";

export class WaveSystem {
  activeEnemyIds = ["smallWolf"];
  densityMultiplier = 1;
  nextSpawnAt = 0;
  eliteSpawned = false;
  bossSpawned = false;

  constructor(private scene: Phaser.Scene, private stage: StageData) {}

  update(elapsedSeconds: number, player: { x: number; y: number }, addEnemy: (enemy: Enemy) => void, addBoss: (boss: Boss) => void): void {
    if (elapsedSeconds >= 60 && !this.activeEnemyIds.includes("cookieSoldier")) {
      this.activeEnemyIds.push("cookieSoldier");
    }
    if (elapsedSeconds >= 120 && !this.activeEnemyIds.includes("forestMushroomBuddy")) {
      this.activeEnemyIds.push("forestMushroomBuddy");
    }
    if (elapsedSeconds >= 180 && !this.eliteSpawned) {
      this.eliteSpawned = true;
      addEnemy(this.spawnEnemy("bigWolf", player, true));
    }
    if (elapsedSeconds >= 240) {
      this.densityMultiplier = 1.55;
    }
    if (elapsedSeconds >= this.stage.bossTimeSeconds && !this.bossSpawned) {
      this.bossSpawned = true;
      addBoss(this.spawnBoss("bigBadWolf", player));
    }

    if (this.bossSpawned) {
      return;
    }

    const now = this.scene.time.now;
    if (now < this.nextSpawnAt) {
      return;
    }
    const spawnCount = elapsedSeconds > 240 ? 4 : elapsedSeconds > 120 ? 3 : elapsedSeconds > 60 ? 2 : 1;
    for (let i = 0; i < spawnCount; i += 1) {
      const id = Phaser.Utils.Array.GetRandom(this.activeEnemyIds);
      addEnemy(this.spawnEnemy(id, player));
    }
    this.nextSpawnAt = now + 900 / this.densityMultiplier;
  }

  private spawnEnemy(id: string, player: { x: number; y: number }, elite = false): Enemy {
    const angle = Math.random() * Math.PI * 2;
    const distance = 470 + Math.random() * 130;
    const x = player.x + Math.cos(angle) * distance;
    const y = player.y + Math.sin(angle) * distance;
    return new Enemy(this.scene, x, y, getEnemy(id), elite);
  }

  private spawnBoss(id: string, player: { x: number; y: number }): Boss {
    return new Boss(this.scene, player.x + 360, player.y - 180, getBoss(id));
  }
}
