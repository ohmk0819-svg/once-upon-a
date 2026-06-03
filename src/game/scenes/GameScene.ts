import Phaser from "phaser";
import { getCharacter } from "../data/characters";
import { getEnemy } from "../data/enemies";
import { evolutions } from "../data/evolutions";
import { getPassive } from "../data/passives";
import { passives } from "../data/passives";
import { getStage, stages } from "../data/stages";
import { getWeapon, weapons } from "../data/weapons";
import { AreaEffect } from "../entities/AreaEffect";
import { Boss } from "../entities/Boss";
import { Enemy } from "../entities/Enemy";
import { Pickup } from "../entities/Pickup";
import { Player } from "../entities/Player";
import { Projectile } from "../entities/Projectile";
import { BossPatternSystem } from "../systems/BossPatternSystem";
import { CombatSystem } from "../systems/CombatSystem";
import { CompanionSystem } from "../systems/CompanionSystem";
import { EvolutionSystem } from "../systems/EvolutionSystem";
import { InputSystem } from "../systems/InputSystem";
import { LevelSystem } from "../systems/LevelSystem";
import { SaveSystem } from "../systems/SaveSystem";
import { UISystem } from "../systems/UISystem";
import { WaveSystem } from "../systems/WaveSystem";
import { WeaponSystem } from "../systems/WeaponSystem";
import { AimMode, GameMode, LevelUpOption, PassiveState, PlayerStats, StageData, WeaponState } from "../types/gameTypes";

export class GameScene extends Phaser.Scene {
  player!: Player;
  private inputSystem!: InputSystem;
  private combat!: CombatSystem;
  private levelSystem!: LevelSystem;
  private waveSystem!: WaveSystem;
  private weaponSystem!: WeaponSystem;
  private companionSystem?: CompanionSystem;
  private evolutionSystem!: EvolutionSystem;
  private bossPatternSystem!: BossPatternSystem;
  private ui!: UISystem;
  private enemies: Enemy[] = [];
  private projectiles: Projectile[] = [];
  private pickups: Pickup[] = [];
  private areaEffects: AreaEffect[] = [];
  private aimGuide?: Phaser.GameObjects.Graphics;
  private boss?: Boss;
  private weaponStates: WeaponState[] = [];
  private passiveStates: PassiveState[] = [];
  private ownedEvolutionIds: string[] = [];
  private characterPassiveLevel = 0;
  private honestHandsStacks = 0;
  private honestHandsUntil = 0;
  private cinderellaDashBoostUntil = 0;
  private aimMode: AimMode = "auto";
  private stage!: StageData;
  private devMode = false;
  private mode: GameMode = "story";
  private startTime = 0;
  private pauseStartedAt?: number;
  private totalPausedMs = 0;
  private kills = 0;
  private levelUpOpen = false;
  private runEnded = false;
  private clearAfterEvolution = false;
  private bossEnrageAnnounced = false;
  private dashUnlockAnnounced = false;

  constructor() {
    super("GameScene");
  }

  create(data: { characterId?: string; stageId?: string; mode?: GameMode }): void {
    this.resetRunState();
    const character = getCharacter(data.characterId ?? "pinocchio");
    SaveSystem.recordCharacterStart(character.id);
    const save = SaveSystem.load();
    this.aimMode = save.aimMode ?? save.settings?.defaultAimMode ?? "auto";
    this.devMode = new URLSearchParams(window.location.search).get("dev") === "1";
    this.mode = data.mode ?? "story";
    this.stage = getStage(data.stageId ?? "topsyTurvyStorybookForest");
    SaveSystem.recordDiscovered("stage", this.stage.id);
    if (!this.devMode && this.mode !== "bossPractice") {
      SaveSystem.recordStageStart(this.stage.id);
    }
    this.physics.world.setBounds(-2200, -2200, 4400, 4400);
    this.cameras.main.setBackgroundColor(this.stage.backgroundColor);
    this.drawStage();

    this.player = new Player(this, 0, 0, character);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setBounds(-2200, -2200, 4400, 4400);
    this.aimGuide = this.add.graphics().setDepth(96);

    this.weaponStates = [{ id: character.baseWeaponId, level: 1 }];
    this.passiveStates = [];
    this.inputSystem = new InputSystem(this);
    this.combat = new CombatSystem(this);
    this.levelSystem = new LevelSystem();
    this.evolutionSystem = new EvolutionSystem();
    this.waveSystem = new WaveSystem(this, this.stage, this.devMode);
    this.weaponSystem = new WeaponSystem(
      this,
      () => this.player,
      () => this.getAllEnemies(),
      () => this.getBaseAttackAim(),
      (projectile) => this.projectiles.push(projectile),
      (area) => this.areaEffects.push(area),
      (enemy, damage, knockback, origin) => this.damageEnemy(enemy, damage, knockback, origin)
    );
    this.companionSystem = new CompanionSystem(
      this,
      this.player,
      () => this.getAllEnemies(),
      () => this.pickups,
      (enemy, damage, knockback, origin) => this.damageEnemy(enemy, damage, knockback, origin),
      (projectile) => this.projectiles.push(projectile)
    );
    this.companionSystem.ensureCoreCompanions();
    this.bossPatternSystem = new BossPatternSystem(this, this.combat);
    this.ui = new UISystem(this);
    this.startTime = this.time.now;
    this.player.ultimateReadyAt = this.getGameplayTime() + (this.devMode ? 10000 : 90000);
    this.events.on("boss-spawn-enemy", (enemyId: string, x: number, y: number) => this.enemies.push(new Enemy(this, x, y, getEnemy(enemyId))));

    this.player.on("fairy-dash", (x: number, y: number) => {
      this.weaponSystem.onFairyDash(this.weaponStates, this.player.stats, x, y, this.getGameplayTime());
      if (this.player.character.passiveId === "midnightFootwork") {
        this.cinderellaDashBoostUntil = this.getGameplayTime() + 2000;
      }
    });
    this.player.on("axe-recovered", (tier: string) => this.applyAxeRecovery(tier));
    this.player.on("ultimate", (x: number, y: number) => this.createUltimateAura(x, y));
    this.input.keyboard!.on("keydown-ESC", () => this.openPauseMenu());
    if (this.devMode) {
      this.registerDevKeys();
    }
    this.rebuildPlayerStats();
    if (this.mode === "bossPractice") {
      this.setupBossPractice();
    }
    if (!this.devMode && !save.tutorialSeen) {
      this.markGameplayPaused();
      this.scene.pause("GameScene");
      this.scene.launch("TutorialScene");
    }
  }

