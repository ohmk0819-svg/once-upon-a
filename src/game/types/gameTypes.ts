export type Language = "ko" | "en";

export type LocalizedText = Record<Language, string>;

export type AimMode = "auto" | "cursor";

export type EnemyBehavior =
  | "chase"
  | "slowChase"
  | "eliteChase"
  | "fastChase"
  | "ranged"
  | "dash"
  | "tank"
  | "explodeOnDeath"
  | "stationaryShooter";
export type StageDifficulty = "easy" | "normal" | "hard" | "expert";

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
  | "evolution"
  | "healing";

export type EvolutionType = "weapon_passive" | "character_weapon" | "special_combo";

export interface CharacterData {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  difficulty: "easy" | "normal" | "hard";
  maxHp: number;
  hpRegenPerSecond: number;
  attackMultiplier: number;
  moveSpeed: number;
  attackSpeed: number;
  critChance: number;
  critDamage?: number;
  passiveId: string;
  baseWeaponId: string;
  ultimateId: string;
  visualType: string;
  color: number;
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
  isCharacterBase?: boolean;
  evolved?: boolean;
  combo?: boolean;
  baseWeaponId?: string;
  tags?: string[];
  levels: WeaponLevelData[];
}

export interface EvolutionData {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  type: EvolutionType;
  requiredWeaponIds?: string[];
  requiredPassiveIds?: string[];
  requiredCharacterId?: string;
  requiredBaseWeaponId?: string;
  resultWeaponId: string;
  iconKey: string;
  visualType: string;
}

export interface PassiveLevelData {
  level: number;
  description: LocalizedText;
  attackSpeedBonus?: number;
  attackMultiplierBonus?: number;
  incomingDamageIncrease?: number;
  damageReduction?: number;
  expGainBonus?: number;
  critChanceBonus?: number;
  critDamageBonus?: number;
  cooldownReduction?: number;
  maxHpMultiplierBonus?: number;
  hpRegenBonus?: number;
  moveSpeedBonus?: number;
  evasionChanceBonus?: number;
  luckBonus?: number;
  currencyGainBonus?: number;
  healingMultiplierBonus?: number;
  movingDamageBonus?: number;
  summonDamageMultiplier?: number;
  summonAttackSpeedMultiplier?: number;
  summonDurationMultiplier?: number;
  temporaryAllyDurationMultiplier?: number;
  enemySlowAura?: number;
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
  color?: number;
}

export interface BossData {
  id: string;
  name: LocalizedText;
  hp: number;
  damage: number;
  moveSpeed: number;
  visualType: string;
  color?: number;
  patterns?: string[];
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
  description?: LocalizedText;
  difficulty?: StageDifficulty;
  durationSeconds: number;
  bossTimeSeconds: number;
  normalBossTimeSec?: number;
  devBossTimeSec?: number;
  backgroundColor: string;
  colorPalette?: {
    background: number;
    ground: number;
    accent: number;
  };
  bossId?: string;
  enemyPool?: string[];
  elitePool?: string[];
  waveTimeline?: StageTimelineEntry[];
  unlockCondition?: string;
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
  type: "weapon" | "passive" | "characterPassive" | "heal" | "evolution";
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
  evolutionId?: string;
  resultWeaponId?: string;
}

export interface SaveData {
  version: number;
  bestTime: number;
  bestLevel: number;
  clearedBosses: string[];
  totalKills: number;
  currency: number;
  language: Language;
  lastCharacterId?: string;
  lastSelectedCharacter?: string;
  aimMode?: AimMode;
  characterStats?: Record<string, CharacterRunStats>;
  unlockedItems?: string[];
  discoveredWeapons?: string[];
  discoveredPassives?: string[];
  discoveredEvolutions?: string[];
  stageStats?: Record<string, StageRunStats>;
}

export interface CharacterRunStats {
  plays: number;
  clears: number;
  bestTime: number;
  bestLevel: number;
}

export interface StageRunStats {
  plays: number;
  clears: number;
  bestTime: number;
  bestCharacterId?: string;
}

export interface PlayerStats {
  maxHp: number;
  moveSpeed: number;
  attackMultiplier: number;
  attackSpeed: number;
  critChance: number;
  critDamage: number;
  damageReduction: number;
  incomingDamageMultiplier: number;
  expGain: number;
  cooldownReduction: number;
  hpRegenPerSecond: number;
  maxHpMultiplier: number;
  moveSpeedBonus: number;
  evasionChance: number;
  luck: number;
  currencyGain: number;
  healingMultiplier: number;
  movingDamageBonus: number;
  summonDamageMultiplier: number;
  summonAttackSpeedMultiplier: number;
  summonDurationMultiplier: number;
  temporaryAllyDurationMultiplier: number;
  enemySlowAura: number;
}
