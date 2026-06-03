import Phaser from "phaser";
import { Enemy } from "../entities/Enemy";
import { Pickup } from "../entities/Pickup";
import { Player } from "../entities/Player";
import { Projectile } from "../entities/Projectile";

type CompanionKind = "dog" | "monkey" | "pheasant" | "ally";

interface CompanionUnit {
  sprite: Phaser.Physics.Arcade.Sprite;
  kind: CompanionKind;
  offset: Phaser.Math.Vector2;
  nextAttackAt: number;
  expiresAt?: number;
}

export class CompanionSystem {
  private units: CompanionUnit[] = [];
  empowerUntil = 0;
  passiveLevel = 0;

  constructor(
    private scene: Phaser.Scene,
    private player: Player,
    private getEnemies: () => Enemy[],
    private getPickups: () => Pickup[],
    private damageEnemy: (enemy: Enemy, damage: number, knockback?: number, origin?: { x: number; y: number }) => void,
    private spawnProjectile: (projectile: Projectile) => void
  ) {}

  ensureCoreCompanions(): void {
    if (this.player.character.id !== "momotaro") {
      this.destroyAll();
      return;
    }
    if (this.units.some((unit) => unit.kind === "dog")) {
      return;
    }
    this.addCompanion("dog", -58, 42);
    this.addCompanion("monkey", 58, 42);
    this.addCompanion("pheasant", 0, -62);
  }

  update(time: number): void {
    if (this.player.character.id !== "momotaro") {
      return;
    }
    const enemies = this.getEnemies().filter((enemy) => enemy.active && enemy.hp > 0);
    for (const unit of this.units) {
      if (unit.expiresAt && time >= unit.expiresAt) {
        unit.sprite.destroy();
        continue;
      }
      const target = this.findNearest(this.player.x, this.player.y, enemies, this.getLeash(unit.kind));
      this.moveUnit(unit, target);
      if (unit.kind === "dog" || unit.kind === "ally") {
        this.updateMelee(unit, target, time);
      } else {
        this.updateRanged(unit, target, time);
      }
      if (unit.kind === "pheasant") {
        this.pullNearbyPickup(unit);
      }
    }
    this.units = this.units.filter((unit) => unit.sprite.active);
  }

  spawnTemporaryAlly(x: number, y: number): void {
    const temporaryCount = this.units.filter((unit) => unit.kind === "ally").length;
    if (temporaryCount >= 8) {
      return;
    }
    const unit = this.addCompanion("ally", Phaser.Math.Between(-90, 90), Phaser.Math.Between(-90, 90));
    unit.sprite.setPosition(x, y);
    unit.expiresAt = this.scene.time.now + 6000 * this.player.stats.temporaryAllyDurationMultiplier;
  }

