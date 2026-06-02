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

    const pattern = this.patternIndex % 3;
    this.patternIndex += 1;
    const hpRatio = boss.hp / boss.maxHp;
    const phaseMultiplier = hpRatio <= 0.5 ? 0.85 : 1;
    this.nextPatternAt = time + 3780 * phaseMultiplier;
    if (pattern === 0) {
      this.wolfDash(time, boss, player);
    } else if (pattern === 1) {
      this.pawSwipe(boss, player);
    } else {
      this.playfulHowl(boss, player);
    }
  }

  private wolfDash(time: number, boss: Boss, player: Player): void {
    const direction = new Phaser.Math.Vector2(player.x - boss.x, player.y - boss.y).normalize();
    const warning = this.scene.add.graphics().setDepth(18);
    warning.lineStyle(18, 0xff8a3d, 0.34);
    warning.lineBetween(boss.x, boss.y, boss.x + direction.x * 760, boss.y + direction.y * 760);
    warning.lineStyle(4, 0xffffff, 0.75);
    warning.lineBetween(boss.x, boss.y, boss.x + direction.x * 760, boss.y + direction.y * 760);

    this.scene.time.delayedCall(800, () => {
      warning.destroy();
      if (!boss.active) {
        return;
      }
      boss.setVelocity(direction.x * 715, direction.y * 715);
      this.dashingUntil = this.scene.time.now + 1050;
      this.scene.time.delayedCall(360, () => {
        if (boss.active) {
          boss.setVelocity(0, 0);
        }
      });
      this.scene.time.delayedCall(180, () => {
        if (boss.active && Phaser.Math.Distance.Between(boss.x, boss.y, player.x, player.y) < 82) {
          this.combat.damagePlayer(player, boss.dataDef.damage + 12, this.scene.time.now);
        }
      });
    });
  }

  private pawSwipe(boss: Boss, player: Player): void {
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
      const inRange = toPlayer.length() < 155;
      const angleDiff = Math.abs(Phaser.Math.Angle.Wrap(toPlayer.angle() - angle));
      if (inRange && angleDiff < 0.65) {
        this.combat.damagePlayer(player, boss.dataDef.damage + 8, this.scene.time.now);
      }
      const sparkle = this.scene.add.circle(boss.x + direction.x * 90, boss.y + direction.y * 90, 56, 0xfff176, 0.3).setDepth(19);
      this.scene.tweens.add({ targets: sparkle, alpha: 0, scale: 1.7, duration: 300, onComplete: () => sparkle.destroy() });
    });
  }

  private playfulHowl(boss: Boss, player: Player): void {
    const warning = this.scene.add.graphics().setDepth(18);
    warning.fillStyle(0x80deea, 0.25);
    warning.lineStyle(4, 0xffffff, 0.62);
    warning.fillCircle(boss.x, boss.y, 190);
    warning.strokeCircle(boss.x, boss.y, 190);

    this.scene.time.delayedCall(800, () => {
      warning.destroy();
      if (!boss.active) {
        return;
      }
      if (Phaser.Math.Distance.Between(boss.x, boss.y, player.x, player.y) < 190) {
        player.applySlow(this.scene.time.now, 2000);
      }
      const ring = this.scene.add.circle(boss.x, boss.y, 30, 0x80deea, 0.35).setDepth(21);
      this.scene.tweens.add({ targets: ring, scale: 7, alpha: 0, duration: 450, onComplete: () => ring.destroy() });
    });
  }
}
