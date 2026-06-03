import Phaser from "phaser";
import { CharacterData, PlayerStats } from "../types/gameTypes";

export class Player extends Phaser.Physics.Arcade.Sprite {
  readonly character: CharacterData;
  hp: number;
  stats: PlayerStats;
  level = 1;
  lastMoveDirection = new Phaser.Math.Vector2(1, 0);
  invulnerableUntil = 0;
  dashReadyAt = 0;
  ultimateReadyAt = 90000;
  ultimateActiveUntil = 0;
  ultimateBuffUntil = 0;
  slowedUntil = 0;
  dashUnlocked = false;
  private readonly dashCooldownMs = 6000;

  constructor(scene: Phaser.Scene, x: number, y: number, character: CharacterData) {
    super(scene, x, y, Player.textureFor(character.visualType));
    this.character = character;
    this.hp = character.maxHp;
    this.stats = {
      maxHp: character.maxHp,
      moveSpeed: 210 * character.moveSpeed,
      attackMultiplier: character.attackMultiplier,
      attackSpeed: character.attackSpeed,
      critChance: character.critChance,
      critDamage: 2,
      damageReduction: 0,
      incomingDamageMultiplier: 1,
      expGain: 1,
      cooldownReduction: 0,
      dashCooldownReduction: 0,
      pickupRange: 80,
      hpRegenPerSecond: character.hpRegenPerSecond,
      maxHpMultiplier: 1,
      moveSpeedBonus: 0,
      evasionChance: 0,
      luck: 0,
      currencyGain: 1,
      healingMultiplier: 1,
      movingDamageBonus: 0,
      summonDamageMultiplier: 1,
      summonAttackSpeedMultiplier: 1,
      summonDurationMultiplier: 1,
      temporaryAllyDurationMultiplier: 1,
      enemySlowAura: 0
    };
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCircle(18);
    this.setDepth(50);
    this.setCollideWorldBounds(false);
  }

  updatePlayer(time: number): void {
    const activeUltimate = this.isUltimateBuffActive(time);
    this.setScale(activeUltimate ? 1.18 : 1);
    this.setTint(activeUltimate ? 0xfff176 : 0xffffff);
    if (time > this.invulnerableUntil && !activeUltimate) {
      this.clearTint();
      this.setAlpha(1);
    }
  }

  move(input: Phaser.Math.Vector2, time: number): void {
    const direction = input.lengthSq() > 0 ? input.normalize() : input;
    if (direction.lengthSq() > 0) {
      this.lastMoveDirection.copy(direction);
    }

    const slowMultiplier = time < this.slowedUntil ? 0.42 : 1;
    const ultimateMultiplier = this.isUltimateBuffActive(time) ? 1.08 : 1;
    this.setVelocity(
      direction.x * this.stats.moveSpeed * slowMultiplier * ultimateMultiplier,
      direction.y * this.stats.moveSpeed * slowMultiplier * ultimateMultiplier
    );
  }

  tryDash(time: number): boolean {
    if (!this.dashUnlocked || time < this.dashReadyAt) {
      return false;
    }

    const direction = this.lastMoveDirection.clone().normalize();
    this.dashReadyAt = time + this.getDashCooldownMs();
    this.invulnerableUntil = Math.max(this.invulnerableUntil, time + 250);
    this.setVelocity(direction.x * 720, direction.y * 720);
    this.scene.tweens.add({
      targets: this,
      alpha: 0.45,
      yoyo: true,
      repeat: 2,
      duration: 60
    });
    this.emit("fairy-dash", this.x, this.y);
    return true;
  }

  tryUltimate(time: number): boolean {
    if (time < this.ultimateReadyAt) {
      return false;
    }
    this.ultimateReadyAt = time + this.getUltimateCooldownMs();
    this.invulnerableUntil = Math.max(this.invulnerableUntil, time + 2000);
    this.ultimateActiveUntil = time + 2000;
    this.ultimateBuffUntil = time + 10000;
    this.emit("ultimate", this.x, this.y);
    return true;
  }

  readyUltimateNow(): void {
    this.ultimateReadyAt = 0;
  }

  takeDamage(amount: number, time: number): boolean {
    if (time < this.invulnerableUntil || this.isUltimateInvulnerable(time)) {
      return false;
    }
    if (Math.random() < this.stats.evasionChance) {
      this.invulnerableUntil = time + 250;
      return false;
    }
    const finalDamage = amount * this.stats.incomingDamageMultiplier * (1 - this.stats.damageReduction);
    this.hp = Math.max(0, this.hp - finalDamage);
    this.invulnerableUntil = time + 500;
    this.scene.tweens.add({
      targets: this,
      alpha: 0.35,
      yoyo: true,
      repeat: 3,
      duration: 65
    });
    return true;
  }

  heal(amount: number): void {
    this.hp = Math.min(this.stats.maxHp, this.hp + amount * this.stats.healingMultiplier);
  }

  regenerate(deltaMs: number): void {
    if (this.hp <= 0 || this.hp >= this.stats.maxHp) {
      return;
    }
    this.hp = Math.min(this.stats.maxHp, this.hp + this.stats.hpRegenPerSecond * (deltaMs / 1000));
  }

  applySlow(time: number, durationMs: number): void {
    this.slowedUntil = Math.max(this.slowedUntil, time + durationMs);
  }

  isUltimateInvulnerable(time: number): boolean {
    return time < this.ultimateActiveUntil;
  }

  isUltimateBuffActive(time: number): boolean {
    return time < this.ultimateBuffUntil;
  }

  getDashCooldownRatio(time: number): number {
    if (!this.dashUnlocked) {
      return 1;
    }
    return Math.max(0, Math.min(1, (this.dashReadyAt - time) / this.getDashCooldownMs()));
  }

  getUltimateCooldownRatio(time: number): number {
    return Math.max(0, Math.min(1, (this.ultimateReadyAt - time) / this.getUltimateCooldownMs()));
  }

  private getDashCooldownMs(): number {
    return this.dashCooldownMs * (1 - Phaser.Math.Clamp(this.stats.dashCooldownReduction, 0, 0.5));
  }

  private getUltimateCooldownMs(): number {
    return 90000 * (1 - Phaser.Math.Clamp(this.stats.cooldownReduction, 0, 0.65));
  }

  private static textureFor(visualType: string): string {
    const map: Record<string, string> = {
      roundWoodcutter: "player-woodcutter",
      brightBlueWoodenDoll: "player-pinocchio",
      brightCinderella: "player-cinderella",
      brightMomotaro: "player-momotaro"
    };
    return map[visualType] ?? "player-pinocchio";
  }
}
