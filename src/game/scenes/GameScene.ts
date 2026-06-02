import Phaser from "phaser";
import { getCharacter } from "../data/characters";
import { getPassive } from "../data/passives";
import { getStage } from "../data/stages";
import { AreaEffect } from "../entities/AreaEffect";
import { Boss } from "../entities/Boss";
import { Enemy } from "../entities/Enemy";
import { Pickup } from "../entities/Pickup";
import { Player } from "../entities/Player";
import { Projectile } from "../entities/Projectile";
import { BossPatternSystem } from "../systems/BossPatternSystem";
import { CombatSystem } from "../systems/CombatSystem";
import { InputSystem } from "../systems/InputSystem";
import { LevelSystem } from "../systems/LevelSystem";
import { SaveSystem } from "../systems/SaveSystem";
import { UISystem } from "../systems/UISystem";
import { WaveSystem } from "../systems/WaveSystem";
import { WeaponSystem } from "../systems/WeaponSystem";
import { LevelUpOption, PassiveState, PlayerStats, WeaponState } from "../types/gameTypes";

export class GameScene extends Phaser.Scene {
  player!: Player;
  private inputSystem!: InputSystem;
  private combat!: CombatSystem;
  private levelSystem!: LevelSystem;
  private waveSystem!: WaveSystem;
  private weaponSystem!: WeaponSystem;
  private bossPatternSystem!: BossPatternSystem;
  private ui!: UISystem;
  private enemies: Enemy[] = [];
  private projectiles: Projectile[] = [];
  private pickups: Pickup[] = [];
  private areaEffects: AreaEffect[] = [];
  private boss?: Boss;
  private weaponStates: WeaponState[] = [];
  private passiveStates: PassiveState[] = [];
  private characterPassiveLevel = 0;
  private startTime = 0;
  private kills = 0;
  private levelUpOpen = false;
  private runEnded = false;

  constructor() {
    super("GameScene");
  }

  create(data: { characterId?: string }): void {
    const character = getCharacter(data.characterId ?? "pinocchio");
    const stage = getStage("topsyTurvyStorybookForest");
    this.physics.world.setBounds(-2200, -2200, 4400, 4400);
    this.cameras.main.setBackgroundColor(stage.backgroundColor);
    this.drawStage();

    this.player = new Player(this, 0, 0, character);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setBounds(-2200, -2200, 4400, 4400);

    this.weaponStates = [{ id: character.baseWeaponId, level: 1 }];
    this.passiveStates = [];
    this.inputSystem = new InputSystem(this);
    this.combat = new CombatSystem(this);
    this.levelSystem = new LevelSystem();
    this.waveSystem = new WaveSystem(this, stage);
    this.weaponSystem = new WeaponSystem(
      this,
      () => this.player,
      () => this.getAllEnemies(),
      (projectile) => this.projectiles.push(projectile),
      (area) => this.areaEffects.push(area),
      (enemy, damage, knockback, origin) => this.damageEnemy(enemy, damage, knockback, origin)
    );
    this.bossPatternSystem = new BossPatternSystem(this, this.combat);
    this.ui = new UISystem(this);
    this.startTime = this.time.now;

    this.player.on("fairy-dash", (x: number, y: number) => {
      this.weaponSystem.onFairyDash(this.weaponStates, this.player.stats, x, y);
    });
    this.player.on("ultimate", (x: number, y: number) => this.createUltimateAura(x, y));
    this.rebuildPlayerStats();
  }

  update(time: number, delta: number): void {
    if (this.runEnded || this.levelUpOpen) {
      return;
    }

    const elapsedSeconds = (time - this.startTime) / 1000;
    this.player.move(this.inputSystem.getMoveVector(), time);
    if (this.inputSystem.dashPressed()) {
      this.player.tryDash(time);
    }
    if (this.inputSystem.ultimatePressed()) {
      this.player.tryUltimate(time);
    }
    this.player.updatePlayer(time);
    this.player.regenerate(delta);

    this.waveSystem.update(elapsedSeconds, this.player, (enemy) => this.enemies.push(enemy), (boss) => {
      this.boss = boss;
      this.createBossArrival();
    });

    this.updateEnemies(time);
    this.weaponSystem.update(time, this.weaponStates, this.player.stats);
    this.updateProjectiles(time);
    this.updateAreas(time);
    this.updatePickups();
    this.bossPatternSystem.update(time, this.boss, this.player);
    this.ui.update(this.player, this.levelSystem, elapsedSeconds, this.weaponStates, this.passiveStates, this.boss);

    if (this.player.hp <= 0) {
      this.finishRun(false);
    }

    void delta;
  }