  update(time: number, delta: number): void {
    if (this.runEnded || this.levelUpOpen) {
      return;
    }

    const gameplayTime = this.getGameplayTime(time);
    const elapsedSeconds = gameplayTime / 1000;
    const moveVector = this.inputSystem.getMoveVector();
    this.rebuildPlayerStats(gameplayTime, moveVector.lengthSq() > 0);
    this.player.move(moveVector, gameplayTime);
    if (this.inputSystem.dashPressed()) {
      this.player.tryDash(gameplayTime);
    }
    if (this.inputSystem.ultimatePressed()) {
      if (this.player.tryUltimate(gameplayTime)) {
        this.triggerCharacterUltimate();
      }
    }
    if (this.inputSystem.aimTogglePressed()) {
      this.toggleAimMode();
    }
    this.player.updatePlayer(gameplayTime);
    this.player.regenerate(delta);

    if (this.mode !== "bossPractice") {
      this.waveSystem.update(elapsedSeconds, this.player, (enemy) => this.enemies.push(enemy), (boss) => {
        this.boss = boss;
        this.bossEnrageAnnounced = false;
        this.createBossArrival();
      });
    }

    this.updateEnemies(gameplayTime);
    this.weaponSystem.update(gameplayTime, this.weaponStates, this.player.stats);
    this.updateProjectiles(gameplayTime);
    this.updateAreas(gameplayTime);
    this.updatePickups();
    this.companionSystem?.update(gameplayTime);
    this.bossPatternSystem.update(gameplayTime, this.boss, this.player);
    this.updateBossEnrageAlert();
    this.ui.update(
      this.player,
      this.levelSystem,
      elapsedSeconds,
      this.weaponStates,
      this.passiveStates,
      this.aimMode,
      this.boss,
      this.stage,
      this.devMode,
      this.waveSystem.getBossTimeSeconds()
    );
    this.updateAimGuide();

    if (this.player.hp <= 0) {
      this.finishRun(false);
    }

  }

  getGlassShardMultiplier(): number {
    if (this.player.character.passiveId !== "midnightFootwork") {
      return 1;
    }
    return this.getGameplayTime() < this.cinderellaDashBoostUntil ? 1.2 + this.characterPassiveLevel * 0.06 : 1;
  }

  chooseLevelUpOption(option: LevelUpOption): void {
    if (option.type === "heal") {
      this.player.heal(30);
    } else if (option.type === "characterPassive") {
      this.characterPassiveLevel += 1;
    } else if (option.type === "evolution" && option.evolutionId) {
      this.applyEvolution(option.evolutionId);
    } else {
      this.levelSystem.applyOption(option, this.weaponStates, this.passiveStates);
      if (!this.devMode && this.mode !== "bossPractice") {
        SaveSystem.recordDiscovered(option.type === "weapon" ? "weapon" : "passive", option.id);
      }
    }
    this.rebuildPlayerStats();
    this.levelUpOpen = false;
    this.markGameplayResumed();
    this.scene.resume("GameScene");
    if (this.clearAfterEvolution) {
      this.clearAfterEvolution = false;
      this.finishRun(true);
      return;
    }
    this.time.delayedCall(1, () => this.openNextLevelUpIfNeeded());
  }

