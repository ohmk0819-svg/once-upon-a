import Phaser from "phaser";
import { getWeapon } from "../data/weapons";
import { AreaEffect } from "../entities/AreaEffect";
import { Enemy } from "../entities/Enemy";
import { Player } from "../entities/Player";
import { Projectile } from "../entities/Projectile";
import { PlayerStats, WeaponState } from "../types/gameTypes";

type DamageEnemyCallback = (enemy: Enemy, damage: number, knockback?: number, origin?: { x: number; y: number }) => void;

export class WeaponSystem {
  private cooldowns = new Map<string, number>();
  private lastPlayerPosition = new Phaser.Math.Vector2();
  private movementDistance = 0;

  constructor(
    private scene: Phaser.Scene,
    private getPlayer: () => Player,
    private getEnemies: () => Enemy[],
    private spawnProjectile: (projectile: Projectile) => void,
    private spawnArea: (area: AreaEffect) => void,
    private damageEnemy: DamageEnemyCallback
  ) {}

  update(time: number, weaponStates: WeaponState[], stats: PlayerStats): void {
    const player = this.getPlayer();
    if (this.lastPlayerPosition.lengthSq() === 0) {
      this.lastPlayerPosition.set(player.x, player.y);
    }
    this.updateMovementWeapon(weaponStates, stats);

    for (const state of weaponStates) {
      const weapon = getWeapon(state.id);
      if (weapon.kind === "movementShockwave") {
        continue;
      }
      const level = weapon.levels[state.level - 1];
      const nextAt = this.cooldowns.get(state.id) ?? 0;
      if (time < nextAt) {
        continue;
      }
      const cooldown = Math.max(160, level.cooldownMs / stats.attackSpeed / (1 + stats.cooldownReduction));
      this.cooldowns.set(state.id, time + cooldown);

      if (state.id === "woodenPunch") {
        this.fireWoodenPunch(state.level, stats);
      } else if (state.id === "matchGirlsMatch") {
        this.fireAreaWeapon(state.id, 0xffa23f, state.level, stats);
      } else if (state.id === "sleepingBriarRose") {
        this.fireAreaWeapon(state.id, 0xff7fbd, state.level, stats);
      } else if (state.id === "hanselsBreadcrumb") {
        this.fireProjectileWeapon(state.id, "projectile-breadcrumb", state.level, stats, state.level >= 5 ? 0.08 : 0.035);
      } else if (state.id === "redRidingHoodsBasket") {
        const textures = ["projectile-apple", "projectile-bread", "projectile-bottle"];
        this.fireProjectileWeapon(state.id, Phaser.Utils.Array.GetRandom(textures), state.level, stats, 0.01);
      }
    }
  }

  onFairyDash(weaponStates: WeaponState[], stats: PlayerStats, x: number, y: number): void {
    const boots = weaponStates.find((state) => state.id === "pussInBootsBoots");
    if (!boots || boots.level < 4) {
      this.createDashTrail(x, y);
      return;
    }
    const level = getWeapon("pussInBootsBoots").levels[boots.level - 1];
    const count = level.count ?? 2;
    for (let i = 0; i < count; i += 1) {
      this.scene.time.delayedCall(i * 90, () => {
        this.spawnArea(new AreaEffect(this.scene, x, y, level.size, level.damage, "pussInBootsBoots", 0xfff176, 520, 220, 18));
      });
    }
    this.createDashTrail(x, y);
  }

  private fireWoodenPunch(levelNumber: number, stats: PlayerStats): void {
    const player = this.getPlayer();
    const level = getWeapon("woodenPunch").levels[levelNumber - 1];
    const target = this.findNearest(level.range);
    if (!target) {
      return;
    }
    const direction = new Phaser.Math.Vector2(target.x - player.x, target.y - player.y).normalize();
    const impactX = player.x + direction.x * Math.min(level.range, 88);
    const impactY = player.y + direction.y * Math.min(level.range, 88);
    const count = level.count ?? 1;
    for (let i = 0; i < count; i += 1) {
      this.scene.time.delayedCall(i * 130, () => {
        const area = new AreaEffect(this.scene, impactX, impactY, level.size, level.damage, "woodenPunch", 0x8bd7ff, 160, 90, levelNumber >= 4 ? 24 : 14);
        this.spawnArea(area);
      });
    }
    void stats;
  }

