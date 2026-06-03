import { achievements } from "../data/achievements";
import { metaUpgrades } from "../data/metaUpgrades";
import { AimMode, GameMode, GameSettings, SaveData } from "../types/gameTypes";

const SAVE_KEY = "once_upon_a_save";
const SAVE_VERSION = 3;

export class SaveSystem {
  static createDefault(): SaveData {
    return {
      version: SAVE_VERSION,
      bestTime: 0,
      bestLevel: 1,
      clearedBosses: [],
      totalKills: 0,
      currency: 0,
      language: "en",
      lastCharacterId: "pinocchio",
      lastSelectedCharacter: "pinocchio",
      aimMode: "auto",
      settings: SaveSystem.defaultSettings(),
      metaUpgrades: Object.fromEntries(metaUpgrades.map((upgrade) => [upgrade.id, 0])),
      unlockedCharacters: ["pinocchio", "woodcutter"],
      unlockedStages: ["topsyTurvyStorybookForest"],
      characterStats: {},
      stageStats: {},
      bossStats: {},
      survivalRecords: {},
      unlockedItems: [],
      discoveredCharacters: ["pinocchio", "woodcutter"],
      discoveredStages: ["topsyTurvyStorybookForest"],
      discoveredBosses: [],
      discoveredWeapons: [],
      discoveredPassives: [],
      discoveredEvolutions: [],
      discoveredEnemies: [],
      unlockedAchievements: [],
      achievementProgress: {},
      tutorialSeen: false
    };
  }

  static load(): SaveData {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      const save = SaveSystem.createDefault();
      SaveSystem.save(save);
      return save;
    }

