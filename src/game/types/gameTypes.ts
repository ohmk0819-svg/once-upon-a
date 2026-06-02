export type Language = "ko" | "en";

export type LocalizedText = Record<Language, string>;

export type EnemyBehavior = "chase" | "slowChase" | "eliteChase";

export type WeaponKind =
  | "melee"
  | "area"
  | "projectile"
  | "randomThrow"
  | "movementShockwave";

export type PassiveKind =
  | "attackSpeed"
  | "damageReduction"
  | "expGain"
  | "crit"
  | "cooldownReduction";

export type UpgradeCategory =
  | "character_base_weapon"
  | "character_passive"
  | "common_weapon"
  | "common_passive"
  | "healing";

export interface CharacterData {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  maxHp: number;
  hpRegenPerSecond: number;
  attackMultiplier: number;
  moveSpeed: number;
  attackSpeed: number;
  critChance: number;
  passiveId: string;
  baseWeaponId: string;
  ultimateId: string;
  visualType: string;
}

export interface WeaponLevelData {
  level: number;
  description: LocalizedText;
  damage: number;
  cooldownMs: number;
  range: number;
  size: number;
  durationMs?: number;
  count?: number;
  speed?: number;
}

export interface WeaponData {
  id: string;
  name: LocalizedText;
  role: LocalizedText;
  kind: WeaponKind;
  maxLevel: number;
  visualType: string;
  iconKey: string;
  levels: WeaponLevelData[];
}

export interface PassiveLevelData {
  level: number;
  description: LocalizedText;
  attackSpeedBonus?: number;
  damageReduction?: number;
  expGainBonus?: number;
  critChanceBonus?: number;
  critDamageBonus?: number;
  cooldownReduction?: number;
}

export interface PassiveData {
  id: string;
  name: LocalizedText;
  kind: PassiveKind;
  maxLevel: number;
  visualType: string;
  iconKey: string;
  levels: PassiveLevelData[];
}

export interface EnemyData {
  id: string;
  name: LocalizedText;
  hp: number;
  damage: number;
  moveSpeed: number;
  expDrop: number;
  behavior: EnemyBehavior;
  visualType: string;
}

export interface BossData {
  id: string;
  name: LocalizedText;
  hp: number;
  damage: number;
  moveSpeed: number;
  visualType: string;
}

export interface StageTimelineEntry {
  atSeconds: number;
  event: "addEnemy" | "spawnElite" | "increaseDensity" | "spawnBoss";
  enemyId?: string;
  bossId?: string;
}

export interface StageData {
  id: string;
  name: LocalizedText;
  durationSeconds: number;
  bossTimeSeconds: number;
  backgroundColor: string;
  timeline: StageTimelineEntry[];
}

export interface WeaponState {
  id: string;
  level: number;
}

export interface PassiveState {
  id: string;
  level: number;
}

export interface LevelUpOption {
  id: string;
  type: "weapon" | "passive" | "characterPassive" | "heal";
  category: UpgradeCategory;
  title: string;
  itemKind: string;
  description: string;
  currentLevel: number;
  nextLevel: number;
  isNew: boolean;
  isMax: boolean;
  iconKey: string;
  visualType: string;
  color: number;
}

export interface SaveData {
  version: number;
  bestTime: number;
  bestLevel: number;
  clearedBosses: string[];
  totalKills: number;
  currency: number;
  language: Language;
}

export interface PlayerStats {
  maxHp: number;
  moveSpeed: number;
  attackMultiplier: number;
  attackSpeed: number;
  critChance: number;
  critDamage: number;
  damageReduction: number;
  expGain: number;
  cooldownReduction: number;
  hpRegenPerSecond: number;
}