  private fireAreaWeapon(id: string, color: number, levelNumber: number, stats: PlayerStats): void {
    const player = this.getPlayer();
    const level = getWeapon(id).levels[levelNumber - 1];
    const count = level.count ?? 1;
    for (let i = 0; i < count; i += 1) {
      const target = this.findNearest(level.range);
      const spread = new Phaser.Math.Vector2(Phaser.Math.Between(-50, 50), Phaser.Math.Between(-50, 50));
      const x = (target?.x ?? player.x) + spread.x;
      const y = (target?.y ?? player.y) + spread.y;
      this.spawnArea(
        new AreaEffect(this.scene, x, y, level.size, level.damage, id, color, level.durationMs ?? 2200, 420, 4)
      );
    }
    void stats;
  }

  private fireProjectileWeapon(id: string, texture: string, levelNumber: number, stats: PlayerStats, homingStrength: number): void {
    const player = this.getPlayer();
    const level = getWeapon(id).levels[levelNumber - 1];
    const count = level.count ?? 1;
    for (let i = 0; i < count; i += 1) {
      const target = this.findNearest(level.range);
      if (!target) {
        return;
      }
      const offsetAngle = (i - (count - 1) / 2) * 0.22;
      const direction = new Phaser.Math.Vector2(target.x - player.x, target.y - player.y).normalize().rotate(offsetAngle);
      const speed = level.speed ?? 320;
      this.spawnProjectile(
        new Projectile(
          this.scene,
          player.x + direction.x * 18,
          player.y + direction.y * 18,
          texture,
          level.damage,
          id,
          direction.scale(speed),
          2600,
          target,
          homingStrength
        )
      );
    }
    void stats;
  }

  private updateMovementWeapon(weaponStates: WeaponState[], stats: PlayerStats): void {
    const player = this.getPlayer();
    const boots = weaponStates.find((state) => state.id === "pussInBootsBoots");
    if (!boots) {
      this.lastPlayerPosition.set(player.x, player.y);
      return;
    }

    this.movementDistance += Phaser.Math.Distance.Between(player.x, player.y, this.lastPlayerPosition.x, this.lastPlayerPosition.y);
    this.lastPlayerPosition.set(player.x, player.y);
    const level = getWeapon("pussInBootsBoots").levels[boots.level - 1];
    const threshold = boots.level >= 5 ? 120 : 170;
    if (this.movementDistance >= threshold) {
      this.movementDistance = 0;
      this.spawnArea(new AreaEffect(this.scene, player.x, player.y, level.size, level.damage, "pussInBootsBoots", 0xfff176, 380, 180, 12));
    }
    void stats;
  }

  private findNearest(range: number): Enemy | undefined {
    const player = this.getPlayer();
    let nearest: Enemy | undefined;
    let nearestDistance = range;
    for (const enemy of this.getEnemies()) {
      if (!enemy.active || enemy.hp <= 0) {
        continue;
      }
      const distance = Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y);
      if (distance < nearestDistance) {
        nearest = enemy;
        nearestDistance = distance;
      }
    }
    return nearest;
  }

  private createDashTrail(x: number, y: number): void {
    for (let i = 0; i < 7; i += 1) {
      const star = this.scene.add.star(
        x + Phaser.Math.Between(-44, 44),
        y + Phaser.Math.Between(-44, 44),
        5,
        4,
        11,
        0xfff176,
        0.8
      );
      star.setDepth(62);
      this.scene.tweens.add({
        targets: star,
        alpha: 0,
        scale: 1.7,
        duration: 420,
        delay: i * 20,
        onComplete: () => star.destroy()
      });
    }
  }
}