    try {
      const parsed = JSON.parse(raw);
      const base = SaveSystem.createDefault();
      const save: SaveData = {
        ...base,
        ...parsed,
        version: SAVE_VERSION,
        settings: { ...base.settings!, ...(parsed.settings ?? {}), language: parsed.settings?.language ?? parsed.language ?? "en" },
        metaUpgrades: { ...base.metaUpgrades, ...(parsed.metaUpgrades ?? {}) },
        unlockedCharacters: parsed.unlockedCharacters ?? base.unlockedCharacters,
        unlockedStages: parsed.unlockedStages ?? base.unlockedStages,
        lastSelectedCharacter: parsed.lastSelectedCharacter ?? parsed.lastCharacterId ?? "pinocchio",
        aimMode: parsed.aimMode ?? parsed.settings?.defaultAimMode ?? "auto",
        characterStats: parsed.characterStats ?? {},
        stageStats: parsed.stageStats ?? {},
        bossStats: parsed.bossStats ?? {},
        survivalRecords: parsed.survivalRecords ?? {},
        unlockedItems: parsed.unlockedItems ?? [],
        discoveredCharacters: parsed.discoveredCharacters ?? [parsed.lastCharacterId ?? "pinocchio", "woodcutter"],
        discoveredStages: parsed.discoveredStages ?? ["topsyTurvyStorybookForest"],
        discoveredBosses: parsed.discoveredBosses ?? parsed.clearedBosses ?? [],
        discoveredWeapons: parsed.discoveredWeapons ?? [],
        discoveredPassives: parsed.discoveredPassives ?? [],
        discoveredEvolutions: parsed.discoveredEvolutions ?? [],
        discoveredEnemies: parsed.discoveredEnemies ?? [],
        unlockedAchievements: parsed.unlockedAchievements ?? [],
        achievementProgress: parsed.achievementProgress ?? {},
        tutorialSeen: parsed.tutorialSeen ?? false
      };
      SaveSystem.save(save);
      return save;
    } catch {
      const save = SaveSystem.createDefault();
      SaveSystem.save(save);
      return save;
    }
  }

  static save(data: SaveData): void {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ ...data, version: SAVE_VERSION }));
  }

  static reset(): void {
    SaveSystem.save(SaveSystem.createDefault());
  }

  static setLastCharacter(characterId: string): void {
    const save = SaveSystem.load();
    save.lastCharacterId = characterId;
    save.lastSelectedCharacter = characterId;
    SaveSystem.addUnique(save.discoveredCharacters!, characterId);
    SaveSystem.save(save);
  }

  static setAimMode(aimMode: AimMode): void {
    const save = SaveSystem.load();
    save.aimMode = aimMode;
    save.settings!.defaultAimMode = aimMode;
    SaveSystem.save(save);
  }

  static updateSettings(settings: Partial<GameSettings>): void {
    const save = SaveSystem.load();
    save.settings = { ...save.settings!, ...settings };
    save.language = save.settings.language;
    save.aimMode = save.settings.defaultAimMode;
    SaveSystem.save(save);
  }

  static buyMetaUpgrade(id: string, cost: number): boolean {
    const save = SaveSystem.load();
    if (save.currency < cost) {
      return false;
    }
    save.currency -= cost;
    save.metaUpgrades![id] = (save.metaUpgrades![id] ?? 0) + 1;
    SaveSystem.save(save);
    return true;
  }

  static recordDiscovered(type: "character" | "stage" | "boss" | "enemy" | "weapon" | "passive" | "evolution", id: string): void {
    const save = SaveSystem.load();
    const key = `discovered${type.charAt(0).toUpperCase()}${type.slice(1)}s` as keyof SaveData;
    const list = (save[key] ?? []) as string[];
    if (!list.includes(id)) {
      list.push(id);
      (save as unknown as Record<string, string[]>)[key] = list;
      SaveSystem.save(save);
    }
  }

  static recordEvolution(id: string, type: "evolution" | "combo" = "evolution"): string[] {
    const save = SaveSystem.load();
    SaveSystem.addUnique(save.discoveredEvolutions!, id);
    const unlocked = SaveSystem.evaluateAchievements(save, {
      evolutionCount: save.discoveredEvolutions!.length,
      comboCount: type === "combo" ? save.discoveredEvolutions!.length : 0
    });
    SaveSystem.save(save);
    return unlocked;
  }

  static recordCharacterStart(characterId: string): void {
    const save = SaveSystem.load();
    const stats = SaveSystem.ensureCharacterStats(save, characterId);
    stats.plays += 1;
    save.lastCharacterId = characterId;
    save.lastSelectedCharacter = characterId;
    SaveSystem.addUnique(save.discoveredCharacters!, characterId);
    SaveSystem.evaluateAchievements(save, { characterPlayCount: save.discoveredCharacters!.length });
    SaveSystem.save(save);
  }

  static recordStageStart(stageId: string): void {
    const save = SaveSystem.load();
    const stats = SaveSystem.ensureStageStats(save, stageId);
    stats.plays += 1;
    SaveSystem.addUnique(save.discoveredStages!, stageId);
    SaveSystem.evaluateAchievements(save, { stagePlayCount: save.discoveredStages!.length });
    SaveSystem.save(save);
  }

  static unlockAchievement(id: string, devMode = false): string[] {
    if (devMode) {
      return [];
    }
    const save = SaveSystem.load();
    const unlocked = SaveSystem.evaluateAchievements(save, { force: [id] });
    SaveSystem.save(save);
    return unlocked;
  }

  static recordRun(result: {
    characterId: string;
    stageId?: string;
    survivalTime: number;
    level: number;
    kills: number;
    clear: boolean;
    bossId?: string;
    currencyEarned: number;
    devMode?: boolean;
    mode?: GameMode;
  }): { save: SaveData; achievementsUnlocked: string[] } {
    const save = SaveSystem.load();
    if (result.devMode || result.mode === "bossPractice") {
      save.lastCharacterId = result.characterId;
      save.lastSelectedCharacter = result.characterId;
      SaveSystem.save(save);
      return { save, achievementsUnlocked: [] };
    }

    save.bestTime = Math.max(save.bestTime, result.survivalTime);
    save.bestLevel = Math.max(save.bestLevel, result.level);
    save.totalKills += result.kills;
    save.currency += result.currencyEarned + (save.metaUpgrades!.meta_starting_shards ?? 0) * 10;
    save.lastCharacterId = result.characterId;
    save.lastSelectedCharacter = result.characterId;

    const characterStats = SaveSystem.ensureCharacterStats(save, result.characterId);
    characterStats.bestTime = Math.max(characterStats.bestTime, result.survivalTime);
    characterStats.bestLevel = Math.max(characterStats.bestLevel, result.level);
    if (result.clear) {
      characterStats.clears += 1;
    }

    if (result.stageId) {
      const stageStats = SaveSystem.ensureStageStats(save, result.stageId);
      if (result.clear) {
        stageStats.clears += 1;
        SaveSystem.unlockNextStageAndCharacters(save, result.stageId);
      }
      if (result.survivalTime > stageStats.bestTime) {
        stageStats.bestTime = result.survivalTime;
        stageStats.bestCharacterId = result.characterId;
      }
    }

    if (result.bossId) {
      const bossStats = SaveSystem.ensureBossStats(save, result.bossId);
      bossStats.encounters += 1;
      SaveSystem.addUnique(save.discoveredBosses!, result.bossId);
      if (result.clear) {
        bossStats.defeats += 1;
        SaveSystem.addUnique(save.clearedBosses, result.bossId);
      }
    }

    if (result.mode === "freeSurvival" && result.stageId) {
      const record = save.survivalRecords![result.stageId] ?? { bestTime: 0, bestCharacterId: result.characterId };
      if (result.survivalTime > record.bestTime) {
        record.bestTime = result.survivalTime;
        record.bestCharacterId = result.characterId;
      }
      save.survivalRecords![result.stageId] = record;
    }

    const achievementsUnlocked = SaveSystem.evaluateAchievements(save, result);
    SaveSystem.save(save);
    return { save, achievementsUnlocked };
  }

  private static defaultSettings(): GameSettings {
    return {
      language: "en",
      masterVolume: 1,
      bgmVolume: 0.75,
      sfxVolume: 0.75,
      screenShake: true,
      defaultAimMode: "auto",
      damageNumbers: true,
      reducedEffects: false
    };
  }

  private static evaluateAchievements(save: SaveData, context: Record<string, unknown>): string[] {
    const unlocked: string[] = [];
    const force = (context.force as string[] | undefined) ?? [];
    const unlock = (id: string): void => {
      if (save.unlockedAchievements!.includes(id)) {
        return;
      }
      const achievement = achievements.find((entry) => entry.id === id);
      if (!achievement) {
        return;
      }
      save.unlockedAchievements!.push(id);
      save.currency += achievement.rewardCurrency;
      unlocked.push(id);
    };

    force.forEach(unlock);
    if ((context.characterPlayCount as number | undefined) === 1) unlock("first_page");
    if ((context.level ?? 0) as number >= 2) unlock("first_level_up");
    if (context.clear) unlock("first_clear");
    if ((context.survivalTime as number | undefined ?? 0) >= 900) unlock("storybook_survivor");
    if ((save.discoveredCharacters?.length ?? 0) >= 4) unlock("four_tales_begin");
    if ((save.discoveredStages?.length ?? 0) >= 4) unlock("world_traveler");
    if ((save.clearedBosses?.length ?? 0) >= 1) unlock("boss_beginner");
    if ((save.clearedBosses?.length ?? 0) >= 4) unlock("boss_collector");
    if (context.clear && context.characterId === "woodcutter") unlock("honest_hands_clear");
    if (context.clear && context.characterId === "pinocchio") unlock("real_boy_clear");
    if (context.clear && context.characterId === "cinderella") unlock("midnight_waltz_clear");
    if (context.clear && context.characterId === "momotaro") unlock("peach_commander_clear");
    if ((save.totalKills ?? 0) >= 500) unlock("little_cleanup");
    if ((save.totalKills ?? 0) >= 2000) unlock("big_cleanup");
    if ((save.currency ?? 0) >= 1000) unlock("story_shard_saver");
    if ((save.discoveredEvolutions?.length ?? 0) >= 1) unlock("first_evolution");
    if ((save.discoveredEvolutions?.length ?? 0) >= 5) unlock("evolution_student");
    if ((save.discoveredEvolutions?.length ?? 0) >= 12) unlock("evolution_scholar");
    if ((save.discoveredEvolutions?.length ?? 0) >= 20) unlock("evolution_master");
    if ((save.discoveredWeapons?.length ?? 0) >= 16) unlock("weapon_collector");
    if ((save.discoveredPassives?.length ?? 0) >= 16) unlock("passive_collector");
    if ((context.comboCount as number | undefined ?? 0) >= 1) unlock("combo_time");
    if ((context.comboCount as number | undefined ?? 0) >= 4) unlock("combo_collector");
    if (context.clear && context.bossId === "bigBadWolf") unlock("wolf_tamer");
    if (context.clear && context.bossId === "candyWitch") unlock("candy_breaker");
    if (context.clear && context.bossId === "midnightQueen") unlock("midnight_clear");
    if (context.clear && context.bossId === "oniIslandKing") unlock("oni_festival");
    if (context.clear && context.stageId === "topsyTurvyStorybookForest") unlock("forest_clear");
    if (context.clear && context.stageId === "candyCottageCarnival") unlock("candy_clear");
    if (context.clear && context.stageId === "midnightPalace") unlock("palace_clear");
    if (context.clear && context.stageId === "peachIslandDragonPalace") unlock("island_clear");
    return unlocked;
  }

  private static unlockNextStageAndCharacters(save: SaveData, stageId: string): void {
    if (stageId === "topsyTurvyStorybookForest") {
      SaveSystem.addUnique(save.unlockedStages!, "candyCottageCarnival");
      SaveSystem.addUnique(save.unlockedCharacters!, "cinderella");
    }
    if (stageId === "candyCottageCarnival") {
      SaveSystem.addUnique(save.unlockedStages!, "midnightPalace");
      SaveSystem.addUnique(save.unlockedCharacters!, "momotaro");
    }
    if (stageId === "midnightPalace") {
      SaveSystem.addUnique(save.unlockedStages!, "peachIslandDragonPalace");
    }
  }

  private static ensureCharacterStats(data: SaveData, characterId: string) {
    data.characterStats ??= {};
    data.characterStats[characterId] ??= { plays: 0, clears: 0, bestTime: 0, bestLevel: 1 };
    return data.characterStats[characterId];
  }

  private static ensureStageStats(data: SaveData, stageId: string) {
    data.stageStats ??= {};
    data.stageStats[stageId] ??= { plays: 0, clears: 0, bestTime: 0 };
    return data.stageStats[stageId];
  }

  private static ensureBossStats(data: SaveData, bossId: string) {
    data.bossStats ??= {};
    data.bossStats[bossId] ??= { encounters: 0, defeats: 0 };
    return data.bossStats[bossId];
  }

  private static addUnique(list: string[], id: string): void {
    if (!list.includes(id)) {
      list.push(id);
    }
  }
}
