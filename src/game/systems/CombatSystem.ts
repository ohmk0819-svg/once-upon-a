import Phaser from "phaser";
import { calculateDamageWithCrit } from "../utils/balance";
import { Enemy } from "../entities/Enemy";
import { DamageText } from "../entities/DamageText";
import { Player } from "../entities/Player";
import { PlayerStats } from "../types/gameTypes";

export class CombatSystem {
  constructor(private scene: Phaser.Scene) {}

  findNearestEnemy(x: number, y: number, enemies: Enemy[], maxRange = Number.MAX_SAFE_INTEGER): Enemy | undefined {
    let nearest: Enemy | undefined;
    let nearestDistance = maxRange;
    for (const enemy of enemies) {
      if (!enemy.active || enemy.hp <= 0) {
        continue;
      }
      const distance = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
      if (distance < nearestDistance) {
        nearest = enemy;
        nearestDistance = distance;
      }
    }
    return nearest;
  }

  damageEnemy(enemy: Enemy, baseDamage: number, stats: PlayerStats, knockback = 0, origin?: { x: number; y: number }): boolean {
    const gameplayTime = (this.scene as any).getGameplayTime?.() ?? this.scene.time.now;
    const ultimateMultiplier = (this.scene as any).player?.isUltimateBuffActive?.(gameplayTime) ? 1.35 : 1;
    const result = calculateDamageWithCrit(baseDamage * stats.attackMultiplier * ultimateMultiplier, stats.critChance, stats.critDamage);
    const died = enemy.takeDamage(result.damage);
    new DamageText(this.scene, enemy.x, enemy.y - 20, result.damage, result.isCrit);

    if (knockback > 0 && origin) {
      const direction = new Phaser.Math.Vector2(enemy.x - origin.x, enemy.y - origin.y).normalize();
      enemy.x += direction.x * knockback;
      enemy.y += direction.y * knockback;
    }
    return died;
  }

  damagePlayer(player: Player, amount: number, time: number): boolean {
    const hit = player.takeDamage(amount, time);
    if (hit) {
      const spark = this.scene.add.circle(player.x, player.y, 18, 0xfff176, 0.55).setDepth(70);
      this.scene.tweens.add({
        targets: spark,
        scale: 1.8,
        alpha: 0,
        duration: 260,
        onComplete: () => spark.destroy()
      });
    }
    return hit;
  }
}
