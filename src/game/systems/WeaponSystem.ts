import Phaser from "phaser";
import { getWeapon } from "../data/weapons";
import { AreaEffect } from "../entities/AreaEffect";
import { Enemy } from "../entities/Enemy";
import { Player } from "../entities/Player";
import { Projectile } from "../entities/Projectile";
import { AimMode, PlayerStats, WeaponState } from "../types/gameTypes";

type DamageEnemyCallback = (enemy: Enemy, damage: number, knockback?: number, origin?: { x: number; y: number }) => void;
type AxeTier = "old" | "silver" | "golden";
type AimInfo = { mode: AimMode; direction: Phaser.Math.Vector2; target?: Enemy };

interface AxeRecovery {
  marker: Phaser.GameObjects.Graphics;
  x: number;
  y: number;
  radius: number;
  tier: AxeTier;
  expiresAt: number;
}

export class WeaponSystem {
  private cooldowns = new Map<string, number>();
  private lastPlayerPosition = new Phaser.Math.Vector2();
  private movementDistance = 0;
  private axeRecoveries: AxeRecovery[] = [];

  constructor(
    private scene: Phaser.Scene,
    private getPlayer: () => Player,
    private getEnemies: () => Enemy[],
    private getAimInfo: () => AimInfo,
    private spawnProjectile: (projectile: Projectile) => void,
    private spawnArea: (area: AreaEffect) => void,
    private damageEnemy: DamageEnemyCallback
  ) {}