  chooseLevelUpOption(option: LevelUpOption): void {
    if (option.type === "heal") {
      this.player.heal(30);
    } else if (option.type === "characterPassive") {
      this.characterPassiveLevel += 1;
    } else {
      this.levelSystem.applyOption(option, this.weaponStates, this.passiveStates);
    }
    this.rebuildPlayerStats();
    this.levelUpOpen = false;
    this.scene.resume("GameScene");
    this.time.delayedCall(1, () => this.openNextLevelUpIfNeeded());
  }

  private rebuildPlayerStats(): void {
    const character = this.player.character;
    const stats: PlayerStats = {
      maxHp: character.maxHp,
      moveSpeed: 210 * character.moveSpeed,
      attackMultiplier: character.attackMultiplier,
      attackSpeed: character.attackSpeed + (this.levelSystem.level - 1) * 0.015,
      critChance: character.critChance,
      critDamage: 2,
      damageReduction: 0,
      expGain: 1,
      cooldownReduction: 0,
      hpRegenPerSecond: character.hpRegenPerSecond
    };

    stats.attackSpeed += this.characterPassiveLevel * 0.06;

    for (const state of this.passiveStates) {
      const passive = getPassive(state.id);
      const level = passive.levels[state.level - 1];
      stats.attackSpeed += level.attackSpeedBonus ?? 0;
      stats.damageReduction += level.damageReduction ?? 0;
      stats.expGain += level.expGainBonus ?? 0;
      stats.critChance += level.critChanceBonus ?? 0;
      stats.critDamage += level.critDamageBonus ?? 0;
      stats.cooldownReduction += level.cooldownReduction ?? 0;
    }

    stats.damageReduction = Phaser.Math.Clamp(stats.damageReduction, 0, 0.75);
    stats.cooldownReduction = Phaser.Math.Clamp(stats.cooldownReduction, 0, 0.65);
    this.player.stats = stats;
    this.player.level = this.levelSystem.level;
    this.player.dashUnlocked = this.levelSystem.level >= 7;
  }