  activateExpedition(): void {
    this.ensureCoreCompanions();
    this.empowerUntil = this.scene.time.now + 10000;
    for (let i = 0; i < 8; i += 1) {
      this.scene.time.delayedCall(i * 90, () => {
        const angle = i * (Math.PI / 4);
        const velocity = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle)).scale(430);
        this.spawnProjectile(
          new Projectile(
            this.scene,
            this.player.x,
            this.player.y,
            "projectile-peach-wave",
            24 + this.passiveLevel * 4,
            "oniIslandExpedition",
            velocity,
            1200
          )
        );
      });
    }
  }

  private addCompanion(kind: CompanionKind, offsetX: number, offsetY: number): CompanionUnit {
    const texture = `companion-${kind}`;
    const sprite = new Phaser.Physics.Arcade.Sprite(this.scene, this.player.x + offsetX, this.player.y + offsetY, texture);
    this.scene.add.existing(sprite);
    this.scene.physics.add.existing(sprite);
    sprite.setDepth(48);
    sprite.setCircle(11);
    const unit = {
      sprite,
      kind,
      offset: new Phaser.Math.Vector2(offsetX, offsetY),
      nextAttackAt: 0
    };
    this.units.push(unit);
    return unit;
  }

  private moveUnit(unit: CompanionUnit, target?: Enemy): void {
    const ownerDistance = Phaser.Math.Distance.Between(unit.sprite.x, unit.sprite.y, this.player.x, this.player.y);
    if (ownerDistance > 520) {
      this.followPlayer(unit, 420);
      return;
    }

    if (target && ownerDistance < this.getLeash(unit.kind)) {
      const targetDistance = Phaser.Math.Distance.Between(unit.sprite.x, unit.sprite.y, target.x, target.y);
      if (unit.kind === "monkey" && targetDistance < 110) {
        const away = new Phaser.Math.Vector2(unit.sprite.x - target.x, unit.sprite.y - target.y).normalize();
        unit.sprite.setVelocity(away.x * 170, away.y * 170);
        return;
      }
      if (unit.kind === "dog" || unit.kind === "ally" || targetDistance > this.getPreferredRange(unit.kind)) {
        const direction = new Phaser.Math.Vector2(target.x - unit.sprite.x, target.y - unit.sprite.y).normalize();
        unit.sprite.setVelocity(direction.x * this.getMoveSpeed(unit.kind), direction.y * this.getMoveSpeed(unit.kind));
        return;
      }
    }

    this.followPlayer(unit, 190);
  }

  private followPlayer(unit: CompanionUnit, speed = 190): void {
    const desired = new Phaser.Math.Vector2(this.player.x + unit.offset.x, this.player.y + unit.offset.y);
    const direction = desired.subtract(new Phaser.Math.Vector2(unit.sprite.x, unit.sprite.y));
    const followSpeed = direction.length() > 120 ? Math.max(speed, 340) : speed;
    if (direction.lengthSq() < 16) {
      unit.sprite.setVelocity(0, 0);
      return;
    }
    direction.normalize();
    unit.sprite.setVelocity(direction.x * followSpeed, direction.y * followSpeed);
  }

  private updateMelee(unit: CompanionUnit, target: Enemy | undefined, time: number): void {
    if (!target || time < unit.nextAttackAt) {
      return;
    }
    const interval = (time < this.empowerUntil ? 420 : 800) / this.player.stats.summonAttackSpeedMultiplier;
    unit.nextAttackAt = time + interval;
    const damage = (unit.kind === "ally" ? 10 : 16) * this.player.stats.summonDamageMultiplier;
    this.damageEnemy(target, damage + this.passiveLevel * 3, 12, unit.sprite);
  }

  private updateRanged(unit: CompanionUnit, target: Enemy | undefined, time: number): void {
    if (!target || time < unit.nextAttackAt) {
      return;
    }
    unit.nextAttackAt = time + (time < this.empowerUntil ? 520 : 1100) / this.player.stats.summonAttackSpeedMultiplier;
    const direction = new Phaser.Math.Vector2(target.x - unit.sprite.x, target.y - unit.sprite.y).normalize();
    const texture = unit.kind === "pheasant" ? "projectile-glass" : "projectile-bread";
    this.spawnProjectile(
      new Projectile(
        this.scene,
        unit.sprite.x,
        unit.sprite.y,
        texture,
        (12 + this.passiveLevel * 3) * this.player.stats.summonDamageMultiplier,
        `${unit.kind}Companion`,
        direction.scale(360),
        1700,
        target,
        0.03
      )
    );
  }

  private pullNearbyPickup(unit: CompanionUnit): void {
    const pickup = this.getPickups().find(
      (candidate) => candidate.active && Phaser.Math.Distance.Between(unit.sprite.x, unit.sprite.y, candidate.x, candidate.y) < 450
    );
    if (!pickup) {
      return;
    }
    const direction = new Phaser.Math.Vector2(this.player.x - pickup.x, this.player.y - pickup.y).normalize();
    pickup.setVelocity(direction.x * 430, direction.y * 430);
  }

  private getLeash(kind: CompanionKind): number {
    return kind === "pheasant" ? 450 : kind === "monkey" ? 350 : 500;
  }

  private getPreferredRange(kind: CompanionKind): number {
    return kind === "monkey" ? 180 : kind === "pheasant" ? 190 : 35;
  }

  private getMoveSpeed(kind: CompanionKind): number {
    if (kind === "dog" || kind === "ally") {
      return 310;
    }
    return kind === "pheasant" ? 245 : 220;
  }

  private findNearest(x: number, y: number, enemies: Enemy[], maxRange: number): Enemy | undefined {
    let nearest: Enemy | undefined;
    let nearestDistance = maxRange;
    for (const enemy of enemies) {
      const distance = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
      if (distance < nearestDistance) {
        nearest = enemy;
        nearestDistance = distance;
      }
    }
    return nearest;
  }

  private destroyAll(): void {
    for (const unit of this.units) {
      unit.sprite.destroy();
    }
    this.units = [];
  }
}
