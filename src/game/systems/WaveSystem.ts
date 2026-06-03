import Phaser from "phaser";
import { getBoss } from "../data/bosses";
import { getEnemy } from "../data/enemies";
import { Boss } from "../entities/Boss";
import { Enemy } from "../entities/Enemy";
import { StageData, StageTimelineEntry } from "../types/gameTypes";

export class WaveSystem {
  activeEnemyIds: string[] = [];
  densityMultiplier = 1;
  nextSpawnAt = 0;
  bossSpawned = false;
  private readonly processedEvents = new Set<string>();
  private readonly bossTimeSeconds: number;
  private readonly timelineScale: number;

  constructor(private scene: Phaser.Scene, private stage: StageData, private devMode = false) {
    this.activeEnemyIds = [...new Set([stage.enemyPool?.[0] ?? "smallWolf"])];
    const normalBossTime = stage.normalBossTimeSec ?? stage.bossTimeSeconds;
    this.bossTimeSeconds = devMode ? stage.devBossTimeSec ?? 180 : normalBossTime;
    this.timelineScale = devMode ? this.bossTimeSeconds / normalBossTime : 1;
  }

  update(elapsedSeconds: number, player: { x: number; y: number }, addEnemy: (enemy: Enemy) => void, addBoss: (boss: Boss) => void): void {
    for (const event of this.stage.timeline) {
      const eventTime = this.getEventTime(event);
      const key = `${event.event}:${event.atSeconds}:${event.enemyId ?? event.bossId ?? ""}`;
      if (elapsedSeconds < eventTime || this.processedEvents.has(key)) {
        continue;
      }
      this.processedEvents.add(key);
      this.applyEvent(event, player, addEnemy, addBoss);
    }

    if (elapsedSeconds >= this.bossTimeSeconds && !this.bossSpawned) {
      addBoss(this.spawnBossNow(player));
    }

    if (this.bossSpawned) {
      return;
    }

    const now = elapsedSeconds * 1000;
    if (now < this.nextSpawnAt) {
      return;
    }
    const spawnCount = Math.min(5, 1 + Math.floor(elapsedSeconds / (this.devMode ? 38 : 150)));
    for (let i = 0; i < spawnCount; i += 1) {
      addEnemy(this.spawnEnemy(Phaser.Utils.Array.GetRandom(this.activeEnemyIds), player));
    }
    this.nextSpawnAt = now + (this.devMode ? 520 : 900) / this.densityMultiplier;
  }

  getBossTimeSeconds(): number {
    return this.bossTimeSeconds;
  }

  spawnEliteNow(player: { x: number; y: number }): Enemy {
    const id = Phaser.Utils.Array.GetRandom(this.stage.elitePool ?? ["bigWolf"]);
    return this.spawnEnemy(id, player, true);
  }

  spawnBossNow(player: { x: number; y: number }, bossId = this.stage.bossId ?? "bigBadWolf"): Boss {
    this.bossSpawned = true;
    return new Boss(this.scene, player.x + 360, player.y - 180, getBoss(bossId));
  }

  resumeAfterBoss(): void {
    this.bossSpawned = false;
    this.densityMultiplier += 0.5;
    this.nextSpawnAt = 0;
  }

  private applyEvent(event: StageTimelineEntry, player: { x: number; y: number }, addEnemy: (enemy: Enemy) => void, addBoss: (boss: Boss) => void): void {
    if (event.event === "addEnemy" && event.enemyId && !this.activeEnemyIds.includes(event.enemyId)) {
      this.activeEnemyIds.push(event.enemyId);
    }
    if (event.event === "spawnElite") {
      addEnemy(this.spawnEliteNow(player));
    }
    if (event.event === "increaseDensity") {
      this.densityMultiplier += this.devMode ? 0.42 : 0.28;
    }
    if (event.event === "spawnBoss" && !this.bossSpawned) {
      addBoss(this.spawnBossNow(player, event.bossId ?? this.stage.bossId ?? "bigBadWolf"));
    }
  }

  private getEventTime(event: StageTimelineEntry): number {
    if (event.event === "spawnBoss") {
      return this.bossTimeSeconds;
    }
    return event.atSeconds * this.timelineScale;
  }

  private spawnEnemy(id: string, player: { x: number; y: number }, elite = false): Enemy {
    const angle = Math.random() * Math.PI * 2;
    const distance = 470 + Math.random() * 130;
    const x = player.x + Math.cos(angle) * distance;
    const y = player.y + Math.sin(angle) * distance;
    return new Enemy(this.scene, x, y, getEnemy(id), elite);
  }
}
