import Phaser from "phaser";
import { Boss } from "../entities/Boss";
import { Player } from "../entities/Player";
import { CombatSystem } from "./CombatSystem";

export class BossPatternSystem {
  private nextPatternAt = 0;
  private patternIndex = 0;
  private dashingUntil = 0;

  constructor(private scene: Phaser.Scene, private combat: CombatSystem) {}

  update(time: number, boss: Boss | undefined, player: Player): void {
    if (!boss || !boss.active) {
      return;
    }
    if (time < this.dashingUntil) {
      return;
    }
    if (time < this.nextPatternAt) {
      boss.updateChase(new Phaser.Math.Vector2(player.x, player.y), 0.72);
      return;
    }

    const patterns = boss.bossDef.patterns ?? ["wolfDash", "pawSwipe", "playfulHowl"];
    const pattern = patterns[this.patternIndex % patterns.length];
    this.patternIndex += 1;
    const hpRatio = boss.hp / boss.maxHp;
    this.nextPatternAt = time + 3900 * (hpRatio <= 0.5 ? 0.5 : 1);
    this.runPattern(pattern, time, boss, player);
  }

  private runPattern(pattern: string, time: number, boss: Boss, player: Player): void {
    if (pattern === "wolfDash" || pattern === "carriageRush" || pattern === "oniRush") {
      this.lineDash(time, boss, player, pattern);
      return;
    }
    if (pattern === "pawSwipe") {
      this.pawSwipe(time, boss, player);
      return;
    }
    if (pattern === "playfulHowl") {
      this.playfulHowl(time, boss, player);
      return;
    }
    if (pattern === "candyPuddle") {
      this.candyPuddle(time, boss, player);
      return;
    }
    if (pattern === "cookieSummon") {
      this.cookieSummon(boss);
      return;
    }
    if (pattern === "ovenPop") {
      this.multiCircleBurst(time, boss, player, 0xff8a3d, 5, 84, 10);
      return;
    }
    if (pattern === "clockHands") {
      this.clockHands(time, boss, player);
      return;
    }
    if (pattern === "glassShards") {
      this.radialShardWarning(time, boss, player);
      return;
    }
    if (pattern === "clubSlam") {
      this.clubSlam(time, boss, player);
      return;
    }
    if (pattern === "oniFireDance") {
      this.multiCircleBurst(time, boss, player, 0xff7043, 7, 70, 12);
    }
  }

  private lineDash(time: number, boss: Boss, player: Player, pattern: string): void {
    const direction = new Phaser.Math.Vector2(player.x - boss.x, player.y - boss.y).normalize();
    const color = pattern === "carriageRush" ? 0x9575cd : pattern === "oniRush" ? 0xff7043 : 0xff8a3d;
    const warning = this.scene.add.graphics().setDepth(18);
    warning.lineStyle(pattern === "carriageRush" ? 32 : 18, color, 0.34);
    warning.lineBetween(boss.x, boss.y, boss.x + direction.x * 780, boss.y + direction.y * 780);
    warning.lineStyle(4, 0xffffff, 0.75);
    warning.lineBetween(boss.x, boss.y, boss.x + direction.x * 780, boss.y + direction.y * 780);

    this.scene.time.delayedCall(760, () => {
      warning.destroy();
      if (!boss.active) {
        return;
      }
      boss.setVelocity(direction.x * 730, direction.y * 730);
      this.dashingUntil = time + 760 + 960;
      this.scene.time.delayedCall(360, () => {
        if (boss.active) {
          boss.setVelocity(0, 0);
        }
      });
      this.scene.time.delayedCall(180, () => {
        if (boss.active && Phaser.Math.Distance.Between(boss.x, boss.y, player.x, player.y) < 92) {
          this.combat.damagePlayer(player, boss.dataDef.damage + (pattern === "oniRush" ? 16 : 12), time + 940);
        }
      });
    });
  }

  private pawSwipe(time: number, boss: Boss, player: Player): void {
    const direction = new Phaser.Math.Vector2(player.x - boss.x, player.y - boss.y).normalize();
    const angle = direction.angle();
    const warning = this.scene.add.graphics().setDepth(18);
    warning.fillStyle(0xff7043, 0.28);
    warning.slice(boss.x, boss.y, 150, angle - 0.55, angle + 0.55);
    warning.fillPath();

    this.scene.time.delayedCall(600, () => {
      warning.destroy();
      if (!boss.active) {
        return;
      }
      const toPlayer = new Phaser.Math.Vector2(player.x - boss.x, player.y - boss.y);
      if (toPlayer.length() < 155 && Math.abs(Phaser.Math.Angle.Wrap(toPlayer.angle() - angle)) < 0.65) {
        this.combat.damagePlayer(player, boss.dataDef.damage + 8, time + 600);
      }
      this.flashCircle(boss.x + direction.x * 90, boss.y + direction.y * 90, 56, 0xfff176);
    });
  }

  private playfulHowl(time: number, boss: Boss, player: Player): void {
    const warning = this.warningCircle(boss.x, boss.y, 190, 0x80deea);
    this.scene.time.delayedCall(800, () => {
      warning.destroy();
      if (!boss.active) {
        return;
      }
      if (Phaser.Math.Distance.Between(boss.x, boss.y, player.x, player.y) < 190) {
        player.applySlow(time + 800, 2000);
      }
      this.flashCircle(boss.x, boss.y, 210, 0x80deea);
    });
  }