  private rebuildPlayerStats(time = this.getGameplayTime(), isMoving = false): void {
    const character = this.player.character;
    const stats: PlayerStats = {
      maxHp: character.maxHp,
      moveSpeed: 210 * character.moveSpeed,
      attackMultiplier: character.attackMultiplier,
      attackSpeed: character.attackSpeed + (this.levelSystem.level - 1) * 0.015,
      critChance: character.critChance,
      critDamage: character.critDamage ?? 2,
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

    if (character.passiveId === "growingWoodenHeart") {
      stats.attackSpeed += this.characterPassiveLevel * 0.06;
    }
    if (character.passiveId === "honestHands" && time < this.honestHandsUntil) {
      const levelBonus = 1 + this.characterPassiveLevel * 0.25;
      stats.moveSpeed *= 1 + this.honestHandsStacks * 0.04 * levelBonus;
      stats.attackMultiplier += this.honestHandsStacks * 0.03 * levelBonus;
    }
    if (character.passiveId === "midnightFootwork" && isMoving) {
      stats.attackSpeed += 0.1 + this.characterPassiveLevel * 0.02;
    }
    if (character.passiveId === "oniIslandBanner" && this.companionSystem) {
      this.companionSystem.passiveLevel = this.characterPassiveLevel;
    }

    const meta = SaveSystem.load().metaUpgrades ?? {};
    stats.maxHpMultiplier += (meta.meta_max_hp ?? 0) * 0.06;
    stats.attackMultiplier += (meta.meta_attack ?? 0) * 0.04;
    stats.attackSpeed += (meta.meta_attack_speed ?? 0) * 0.035;
    stats.moveSpeedBonus += (meta.meta_move_speed ?? 0) * 0.035;
    stats.damageReduction += (meta.meta_defense ?? 0) * 0.025;
    stats.critChance += (meta.meta_crit_chance ?? 0) * 0.015;
    stats.critDamage += (meta.meta_crit_damage ?? 0) * 0.06;
    stats.expGain += (meta.meta_exp_gain ?? 0) * 0.06;
    stats.pickupRange += (meta.meta_pickup_range ?? 0) * 18;
    stats.currencyGain += (meta.meta_currency_gain ?? 0) * 0.08;
    stats.luck += (meta.meta_luck ?? 0) * 0.04;
    stats.cooldownReduction += (meta.meta_ultimate_charge ?? 0) * 0.05;
    stats.dashCooldownReduction += (meta.meta_dash_cooldown ?? 0) * 0.04;
    stats.hpRegenPerSecond += (meta.meta_hp_regen ?? 0) * 0.08;

    for (const state of this.passiveStates) {
      const passive = getPassive(state.id);
      const level = passive.levels[state.level - 1];
      stats.attackSpeed += level.attackSpeedBonus ?? 0;
      stats.attackMultiplier += level.attackMultiplierBonus ?? 0;
      stats.incomingDamageMultiplier += level.incomingDamageIncrease ?? 0;
      stats.damageReduction += level.damageReduction ?? 0;
      stats.expGain += level.expGainBonus ?? 0;
      stats.critChance += level.critChanceBonus ?? 0;
      stats.critDamage += level.critDamageBonus ?? 0;
      stats.cooldownReduction += level.cooldownReduction ?? 0;
      stats.maxHpMultiplier += level.maxHpMultiplierBonus ?? 0;
      stats.hpRegenPerSecond += level.hpRegenBonus ?? 0;
      stats.moveSpeedBonus += level.moveSpeedBonus ?? 0;
      stats.evasionChance += level.evasionChanceBonus ?? 0;
      stats.luck += level.luckBonus ?? 0;
      stats.currencyGain += level.currencyGainBonus ?? 0;
      stats.healingMultiplier += level.healingMultiplierBonus ?? 0;
      stats.movingDamageBonus += level.movingDamageBonus ?? 0;
      stats.summonDamageMultiplier *= level.summonDamageMultiplier ?? 1;
      stats.summonAttackSpeedMultiplier *= level.summonAttackSpeedMultiplier ?? 1;
      stats.summonDurationMultiplier *= level.summonDurationMultiplier ?? 1;
      stats.temporaryAllyDurationMultiplier *= level.temporaryAllyDurationMultiplier ?? 1;
      stats.enemySlowAura = Math.max(stats.enemySlowAura, level.enemySlowAura ?? 0);
    }

    stats.maxHp = Math.round(stats.maxHp * stats.maxHpMultiplier);
    stats.moveSpeed *= 1 + stats.moveSpeedBonus;
    if (isMoving) {
      stats.attackMultiplier += stats.movingDamageBonus;
    }
    stats.damageReduction = Phaser.Math.Clamp(stats.damageReduction, 0, 0.75);
    stats.cooldownReduction = Phaser.Math.Clamp(stats.cooldownReduction, 0, 0.65);
    stats.evasionChance = Phaser.Math.Clamp(stats.evasionChance, 0, 0.5);
    this.player.hp = Math.min(this.player.hp, stats.maxHp);
    this.player.stats = stats;
    this.player.level = this.levelSystem.level;
    const wasDashUnlocked = this.player.dashUnlocked;
    this.player.dashUnlocked = this.levelSystem.level >= 7;
    if (!wasDashUnlocked && this.player.dashUnlocked && !this.dashUnlockAnnounced) {
      this.dashUnlockAnnounced = true;
      this.showCenterAlert("Fairy Dash Unlocked!\nPress Space or Shift to dash.", 0x80deea);
    }
  }

  private updateEnemies(time: number): void {
    const playerPosition = new Phaser.Math.Vector2(this.player.x, this.player.y);
    for (const enemy of this.getAllEnemies()) {
      if (!enemy.active) {
        continue;
      }
      enemy.updateChase(playerPosition);
      if (this.player.stats.enemySlowAura > 0 && Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y) < 210) {
        enemy.setVelocity(enemy.body.velocity.x * (1 - this.player.stats.enemySlowAura), enemy.body.velocity.y * (1 - this.player.stats.enemySlowAura));
      }
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
          if (projectile.sourceId === "glassShards") {
            this.areaEffects.push(new AreaEffect(this, enemy.x, enemy.y, 38, 7, "glassShardBurst", 0xb3e5fc, 160, 80, 4));
          }
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
        const leveled = this.levelSystem.addExp(pickup.expValue * (this.devMode ? 5 : 1), this.player.stats.expGain);
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
      if (this.mode === "freeSurvival") {
        this.boss = undefined;
        this.waveSystem.resumeAfterBoss();
        this.showCenterAlert("Survival continues!", 0x80deea);
        return;
      }
      if (this.openEvolutionChest()) {
        this.clearAfterEvolution = true;
        return;
      }
      this.finishRun(true);
      return;
    }

    this.kills += 1;
    if (this.player.character.passiveId === "oniIslandBanner" && Math.random() < 0.05 + this.characterPassiveLevel * 0.015) {
      this.companionSystem?.spawnTemporaryAlly(enemy.x, enemy.y, this.getGameplayTime());
    }
    this.pickups.push(new Pickup(this, enemy.x, enemy.y, enemy.dataDef.expDrop));
    if (enemy.isElite) {
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
      if (!this.openEvolutionChest()) {
        this.levelSystem.pendingLevelUps += 1;
        this.openNextLevelUpIfNeeded();
      }
    }
    enemy.destroy();
  }