  private updateEnemies(time: number): void {
    const playerPosition = new Phaser.Math.Vector2(this.player.x, this.player.y);
    for (const enemy of this.getAllEnemies()) {
      if (!enemy.active) {
        continue;
      }
      enemy.updateChase(playerPosition);
      const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);
      if (!this.boss || enemy !== this.boss) {
        this.repositionIfTooFar(enemy, distance);
      }
      if (distance < (enemy.isElite ? 62 : 42) && time - enemy.lastHitAt > 500) {
        enemy.lastHitAt = time;
        this.combat.damagePlayer(this.player, enemy.dataDef.damage, time);
      }
    }
    this.enemies = this.enemies.filter((enemy) => enemy.active);
  }

  private updateProjectiles(time: number): void {
    for (const projectile of this.projectiles) {
      if (!projectile.active) {
        continue;
      }
      projectile.updateProjectile(time);
      for (const enemy of this.getAllEnemies()) {
        if (!enemy.active) {
          continue;
        }
        const radius = enemy.isElite ? 52 : 28;
        if (Phaser.Math.Distance.Between(projectile.x, projectile.y, enemy.x, enemy.y) < radius) {
          this.damageEnemy(enemy, projectile.damage, 8, projectile);
          projectile.destroy();
          break;
        }
      }
    }
    this.projectiles = this.projectiles.filter((projectile) => projectile.active);
  }

  private updateAreas(time: number): void {
    for (const area of this.areaEffects) {
      if (!area.active) {
        continue;
      }
      if (time >= area.expiresAt) {
        area.destroy();
        continue;
      }
      if (!area.shouldTick(time)) {
        continue;
      }
      for (const enemy of this.getAllEnemies()) {
        if (!enemy.active) {
          continue;
        }
        if (Phaser.Math.Distance.Between(area.xPos, area.yPos, enemy.x, enemy.y) <= area.radius + (enemy.isElite ? 42 : 22)) {
          this.damageEnemy(enemy, area.damage, area.knockback, { x: area.xPos, y: area.yPos });
        }
      }
    }
    this.areaEffects = this.areaEffects.filter((area) => area.active);
  }

  private updatePickups(): void {
    for (const pickup of this.pickups) {
      if (!pickup.active) {
        continue;
      }
      pickup.updatePickup(this.player);
      if (Phaser.Math.Distance.Between(pickup.x, pickup.y, this.player.x, this.player.y) < 28) {
        pickup.destroy();
        const leveled = this.levelSystem.addExp(pickup.expValue, this.player.stats.expGain);
        if (leveled) {
          this.rebuildPlayerStats();
          this.openNextLevelUpIfNeeded();
        }
      }
    }
    this.pickups = this.pickups.filter((pickup) => pickup.active);
  }

  private damageEnemy(enemy: Enemy, damage: number, knockback = 0, origin?: { x: number; y: number }): void {
    if (!enemy.active || enemy.hp <= 0) {
      return;
    }
    const died = this.combat.damageEnemy(enemy, damage, this.player.stats, knockback, origin);
    if (died) {
      this.handleEnemyDeath(enemy);
    }
  }

  private handleEnemyDeath(enemy: Enemy): void {
    if (!enemy.active) {
      return;
    }
    if (enemy instanceof Boss) {
      enemy.destroy();
      this.finishRun(true);
      return;
    }

    this.kills += 1;
    this.pickups.push(new Pickup(this, enemy.x, enemy.y, enemy.dataDef.expDrop));
    if (enemy.isElite) {
      this.levelSystem.pendingLevelUps += 1;
      const treasureText = this.add.text(enemy.x, enemy.y - 58, "Treasure!", {
        fontFamily: "Verdana, sans-serif",
        fontSize: "22px",
        color: "#fff176",
        stroke: "#5f524b",
        strokeThickness: 4
      }).setDepth(75);
      this.tweens.add({
        targets: treasureText,
        y: treasureText.y - 40,
        alpha: 0,
        duration: 900,
        onComplete: () => treasureText.destroy()
      });
      this.openNextLevelUpIfNeeded();
    }
    enemy.destroy();
  }

  private openNextLevelUpIfNeeded(): void {
    if (this.levelUpOpen || this.runEnded || !this.levelSystem.consumeLevelUp()) {
      return;
    }
    this.levelUpOpen = true;
    this.rebuildPlayerStats();
    const options = this.levelSystem.generateOptions(
      this.weaponStates,
      this.passiveStates,
      "en",
      this.player.character.baseWeaponId,
      this.characterPassiveLevel
    );
    this.scene.pause("GameScene");
    this.scene.launch("LevelUpScene", { options, level: this.levelSystem.level });
  }

  private getAllEnemies(): Enemy[] {
    return this.boss && this.boss.active ? [...this.enemies, this.boss] : this.enemies;
  }

  private repositionIfTooFar(enemy: Enemy, distance: number): void {
    if (distance < 1050) {
      return;
    }
    const angle = Math.random() * Math.PI * 2;
    enemy.x = this.player.x + Math.cos(angle) * 620;
    enemy.y = this.player.y + Math.sin(angle) * 620;
  }

  private finishRun(clear: boolean): void {
    if (this.runEnded) {
      return;
    }
    this.runEnded = true;
    const survivalTime = (this.time.now - this.startTime) / 1000;
    const currencyEarned = Math.max(1, Math.floor(this.kills / 8)) + (clear ? 25 : 0);
    SaveSystem.recordRun({
      survivalTime,
      level: this.levelSystem.level,
      kills: this.kills,
      clear,
      bossId: this.boss?.bossDef.id,
      currencyEarned
    });
    this.scene.start("ResultScene", {
      clear,
      survivalTime,
      kills: this.kills,
      level: this.levelSystem.level,
      currencyEarned
    });
  }

  private drawStage(): void {
    this.add.rectangle(0, 0, 4400, 4400, 0xb4ee81).setDepth(-20);
    for (let i = 0; i < 34; i += 1) {
      const x = -2000 + Math.random() * 4000;
      const y = -2000 + Math.random() * 4000;
      this.add.circle(x, y, Phaser.Math.Between(10, 22), Phaser.Utils.Array.GetRandom([0xffb3c7, 0xfff176, 0x80deea]), 0.65).setDepth(-15);
    }
    for (let i = 0; i < 16; i += 1) {
      const x = -2000 + Math.random() * 4000;
      const y = -2000 + Math.random() * 4000;
      this.add.rectangle(x, y, 86, 32, 0xfff7d6, 0.72).setRotation(Math.random() * 0.6 - 0.3).setDepth(-12);
    }
    this.add.rectangle(0, 0, 4400, 140, 0xc88955, 0.28).setDepth(-16);
    this.add.rectangle(0, 0, 140, 4400, 0xc88955, 0.22).setDepth(-16);
  }

  private createBossArrival(): void {
    const text = this.add.text(this.player.x, this.player.y - 210, "Big Bad Wolf appears!", {
      fontFamily: "Verdana, sans-serif",
      fontSize: "32px",
      color: "#ffffff",
      stroke: "#6c5a51",
      strokeThickness: 6
    }).setOrigin(0.5).setDepth(110);
    this.tweens.add({
      targets: text,
      y: text.y - 36,
      alpha: 0,
      duration: 1800,
      onComplete: () => text.destroy()
    });
  }

  private createUltimateAura(x: number, y: number): void {
    const aura = this.add.circle(x, y, 48, 0xfff176, 0.34).setDepth(48);
    this.tweens.add({ targets: aura, scale: 3.2, alpha: 0, duration: 850, onComplete: () => aura.destroy() });
  }
}