  private candyPuddle(time: number, boss: Boss, player: Player): void {
    const x = player.x;
    const y = player.y;
    const warning = this.warningCircle(x, y, 130, 0xf06292);
    this.scene.time.delayedCall(700, () => {
      warning.destroy();
      this.flashCircle(x, y, 130, 0xf06292);
      if (Phaser.Math.Distance.Between(x, y, player.x, player.y) < 130) {
        const hitTime = time + 700;
        player.applySlow(hitTime, 2400);
        this.combat.damagePlayer(player, boss.dataDef.damage + 6, hitTime);
      }
    });
  }

  private cookieSummon(boss: Boss): void {
    for (let i = 0; i < 4; i += 1) {
      const angle = i * (Math.PI / 2) + Math.PI / 4;
      const x = boss.x + Math.cos(angle) * 145;
      const y = boss.y + Math.sin(angle) * 145;
      this.scene.events.emit("boss-spawn-enemy", "cookieSoldier", x, y);
      this.flashCircle(x, y, 34, 0xffcc80);
    }
  }

  private clockHands(time: number, boss: Boss, player: Player): void {
    const angleToPlayer = Phaser.Math.Angle.Between(boss.x, boss.y, player.x, player.y);
    [angleToPlayer, angleToPlayer + Math.PI / 2].forEach((angle, index) => {
      const warning = this.scene.add.graphics().setDepth(18);
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);
      warning.lineStyle(18, 0xffd54f, 0.28);
      warning.lineBetween(boss.x - dx * 660, boss.y - dy * 660, boss.x + dx * 660, boss.y + dy * 660);
      this.scene.time.delayedCall(650 + index * 130, () => {
        warning.destroy();
        const distance = Phaser.Geom.Line.GetNearestPoint(
          new Phaser.Geom.Line(boss.x - dx * 660, boss.y - dy * 660, boss.x + dx * 660, boss.y + dy * 660),
          new Phaser.Geom.Point(player.x, player.y)
        );
        if (Phaser.Math.Distance.Between(distance.x, distance.y, player.x, player.y) < 42) {
          this.combat.damagePlayer(player, boss.dataDef.damage + 10, time + 650 + index * 130);
        }
      });
    });
  }

  private radialShardWarning(time: number, boss: Boss, player: Player): void {
    for (let i = 0; i < 8; i += 1) {
      const angle = i * (Math.PI * 2 / 8);
      const x = boss.x + Math.cos(angle) * 170;
      const y = boss.y + Math.sin(angle) * 170;
      const warning = this.warningCircle(x, y, 46, 0x90caf9);
      this.scene.time.delayedCall(720, () => {
        warning.destroy();
        this.flashCircle(x, y, 64, 0x90caf9);
        if (Phaser.Math.Distance.Between(x, y, player.x, player.y) < 70) {
          this.combat.damagePlayer(player, boss.dataDef.damage + 8, time + 720);
        }
      });
    }
  }

  private clubSlam(time: number, boss: Boss, player: Player): void {
    const warning = this.warningCircle(boss.x, boss.y, 180, 0xb388ff);
    this.scene.time.delayedCall(820, () => {
      warning.destroy();
      this.flashCircle(boss.x, boss.y, 210, 0xb388ff);
      if (Phaser.Math.Distance.Between(boss.x, boss.y, player.x, player.y) < 190) {
        this.combat.damagePlayer(player, boss.dataDef.damage + 18, time + 820);
      }
    });
  }

  private multiCircleBurst(time: number, boss: Boss, player: Player, color: number, count: number, radius: number, bonusDamage: number): void {
    for (let i = 0; i < count; i += 1) {
      const angle = i * (Math.PI * 2 / count) + this.patternIndex * 0.18;
      const distance = 110 + (i % 2) * 115;
      const x = boss.x + Math.cos(angle) * distance;
      const y = boss.y + Math.sin(angle) * distance;
      const warning = this.warningCircle(x, y, radius, color);
      this.scene.time.delayedCall(650 + i * 55, () => {
        warning.destroy();
        this.flashCircle(x, y, radius, color);
        if (Phaser.Math.Distance.Between(x, y, player.x, player.y) < radius + 12) {
          this.combat.damagePlayer(player, boss.dataDef.damage + bonusDamage, time + 650 + i * 55);
        }
      });
    }
  }

  private warningCircle(x: number, y: number, radius: number, color: number): Phaser.GameObjects.Graphics {
    const warning = this.scene.add.graphics().setDepth(18);
    warning.fillStyle(color, 0.22);
    warning.lineStyle(4, 0xffffff, 0.58);
    warning.fillCircle(x, y, radius);
    warning.strokeCircle(x, y, radius);
    return warning;
  }

  private flashCircle(x: number, y: number, radius: number, color: number): void {
    const ring = this.scene.add.circle(x, y, Math.max(24, radius * 0.25), color, 0.36).setDepth(21);
    this.scene.tweens.add({ targets: ring, scale: Math.max(2.4, radius / 18), alpha: 0, duration: 440, onComplete: () => ring.destroy() });
  }
}