  private openNextLevelUpIfNeeded(): void {
    if (this.levelUpOpen || this.runEnded || !this.levelSystem.consumeLevelUp()) {
      return;
    }
    this.levelUpOpen = true;
    this.rebuildPlayerStats();
    const language = SaveSystem.load().settings?.language ?? "en";
    const options = this.levelSystem.generateOptions(
      this.weaponStates,
      this.passiveStates,
      language,
      this.player.character.baseWeaponId,
      this.characterPassiveLevel,
      this.player.character.passiveId
    );
    this.markGameplayPaused();
    this.scene.pause("GameScene");
    this.scene.launch("LevelUpScene", { options, level: this.levelSystem.level });
  }

  private openEvolutionChest(): boolean {
    if (this.levelUpOpen || this.runEnded) {
      return false;
    }
    const candidates = this.evolutionSystem.getAvailableEvolutions({
      characterId: this.player.character.id,
      weaponStates: this.weaponStates,
      passiveStates: this.passiveStates,
      ownedEvolutionIds: this.ownedEvolutionIds
    });
    if (candidates.length === 0) {
      return false;
    }
    this.levelUpOpen = true;
    const language = SaveSystem.load().settings?.language ?? "en";
    const options = this.evolutionSystem.toOptions(candidates, language);
    this.markGameplayPaused();
    this.scene.pause("GameScene");
    this.scene.launch("LevelUpScene", { options, level: this.levelSystem.level, title: "Evolution Available!" });
    return true;
  }