  update(time: number, weaponStates: WeaponState[], stats: PlayerStats): void {
    const player = this.getPlayer();
    if (this.lastPlayerPosition.lengthSq() === 0) {
      this.lastPlayerPosition.set(player.x, player.y);
    }
    this.updateAxeRecoveries(time);
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
      } else if (state.id === "oldAxe") {
        this.fireOldAxe(state.level);
      } else if (state.id === "glassShards") {
        this.fireGlassShards(state.level);
      } else if (state.id === "peachBlade") {
        this.firePeachBlade(state.level);
      } else if (state.id === "matchGirlsMatch") {
        this.fireAreaWeapon(state.id, 0xffa23f, state.level, stats);
      } else if (state.id === "sleepingBriarRose") {
        this.fireAreaWeapon(state.id, 0xff7fbd, state.level, stats);
      } else if (state.id === "hanselsBreadcrumb") {
        this.fireProjectileWeapon(state.id, "projectile-breadcrumb", state.level, stats, state.level >= 5 ? 0.08 : 0.035);
      } else if (state.id === "redRidingHoodsBasket") {
        const textures = ["projectile-apple", "projectile-bread", "projectile-bottle"];
        this.fireProjectileWeapon(state.id, Phaser.Utils.Array.GetRandom(textures), state.level, stats, 0.01);
      } else if (state.id === "jacksBeanstalk") {
        this.fireDelayedArea(state.id, 0x6bd36b, state.level, 480);
      } else if (state.id === "rapunzelsHair") {
        this.fireLineArea(state.id, 0xffd966, state.level);
      } else if (state.id === "mermaidsBubble") {
        this.fireProjectileWeapon(state.id, "projectile-bubble", state.level, stats, 0);
      } else if (state.id === "beastsRose") {
        this.fireOrbitArea(state.id, 0xff7fbd, state.level, time);
      } else if (state.id === "bremenChorus") {
        this.firePulseArea(state.id, 0x80deea, state.level);
      } else if (state.id === "magicMirrorShard") {
        this.fireProjectileWeapon(state.id, "projectile-mirror", state.level, stats, 0.025);
      } else if (state.id === "ruyiJinguBang") {
        this.fireLineArea(state.id, 0xffd54f, state.level);
      } else if (state.id === "heungbusGourdSeed") {
        this.fireDelayedArea(state.id, 0xa5d66d, state.level, 760);
      } else if (state.id === "goblinClub") {
        this.fireDelayedArea(state.id, 0xc58b4d, state.level, 350);
      } else if (state.id === "simcheongsLotus") {
        this.fireLotus(state.level);
      } else if (weapon.evolved || weapon.combo) {
        this.fireEvolutionWeapon(state.id, time);
      }
    }
  }

  onFairyDash(weaponStates: WeaponState[], stats: PlayerStats, x: number, y: number): void {
    const boots = weaponStates.find((state) => state.id === "pussInBootsBoots");
    const robe = weaponStates.find((state) => state.id === "fairyRobe");
    if (robe) {
      const level = getWeapon("fairyRobe").levels[robe.level - 1];
      const count = level.count ?? 1;
      for (let i = 0; i < count; i += 1) {
        this.scene.time.delayedCall(i * 70, () => {
          this.spawnArea(new AreaEffect(this.scene, x, y, level.size, level.damage, "fairyRobe", 0xb3e5fc, 420, 180, 14));
        });
      }
      if (robe.level >= 5) {
        this.getPlayer().invulnerableUntil = Math.max(this.getPlayer().invulnerableUntil, this.scene.time.now + 420);
      }
    }
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
    const aim = this.getAimInfo();
    const target = aim.target ?? this.findNearest(level.range);
    const direction = aim.mode === "cursor" ? aim.direction.clone() : target ? new Phaser.Math.Vector2(target.x - player.x, target.y - player.y).normalize() : aim.direction.clone();
    if (!target && aim.mode === "auto") {
      return;
    }
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

  private fireOldAxe(levelNumber: number): void {
    const player = this.getPlayer();
    const level = getWeapon("oldAxe").levels[levelNumber - 1];
    const aim = this.getAimInfo();
    const target = aim.target ?? this.findNearest(level.range);
    const direction = aim.mode === "cursor" ? aim.direction.clone() : target ? new Phaser.Math.Vector2(target.x - player.x, target.y - player.y).normalize() : aim.direction.clone();
    if (!target && aim.mode === "auto") {
      return;
    }
    const distance = target ? Phaser.Math.Distance.Between(player.x, player.y, target.x, target.y) : Number.MAX_SAFE_INTEGER;
    if (distance < 145) {
      this.spawnArea(new AreaEffect(this.scene, player.x + direction.x * 82, player.y + direction.y * 82, level.size, level.damage, "oldAxe", 0x8bc34a, 170, 90, 22));
      return;
    }

    const tier = this.rollAxeTier();
    const texture = tier === "golden" ? "projectile-golden-axe" : tier === "silver" ? "projectile-silver-axe" : "projectile-old-axe";
    const tierDamage = tier === "golden" ? 1.65 : tier === "silver" ? 1.3 : 1;
    this.spawnProjectile(
      new Projectile(
        this.scene,
        player.x + direction.x * 20,
        player.y + direction.y * 20,
        texture,
        level.damage * tierDamage,
        "oldAxe",
        direction.clone().scale(level.speed ?? 380),
        1450,
        target,
        0.015
      )
    );
    this.scene.time.delayedCall(540, () => this.createAxeRecovery(player, direction.clone(), tier, levelNumber));
  }

  private fireGlassShards(levelNumber: number): void {
    const player = this.getPlayer();
    const level = getWeapon("glassShards").levels[levelNumber - 1];
    const count = level.count ?? 1;
    const damageMultiplier = (this.scene as any).getGlassShardMultiplier?.() ?? 1;
    for (let i = 0; i < count; i += 1) {
      const aim = this.getAimInfo();
      const target = aim.target ?? this.findNearest(level.range);
      if (!target && aim.mode === "auto") {
        return;
      }
      const direction = (aim.mode === "cursor" ? aim.direction.clone() : target ? new Phaser.Math.Vector2(target.x - player.x, target.y - player.y).normalize() : aim.direction.clone())
        .rotate((i - (count - 1) / 2) * 0.18);
      this.spawnProjectile(
        new Projectile(
          this.scene,
          player.x + direction.x * 18,
          player.y + direction.y * 18,
          "projectile-glass",
          level.damage * damageMultiplier,
          "glassShards",
          direction.clone().scale(level.speed ?? 480),
          1700,
          target,
          0.06
        )
      );
    }
  }

  private firePeachBlade(levelNumber: number): void {
    const player = this.getPlayer();
    const level = getWeapon("peachBlade").levels[levelNumber - 1];
    const aim = this.getAimInfo();
    const target = aim.target ?? this.findNearest(level.range);
    const direction = aim.mode === "cursor" ? aim.direction.clone() : target ? new Phaser.Math.Vector2(target.x - player.x, target.y - player.y).normalize() : aim.direction.clone();
    if (!target && aim.mode === "auto") {
      return;
    }
    const impactX = player.x + direction.x * Math.min(level.range, 96);
    const impactY = player.y + direction.y * Math.min(level.range, 96);
    this.spawnArea(new AreaEffect(this.scene, impactX, impactY, level.size, level.damage, "peachBlade", 0xffab91, 180, 90, 18));
    if (levelNumber >= 5) {
      this.spawnProjectile(
        new Projectile(
          this.scene,
          player.x + direction.x * 24,
          player.y + direction.y * 24,
          "projectile-peach-wave",
          level.damage * 0.72,
          "peachBlade",
          direction.clone().scale(level.speed ?? 360),
          900
        )
      );
    }
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
    const robe = weaponStates.find((state) => state.id === "fairyRobe");
    if (!boots && !robe) {
      this.lastPlayerPosition.set(player.x, player.y);
      return;
    }

    this.movementDistance += Phaser.Math.Distance.Between(player.x, player.y, this.lastPlayerPosition.x, this.lastPlayerPosition.y);
    this.lastPlayerPosition.set(player.x, player.y);
    if (boots) {
      const level = getWeapon("pussInBootsBoots").levels[boots.level - 1];
      const threshold = boots.level >= 5 ? 120 : 170;
      if (this.movementDistance >= threshold) {
        this.movementDistance = 0;
        this.spawnArea(new AreaEffect(this.scene, player.x, player.y, level.size, level.damage, "pussInBootsBoots", 0xfff176, 380, 180, 12));
      }
    }
    if (robe && robe.level >= 4 && this.movementDistance >= 140) {
      const level = getWeapon("fairyRobe").levels[robe.level - 1];
      this.spawnArea(new AreaEffect(this.scene, player.x, player.y, level.size, level.damage, "fairyRobe", 0xb3e5fc, 330, 170, 8));
      this.movementDistance = 0;
    }
    void stats;
  }

  private fireDelayedArea(id: string, color: number, levelNumber: number, delayMs: number): void {
    const player = this.getPlayer();
    const level = getWeapon(id).levels[levelNumber - 1];
    const count = level.count ?? 1;
    for (let i = 0; i < count; i += 1) {
      const target = this.findNearest(level.range || 460);
      const x = (target?.x ?? player.x) + Phaser.Math.Between(-70, 70);
      const y = (target?.y ?? player.y) + Phaser.Math.Between(-70, 70);
      const marker = this.scene.add.circle(x, y, Math.max(12, level.size * 0.35), color, 0.22).setDepth(18);
      this.scene.tweens.add({ targets: marker, alpha: 0.55, scale: 1.4, yoyo: true, duration: delayMs, onComplete: () => marker.destroy() });
      this.scene.time.delayedCall(delayMs, () => {
        this.spawnArea(new AreaEffect(this.scene, x, y, level.size, level.damage, id, color, level.durationMs ?? 360, 120, id === "goblinClub" ? 28 : 8));
      });
    }
  }

  private fireLineArea(id: string, color: number, levelNumber: number): void {
    const player = this.getPlayer();
    const level = getWeapon(id).levels[levelNumber - 1];
    const target = this.findNearest(level.range || 350);
    if (!target) {
      return;
    }
    const direction = new Phaser.Math.Vector2(target.x - player.x, target.y - player.y).normalize();
    const count = level.count ?? 1;
    for (let i = 0; i < count; i += 1) {
      const dir = direction.clone().rotate(i === 1 ? Math.PI : 0);
      const steps = Math.max(3, Math.floor((level.range || 300) / 75));
      for (let step = 1; step <= steps; step += 1) {
        this.scene.time.delayedCall(step * 18, () => {
          this.spawnArea(
            new AreaEffect(
              this.scene,
              player.x + dir.x * step * 72,
              player.y + dir.y * step * 72,
              level.size,
              level.damage / 2,
              id,
              color,
              130,
              90,
              8
            )
          );
        });
      }
    }
  }

  private fireOrbitArea(id: string, color: number, levelNumber: number, time: number): void {
    const player = this.getPlayer();
    const level = getWeapon(id).levels[levelNumber - 1];
    const count = level.count ?? 1;
    for (let i = 0; i < count; i += 1) {
      const angle = time / 380 + i * Math.PI;
      const x = player.x + Math.cos(angle) * 92;
      const y = player.y + Math.sin(angle) * 92;
      this.spawnArea(new AreaEffect(this.scene, x, y, level.size, level.damage, id, color, level.durationMs ?? 360, 120, 4));
    }
  }

  private firePulseArea(id: string, color: number, levelNumber: number): void {
    const player = this.getPlayer();
    const level = getWeapon(id).levels[levelNumber - 1];
    const count = level.count ?? 1;
    for (let i = 0; i < count; i += 1) {
      this.scene.time.delayedCall(i * 230, () => {
        this.spawnArea(new AreaEffect(this.scene, player.x, player.y, level.size, level.damage, id, color, level.durationMs ?? 240, 120, levelNumber >= 5 ? 34 : 18));
      });
    }
  }

  private fireLotus(levelNumber: number): void {
    const player = this.getPlayer();
    const level = getWeapon("simcheongsLotus").levels[levelNumber - 1];
    const lowHpMultiplier = player.hp / player.stats.maxHp < 0.35 && levelNumber >= 5 ? 1.5 : 1;
    player.heal((levelNumber >= 2 ? 5 : 3) * lowHpMultiplier);
    this.spawnArea(new AreaEffect(this.scene, player.x, player.y, level.size, level.damage * lowHpMultiplier, "simcheongsLotus", 0xf8bbd0, level.durationMs ?? 500, 160, 10));
  }

  private fireEvolutionWeapon(id: string, time: number): void {
    const player = this.getPlayer();
    if (id === "eternalMatchFlameWeapon") {
      this.fireDelayedArea(id, 0xffb33f, 1, 120);
      this.scene.time.delayedCall(260, () => this.firePulseArea(id, 0xfff176, 1));
    } else if (id === "skyHighBeanstalkWeapon") {
      this.spawnArea(new AreaEffect(this.scene, player.x, player.y, 185, 72, id, 0x6bd36b, 1200, 220, 42));
    } else if (id === "goldenTowerBraidWeapon") {
      for (let i = 0; i < 6; i += 1) this.fireRadialLine(id, 0xffd966, i * Math.PI / 3, 430, 48, 28);
    } else if (id === "duelistsRedBootsWeapon") {
      this.spawnArea(new AreaEffect(this.scene, player.x, player.y, 120, 48, id, 0xff6f91, 520, 180, 22));
      this.fireCrossSlash(id, 0xfff176, 42);
    } else if (id === "deepSeaWhirlpoolWeapon") {
      this.spawnArea(new AreaEffect(this.scene, player.x, player.y, 170, 42, id, 0x80deea, 1600, 240, 4));
    } else if (id === "hundredYearBriarCurseWeapon") {
      this.spawnArea(new AreaEffect(this.scene, player.x, player.y, 190, 46, id, 0xff7fbd, 1700, 240, 8));
    } else if (id === "goldComeForthWeapon") {
      for (let i = 0; i < 3; i += 1) this.scene.time.delayedCall(i * 180, () => this.fireDelayedArea(id, 0xffd54f, 1, 120));
    } else if (id === "enchantedRoseCastleWeapon") {
      this.fireOrbitArea(id, 0xff7fbd, 1, time);
      this.spawnArea(new AreaEffect(this.scene, player.x, player.y, 110, 32, id, 0xf8bbd0, 420, 160, 28));
    } else if (id === "fourAnimalGrandChorusWeapon") {
      for (let i = 0; i < 4; i += 1) this.scene.time.delayedCall(i * 170, () => this.spawnArea(new AreaEffect(this.scene, player.x, player.y, 120 + i * 28, 26 + i * 5, id, 0x80deea, 260, 120, 18 + i * 6)));
    } else if (id === "queensMagicMirrorWeapon") {
      for (let i = 0; i < 4; i += 1) this.fireEvolutionProjectile(id, "projectile-mirror", 34, 560, i * 0.35);
    } else if (id === "heavenSplittingStaffWeapon") {
      for (let i = 0; i < 4; i += 1) this.fireRadialLine(id, 0xffd54f, i * Math.PI / 2, 620, 62, 42);
    } else if (id === "lotusOfIndangsuWeapon") {
      player.heal(player.hp / player.stats.maxHp < 0.35 ? 16 : 9);
      this.spawnArea(new AreaEffect(this.scene, player.x, player.y, 190, 48, id, 0xf8bbd0, 980, 200, 18));
    } else if (id === "threeHonestAxesWeapon") {
      for (let i = 0; i < 3; i += 1) this.fireEvolutionProjectile(id, ["projectile-old-axe", "projectile-silver-axe", "projectile-golden-axe"][i], 42 + i * 10, 600, (i - 1) * 0.18);
    } else if (id === "realBoysSteelFistsWeapon") {
      for (let i = 0; i < 3; i += 1) this.scene.time.delayedCall(i * 80, () => this.spawnArea(new AreaEffect(this.scene, player.x + player.lastMoveDirection.x * 88, player.y + player.lastMoveDirection.y * 88, 76, 36, id, 0x8bd7ff, 170, 80, 20)));
    } else if (id === "midnightGlassSlippersWeapon") {
      for (let i = 0; i < 3; i += 1) this.fireEvolutionProjectile(id, "projectile-glass", 32, 680, (i - 1) * 0.15);
    } else if (id === "oniCuttingPeachBladeWeapon") {
      for (let i = 0; i < 3; i += 1) this.fireRadialLine(id, 0xffab91, player.lastMoveDirection.angle() + (i - 1) * 0.25, 360, 72, 36);
    } else if (id === "wolfHuntersBasketWeapon") {
      this.fireProjectileWeapon("redRidingHoodsBasket", Phaser.Utils.Array.GetRandom(["projectile-silver-axe", "projectile-apple", "projectile-bottle"]), 5, player.stats, 0.04);
      this.fireDelayedArea(id, 0xcfd8dc, 1, 180);
    } else if (id === "witchsCandyHouseWeapon") {
      this.fireDelayedArea(id, 0xffab91, 1, 520);
      player.heal(Math.random() < 0.25 ? 3 : 0);
    } else if (id === "burningBriarGardenWeapon") {
      this.spawnArea(new AreaEffect(this.scene, player.x, player.y, 180, 44, id, 0xff8a3d, 1400, 230, 10));
      this.spawnArea(new AreaEffect(this.scene, player.x, player.y, 150, 32, id, 0xff7fbd, 1400, 230, 6));
    } else if (id === "mirrorLakeWeapon") {
      this.spawnArea(new AreaEffect(this.scene, player.x, player.y, 155, 34, id, 0x80deea, 1300, 240, 4));
      for (let i = 0; i < 3; i += 1) this.fireEvolutionProjectile(id, "projectile-mirror", 28, 520, (i - 1) * 0.42);
    }
  }

  private fireEvolutionProjectile(id: string, texture: string, damage: number, speed: number, angleOffset = 0): void {
    const player = this.getPlayer();
    const target = this.findNearest(720);
    const base = target
      ? new Phaser.Math.Vector2(target.x - player.x, target.y - player.y).normalize()
      : player.lastMoveDirection.clone().normalize();
    const direction = base.rotate(angleOffset);
    this.spawnProjectile(new Projectile(this.scene, player.x, player.y, texture, damage, id, direction.scale(speed), 1700, target, 0.05));
  }

  private fireRadialLine(id: string, color: number, angle: number, range: number, size: number, damage: number): void {
    const player = this.getPlayer();
    const direction = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle));
    const steps = Math.max(4, Math.floor(range / 85));
    for (let step = 1; step <= steps; step += 1) {
      this.scene.time.delayedCall(step * 20, () => {
        this.spawnArea(new AreaEffect(this.scene, player.x + direction.x * step * 82, player.y + direction.y * step * 82, size, damage, id, color, 150, 90, 14));
      });
    }
  }

  private fireCrossSlash(id: string, color: number, damage: number): void {
    const base = this.getPlayer().lastMoveDirection.angle();
    this.fireRadialLine(id, color, base + Math.PI / 4, 260, 50, damage);
    this.fireRadialLine(id, color, base - Math.PI / 4, 260, 50, damage);
  }

  private createAxeRecovery(player: Player, direction: Phaser.Math.Vector2, tier: AxeTier, levelNumber: number): void {
    const distance = tier === "golden" ? 230 : tier === "silver" ? 165 : 105;
    const radius = (levelNumber >= 5 ? 42 : 34) + (tier === "old" ? 8 : 0);
    const x = player.x + direction.x * distance + Phaser.Math.Between(-38, 38);
    const y = player.y + direction.y * distance + Phaser.Math.Between(-38, 38);
    const color = tier === "golden" ? 0xffd54f : tier === "silver" ? 0xcfd8dc : 0x8d6e63;
    const marker = this.scene.add.graphics().setDepth(19);
    marker.fillStyle(color, 0.18);
    marker.lineStyle(4, color, 0.85);
    marker.fillCircle(x, y, radius);
    marker.strokeCircle(x, y, radius);
    this.scene.tweens.add({ targets: marker, alpha: 0.45, yoyo: true, repeat: -1, duration: 300 });
    this.axeRecoveries.push({
      marker,
      x,
      y,
      radius,
      tier,
      expiresAt: this.scene.time.now + 2600
    });
  }

  private updateAxeRecoveries(time: number): void {
    const player = this.getPlayer();
    for (const recovery of this.axeRecoveries) {
      if (!recovery.marker.active) {
        continue;
      }
      if (time >= recovery.expiresAt) {
        recovery.marker.destroy();
        continue;
      }
      if (Phaser.Math.Distance.Between(player.x, player.y, recovery.x, recovery.y) <= recovery.radius + 18) {
        recovery.marker.destroy();
        player.emit("axe-recovered", recovery.tier);
      }
    }
    this.axeRecoveries = this.axeRecoveries.filter((recovery) => recovery.marker.active);
  }

  private rollAxeTier(): AxeTier {
    const roll = Math.random();
    if (roll > 0.88) {
      return "golden";
    }
    if (roll > 0.58) {
      return "silver";
    }
    return "old";
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
