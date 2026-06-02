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
  ultimateReadyAt = 30000;
  ultimateActiveUntil = 0;
  ultimateBuffUntil = 0;
  slowedUntil = 0;
  dashUnlocked = false;
  private readonly dashCooldownMs = 6000;

  constructor(scene: Phaser.Scene, x: number, y: number, character: CharacterData) {
    super(scene, x, y, "player-pinocchio");
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
      expGain: 1,
      cooldownReduction: 0,
      hpRegenPerSecond: character.hpRegenPerSecond
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
    this.dashReadyAt = time + this.dashCooldownMs;
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
    this.ultimateReadyAt = time + 90000;
    this.invulnerableUntil = Math.max(this.invulnerableUntil, time + 2000);
    this.ultimateActiveUntil = time + 2000;
    this.ultimateBuffUntil = time + 10000;
    this.emit("ultimate", this.x, this.y);
    return true;
  }

  takeDamage(amount: number, time: number): boolean {
    if (time < this.invulnerableUntil || this.isUltimateInvulnerable(time)) {
      return false;
    }
    const finalDamage = amount * (1 - this.stats.damageReduction);
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
    this.hp = Math.min(this.stats.maxHp, this.hp + amount);
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
    return Math.max(0, Math.min(1, (this.dashReadyAt - time) / this.dashCooldownMs));
  }

  getUltimateCooldownRatio(time: number): number {
    return Math.max(0, Math.min(1, (this.ultimateReadyAt - time) / 90000));
  }
}