  private applyEvolution(evolutionId: string): void {
    const evolution = this.evolutionSystem.getEvolution(evolutionId);
    if (!evolution || this.ownedEvolutionIds.includes(evolutionId)) {
      return;
    }
    const resultWeaponId = evolution.resultWeaponId;
    if (evolution.type === "special_combo") {
      if (!this.weaponStates.some((state) => state.id === resultWeaponId)) {
        this.weaponStates.push({ id: resultWeaponId, level: 1 });
      }
    } else {
      const sourceWeaponId = evolution.requiredBaseWeaponId ?? evolution.requiredWeaponIds?.[0];
      const source = this.weaponStates.find((state) => state.id === sourceWeaponId);
      if (source) {
        source.id = resultWeaponId;
        source.level = 1;
      } else {
        this.weaponStates.push({ id: resultWeaponId, level: 1 });
      }
    }
    this.ownedEvolutionIds.push(evolutionId);
    if (!this.devMode && this.mode !== "bossPractice") {
      SaveSystem.recordEvolution(evolutionId, evolution.type === "special_combo" ? "combo" : "evolution");
      SaveSystem.recordDiscovered("weapon", resultWeaponId);
    }
    this.showEvolutionBurst(evolution.name.en);
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
    const survivalTime = this.getGameplayTime() / 1000;
    const currencyEarned = Math.round(
      (Math.max(1, Math.floor(this.kills / 8)) + (clear ? 25 : 0)) *
        this.player.stats.currencyGain *
        (1 + this.player.stats.luck * 0.25)
    );
    const runRecord = SaveSystem.recordRun({
      characterId: this.player.character.id,
      stageId: this.stage.id,
      survivalTime,
      level: this.levelSystem.level,
      kills: this.kills,
      clear,
      bossId: this.boss?.bossDef.id,
      currencyEarned,
      devMode: this.devMode,
      mode: this.mode
    });
    this.scene.start("ResultScene", {
      characterId: this.player.character.id,
      stageId: this.stage.id,
      clear,
      survivalTime,
      kills: this.kills,
      level: this.levelSystem.level,
      currencyEarned,
      devMode: this.devMode,
      mode: this.mode,
      achievementsUnlocked: runRecord.achievementsUnlocked
    });
  }

  private toggleAimMode(): void {
    this.aimMode = this.aimMode === "auto" ? "cursor" : "auto";
    SaveSystem.setAimMode(this.aimMode);
    if (this.aimMode === "auto") {
      this.aimGuide?.clear();
    }
  }

  private getBaseAttackAim(): { mode: AimMode; direction: Phaser.Math.Vector2; target?: Enemy } {
    if (this.aimMode === "auto") {
      const target = this.findPriorityTarget();
      if (target) {
        return {
          mode: "auto",
          target,
          direction: new Phaser.Math.Vector2(target.x - this.player.x, target.y - this.player.y).normalize()
        };
      }
    }
    return {
      mode: this.aimMode,
      direction: this.getCursorDirection()
    };
  }

  private findPriorityTarget(): Enemy | undefined {
    const enemies = this.getAllEnemies().filter((enemy) => enemy.active && enemy.hp > 0);
    const boss = enemies
      .filter((enemy) => enemy instanceof Boss)
      .sort((a, b) => Phaser.Math.Distance.Between(this.player.x, this.player.y, a.x, a.y) - Phaser.Math.Distance.Between(this.player.x, this.player.y, b.x, b.y))[0];
    if (boss) {
      return boss;
    }
    const elite = enemies
      .filter((enemy) => enemy.isElite)
      .sort((a, b) => Phaser.Math.Distance.Between(this.player.x, this.player.y, a.x, a.y) - Phaser.Math.Distance.Between(this.player.x, this.player.y, b.x, b.y))[0];
    if (elite) {
      return elite;
    }
    return enemies.sort(
      (a, b) =>
        Phaser.Math.Distance.Between(this.player.x, this.player.y, a.x, a.y) -
        Phaser.Math.Distance.Between(this.player.x, this.player.y, b.x, b.y)
    )[0];
  }

  private getCursorDirection(): Phaser.Math.Vector2 {
    const pointer = this.input.activePointer;
    const camera = this.cameras.main;
    const worldPoint = camera.getWorldPoint(pointer.x, pointer.y);
    const direction = new Phaser.Math.Vector2(worldPoint.x - this.player.x, worldPoint.y - this.player.y);
    if (!Number.isFinite(direction.x) || !Number.isFinite(direction.y) || direction.lengthSq() === 0) {
      return this.player.lastMoveDirection.clone().normalize();
    }
    return direction.normalize();
  }

