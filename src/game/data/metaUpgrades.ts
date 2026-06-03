import { LocalizedText } from "../types/gameTypes";

export interface MetaUpgradeData {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  maxLevel: number;
  baseCost: number;
  costScale: number;
  effectPerLevel: number;
}

export const metaUpgrades: MetaUpgradeData[] = [
  ["meta_max_hp", "Max HP", "Increases max HP for all characters.", 5, 50, 1.6, 0.06],
  ["meta_attack", "Attack", "Increases all damage.", 5, 60, 1.6, 0.04],
  ["meta_attack_speed", "Attack Speed", "Raises attack speed.", 5, 60, 1.65, 0.035],
  ["meta_move_speed", "Move Speed", "Raises movement speed.", 5, 45, 1.55, 0.035],
  ["meta_defense", "Defense", "Reduces incoming damage.", 5, 55, 1.6, 0.025],
  ["meta_crit_chance", "Crit Chance", "Raises critical hit chance.", 5, 70, 1.7, 0.015],
  ["meta_crit_damage", "Crit Damage", "Raises critical hit damage.", 5, 70, 1.7, 0.06],
  ["meta_exp_gain", "EXP Gain", "Gains more EXP from gems.", 5, 50, 1.6, 0.06],
  ["meta_pickup_range", "Pickup Range", "Pulls pickups from farther away.", 5, 40, 1.55, 0.08],
  ["meta_currency_gain", "Story Shard Gain", "Earns more Story Shards.", 5, 75, 1.75, 0.08],
  ["meta_luck", "Luck", "Improves reward rolls.", 5, 80, 1.7, 0.04],
  ["meta_reroll", "Reroll", "Adds future reroll capacity.", 3, 90, 1.9, 1],
  ["meta_skip", "Skip", "Adds future skip capacity.", 3, 90, 1.9, 1],
  ["meta_banish", "Banish", "Adds future banish capacity.", 3, 100, 1.9, 1],
  ["meta_ultimate_charge", "Ultimate Charge", "Charges ultimates faster.", 5, 70, 1.7, 0.05],
  ["meta_dash_cooldown", "Fairy Dash Cooldown", "Reduces Fairy Dash cooldown.", 5, 70, 1.7, 0.04],
  ["meta_hp_regen", "HP Regen", "Adds passive HP regeneration.", 5, 50, 1.6, 0.08],
  ["meta_revival", "Revival", "Adds future revival capacity.", 1, 250, 1, 1],
  ["meta_starting_shards", "Starting Story Shards", "Adds bonus shards after normal runs.", 3, 120, 1.8, 10],
  ["meta_evolution_chance", "Evolution Chance", "Improves evolution reward odds.", 5, 85, 1.75, 0.04]
].map(([id, name, description, maxLevel, baseCost, costScale, effectPerLevel]) => ({
  id: id as string,
  name: { ko: name as string, en: name as string },
  description: { ko: description as string, en: description as string },
  maxLevel: maxLevel as number,
  baseCost: baseCost as number,
  costScale: costScale as number,
  effectPerLevel: effectPerLevel as number
}));

export function getMetaUpgrade(id: string): MetaUpgradeData | undefined {
  return metaUpgrades.find((upgrade) => upgrade.id === id);
}

export function getMetaUpgradeCost(upgrade: MetaUpgradeData, currentLevel: number): number {
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.costScale, currentLevel));
}