  private applyAxeRecovery(tier: string): void {
    if (this.player.character.passiveId !== "honestHands") {
      return;
    }
    this.honestHandsStacks = Math.min(5, this.honestHandsStacks + 1);
    this.honestHandsUntil = this.getGameplayTime() + 4000;
    const color = tier === "golden" ? "#ffd54f" : tier === "silver" ? "#cfd8dc" : "#a1887f";
    const text = this.add.text(this.player.x, this.player.y - 52, `Catch! x${this.honestHandsStacks}`, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "18px",
      color,
      stroke: "#ffffff",
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(90);
    this.tweens.add({ targets: text, y: text.y - 28, alpha: 0, duration: 700, onComplete: () => text.destroy() });
  }

  private triggerCharacterUltimate(): void {
    const ultimateId = this.player.character.ultimateId;
    if (ultimateId === "honestAxeStorm") {
      this.castHonestAxeStorm();
    } else if (ultimateId === "pumpkinCarriageParade") {
      this.castPumpkinCarriageParade();
    } else if (ultimateId === "oniIslandExpedition") {
      this.companionSystem?.activateExpedition(this.getGameplayTime());
      this.castPeachBurst();
    }
  }

  private castHonestAxeStorm(): void {
    const baseDirection = this.player.lastMoveDirection.clone().normalize();
    const textures = ["projectile-golden-axe", "projectile-silver-axe", "projectile-old-axe"];
    for (let i = 0; i < 15; i += 1) {
      this.time.delayedCall(i * 45, () => {
        const direction = baseDirection.clone().rotate((i - 7) * 0.09);
        this.projectiles.push(
          new Projectile(
            this,
            this.player.x + direction.x * 26,
            this.player.y + direction.y * 26,
            Phaser.Utils.Array.GetRandom(textures),
            42,
            "honestAxeStorm",
            direction.scale(620),
            1200
          )
        );
      });
    }
  }

  private castPumpkinCarriageParade(): void {
    const passes = [
      { x: this.player.x - 520, y: this.player.y - 160, vx: 1060, vy: 0, horizontal: true },
      { x: this.player.x + 520, y: this.player.y, vx: -1060, vy: 0, horizontal: true },
      { x: this.player.x, y: this.player.y - 360, vx: 0, vy: 760, horizontal: false },
      { x: this.player.x - 160, y: this.player.y + 360, vx: 0, vy: -760, horizontal: false }
    ];
    passes.forEach((pass, index) => {
      this.time.delayedCall(index * 260, () => {
        const carriage = this.add.rectangle(pass.x, pass.y, pass.horizontal ? 150 : 80, pass.horizontal ? 80 : 150, 0xffa43f, 0.86)
          .setStrokeStyle(5, 0xffffff)
          .setDepth(58);
        this.tweens.add({
          targets: carriage,
          x: pass.x + pass.vx,
          y: pass.y + pass.vy,
          duration: 850,
          onComplete: () => carriage.destroy()
        });
        this.damageCarriageLane(pass.x, pass.y, pass.horizontal);
      });
    });
  }

  private damageCarriageLane(x: number, y: number, horizontal: boolean): void {
    for (const enemy of this.getAllEnemies()) {
      if (!enemy.active) {
        continue;
      }
      const inLane = horizontal
        ? Math.abs(enemy.y - y) < 78 && Math.abs(enemy.x - x) < 620
        : Math.abs(enemy.x - x) < 78 && Math.abs(enemy.y - y) < 460;
      if (inLane) {
        this.damageEnemy(enemy, 64, 46, { x, y });
      }
    }
  }

  private castPeachBurst(): void {
    for (let i = 0; i < 10; i += 1) {
      const angle = i * (Math.PI * 2 / 10);
      const direction = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle));
      this.projectiles.push(
        new Projectile(
          this,
          this.player.x,
          this.player.y,
          "projectile-peach-wave",
          28,
          "oniIslandExpedition",
          direction.scale(470),
          1300
        )
      );
    }
  }

  private showEvolutionBurst(name: string): void {
    const overlay = this.add.rectangle(this.player.x, this.player.y, 1280, 720, 0xfff7d6, 0.34).setDepth(120);
    const title = this.add.text(this.player.x, this.player.y - 92, "Evolution!", {
      fontFamily: "Georgia, serif",
      fontSize: "48px",
      color: "#2d4b5b",
      stroke: "#fff176",
      strokeThickness: 7
    }).setOrigin(0.5).setDepth(121);
    const text = this.add.text(this.player.x, this.player.y - 32, name, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "28px",
      color: "#ffffff",
      stroke: "#4f9cab",
      strokeThickness: 6
    }).setOrigin(0.5).setDepth(121);
    for (let i = 0; i < 18; i += 1) {
      const star = this.add.star(
        this.player.x + Phaser.Math.Between(-220, 220),
        this.player.y + Phaser.Math.Between(-150, 150),
        5,
        5,
        16,
        Phaser.Utils.Array.GetRandom([0xfff176, 0x80deea, 0xffab91]),
        0.9
      ).setDepth(121);
      this.tweens.add({ targets: star, scale: 1.8, alpha: 0, duration: 950, onComplete: () => star.destroy() });
    }
    this.tweens.add({
      targets: [overlay, title, text],
      alpha: 0,
      duration: 1200,
      delay: 550,
      onComplete: () => {
        overlay.destroy();
        title.destroy();
        text.destroy();
      }
    });
  }

  private drawStage(): void {
    const palette = this.stage.colorPalette ?? { background: 0xb4ee81, ground: 0x8edb74, accent: 0xc88955 };
    this.add.rectangle(0, 0, 4400, 4400, palette.ground).setDepth(-20);
    for (let i = 0; i < 34; i += 1) {
      const x = -2000 + Math.random() * 4000;
      const y = -2000 + Math.random() * 4000;
      this.add.circle(x, y, Phaser.Math.Between(10, 22), Phaser.Utils.Array.GetRandom([palette.background, palette.accent, 0xffffff]), 0.58).setDepth(-15);
    }
    for (let i = 0; i < 16; i += 1) {
      const x = -2000 + Math.random() * 4000;
      const y = -2000 + Math.random() * 4000;
      this.add.rectangle(x, y, 86, 32, palette.background, 0.72).setRotation(Math.random() * 0.6 - 0.3).setDepth(-12);
    }
    this.add.rectangle(0, 0, 4400, 140, palette.accent, 0.28).setDepth(-16);
    this.add.rectangle(0, 0, 140, 4400, palette.accent, 0.22).setDepth(-16);
  }

  private createBossArrival(): void {
    const text = this.add.text(this.player.x, this.player.y - 210, `${this.boss?.bossDef.name.en ?? "Boss"} appears!`, {
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

  private registerDevKeys(): void {
    this.input.keyboard!.on("keydown-B", () => this.devSpawnBoss());
    this.input.keyboard!.on("keydown-E", () => this.enemies.push(this.waveSystem.spawnEliteNow(this.player)));
    this.input.keyboard!.on("keydown-U", () => {
      this.player.readyUltimateNow();
      this.showDevToast("Ultimate ready");
    });
    this.input.keyboard!.on("keydown-F5", (event: KeyboardEvent) => {
      event.preventDefault();
      this.devMaxCurrentLoadout();
    });
    this.input.keyboard!.on("keydown-F6", (event: KeyboardEvent) => {
      event.preventDefault();
      this.devGrantPassivePack();
    });
    this.input.keyboard!.on("keydown-F7", (event: KeyboardEvent) => {
      event.preventDefault();
      this.devPrepareEvolution(false);
    });
    this.input.keyboard!.on("keydown-F8", (event: KeyboardEvent) => {
      event.preventDefault();
      this.devPrepareEvolution(true);
    });
    ["ONE", "TWO", "THREE", "FOUR"].forEach((key, index) => {
      this.input.keyboard!.on(`keydown-${key}`, (event: KeyboardEvent) => {
        if (event.shiftKey) {
          this.scene.restart({ characterId: this.player.character.id, stageId: stages[index].id });
        }
      });
    });
  }

  private devSpawnBoss(): void {
    if (this.boss?.active) {
      return;
    }
    this.boss = this.waveSystem.spawnBossNow(this.player);
    this.bossEnrageAnnounced = false;
    this.createBossArrival();
  }

  private devMaxCurrentLoadout(): void {
    for (const state of this.weaponStates) {
      state.level = getWeapon(state.id).maxLevel;
    }
    for (const state of this.passiveStates) {
      state.level = getPassive(state.id).maxLevel;
    }
    this.rebuildPlayerStats();
    this.showDevToast("Current loadout maxed");
  }

  private devGrantPassivePack(): void {
    for (const passive of passives) {
      if (this.passiveStates.length >= 6) {
        break;
      }
      if (!this.passiveStates.some((state) => state.id === passive.id)) {
        this.passiveStates.push({ id: passive.id, level: passive.maxLevel });
      }
    }
    this.rebuildPlayerStats();
    this.showDevToast("Passive pack granted");
  }

  private devPrepareEvolution(preferCombo: boolean): void {
    const candidate = evolutions.find((evolution) => {
      if (this.ownedEvolutionIds.includes(evolution.id)) {
        return false;
      }
      if (preferCombo && evolution.type !== "special_combo") {
        return false;
      }
      if (!preferCombo && evolution.requiredCharacterId && evolution.requiredCharacterId !== this.player.character.id) {
        return false;
      }
      return !evolution.requiredCharacterId || evolution.requiredCharacterId === this.player.character.id || preferCombo;
    }) ?? evolutions.find((evolution) => !this.ownedEvolutionIds.includes(evolution.id));
    if (!candidate) {
      this.showDevToast("No evolution candidate");
      return;
    }
    const requiredWeaponIds = new Set([...(candidate.requiredWeaponIds ?? [])]);
    if (candidate.requiredBaseWeaponId) {
      requiredWeaponIds.add(candidate.requiredBaseWeaponId);
    }
    for (const weaponId of requiredWeaponIds) {
      const weapon = getWeapon(weaponId);
      const current = this.weaponStates.find((state) => state.id === weaponId);
      if (current) {
        current.level = weapon.maxLevel;
      } else {
        this.weaponStates.push({ id: weaponId, level: weapon.maxLevel });
      }
    }
    for (const passiveId of candidate.requiredPassiveIds ?? []) {
      const passive = getPassive(passiveId);
      const current = this.passiveStates.find((state) => state.id === passiveId);
      if (current) {
        current.level = passive.maxLevel;
      } else {
        this.passiveStates.push({ id: passiveId, level: passive.maxLevel });
      }
    }
    this.rebuildPlayerStats();
    if (!this.openEvolutionChest()) {
      this.showDevToast(`${candidate.name.en} prepared`);
    }
  }

  private showDevToast(message: string): void {
    const text = this.add.text(this.player.x, this.player.y - 120, `DEV: ${message}`, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "22px",
      color: "#c62828",
      stroke: "#ffffff",
      strokeThickness: 5
    }).setOrigin(0.5).setDepth(130);
    this.tweens.add({ targets: text, y: text.y - 38, alpha: 0, duration: 900, onComplete: () => text.destroy() });
  }

  private updateAimGuide(): void {
    if (!this.aimGuide) {
      return;
    }
    this.aimGuide.clear();
    if (this.aimMode !== "cursor" || this.runEnded || this.levelUpOpen) {
      return;
    }
    const direction = this.getCursorDirection();
    const startX = this.player.x;
    const startY = this.player.y;
    const endX = startX + direction.x * 92;
    const endY = startY + direction.y * 92;
    this.aimGuide.lineStyle(5, 0x80deea, 0.44);
    this.aimGuide.lineBetween(startX, startY, endX, endY);
    this.aimGuide.lineStyle(2, 0xffffff, 0.82);
    this.aimGuide.strokeCircle(endX, endY, 13);
    this.aimGuide.fillStyle(0xfff176, 0.72);
    this.aimGuide.fillCircle(endX, endY, 4);
  }

  private updateBossEnrageAlert(): void {
    if (!this.boss?.active || this.bossEnrageAnnounced || this.boss.hp / this.boss.maxHp > 0.5) {
      return;
    }
    this.bossEnrageAnnounced = true;
    this.showCenterAlert(`${this.boss.bossDef.name.en} speeds up!`, 0xff8a65);
    this.cameras.main.flash(240, 255, 241, 118, false);
  }

  private showCenterAlert(message: string, color: number): void {
    const width = Math.min(780, 340 + message.length * 8);
    const ribbon = this.add.rectangle(this.player.x, this.player.y - 142, width, 82, color, 0.34)
      .setStrokeStyle(3, 0xffffff, 0.86)
      .setDepth(131);
    const text = this.add.text(this.player.x, this.player.y - 142, message, {
      fontFamily: "Verdana, sans-serif",
      fontSize: "28px",
      color: "#ffffff",
      align: "center",
      stroke: "#2d4b5b",
      strokeThickness: 6
    }).setOrigin(0.5).setDepth(132);
    this.tweens.add({
      targets: [text, ribbon],
      y: "-=38",
      alpha: 0,
      duration: 1450,
      delay: 650,
      onComplete: () => {
        text.destroy();
        ribbon.destroy();
      }
    });
  }

  private openPauseMenu(): void {
    if (this.runEnded || this.levelUpOpen) {
      return;
    }
    this.aimGuide?.clear();
    this.markGameplayPaused();
    this.scene.pause("GameScene");
    this.scene.launch("PauseScene", {
      characterId: this.player.character.id,
      stageId: this.stage.id,
      mode: this.mode
    });
  }

  private setupBossPractice(): void {
    this.levelSystem.level = 12;
    const base = this.weaponStates[0];
    if (base) {
      base.level = Math.min(5, getWeapon(base.id).maxLevel);
    }
    const commonWeapons = weapons.filter((weapon) => !weapon.isCharacterBase && !weapon.evolved && !weapon.combo).slice(0, 2);
    for (const weapon of commonWeapons) {
      if (!this.weaponStates.some((state) => state.id === weapon.id)) {
        this.weaponStates.push({ id: weapon.id, level: Math.min(3, weapon.maxLevel) });
      }
    }
    for (const passive of passives.slice(0, 2)) {
      if (!this.passiveStates.some((state) => state.id === passive.id)) {
        this.passiveStates.push({ id: passive.id, level: Math.min(2, passive.maxLevel) });
      }
    }
    this.player.readyUltimateNow();
    this.player.dashUnlocked = true;
    this.rebuildPlayerStats();
    this.time.delayedCall(900, () => this.devSpawnBoss());
    this.showCenterAlert("Boss Practice", 0xfff176);
  }

  private resetRunState(): void {
    this.enemies = [];
    this.projectiles = [];
    this.pickups = [];
    this.areaEffects = [];
    this.weaponStates = [];
    this.passiveStates = [];
    this.ownedEvolutionIds = [];
    this.aimGuide?.destroy();
    this.aimGuide = undefined;
    this.boss = undefined;
    this.characterPassiveLevel = 0;
    this.honestHandsStacks = 0;
    this.honestHandsUntil = 0;
    this.cinderellaDashBoostUntil = 0;
    this.kills = 0;
    this.levelUpOpen = false;
    this.runEnded = false;
    this.clearAfterEvolution = false;
    this.bossEnrageAnnounced = false;
    this.dashUnlockAnnounced = false;
    this.pauseStartedAt = undefined;
    this.totalPausedMs = 0;
  }

  public markGameplayPaused(): void {
    if (this.pauseStartedAt === undefined) {
      this.pauseStartedAt = this.time.now;
    }
  }

  public markGameplayResumed(): void {
    if (this.pauseStartedAt !== undefined) {
      this.totalPausedMs += this.time.now - this.pauseStartedAt;
      this.pauseStartedAt = undefined;
    }
  }

  private getGameplayTime(time = this.time.now): number {
    const activePauseMs = this.pauseStartedAt === undefined ? 0 : time - this.pauseStartedAt;
    return Math.max(0, time - this.startTime - this.totalPausedMs - activePauseMs);
  }
}
