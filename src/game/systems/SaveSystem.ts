import { SaveData } from "../types/gameTypes";

const SAVE_KEY = "once_upon_a_save";

export class SaveSystem {
  static createDefault(): SaveData {
    return {
      version: 1,
      bestTime: 0,
      bestLevel: 1,
      clearedBosses: [],
      totalKills: 0,
      currency: 0,
      language: "en",
      lastCharacterId: "pinocchio",
      lastSelectedCharacter: "pinocchio",
      aimMode: "auto",
      characterStats: {},
      stageStats: {},
      unlockedItems: [],
      discoveredWeapons: [],
      discoveredPassives: [],
      discoveredEvolutions: []
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
      return {
        ...SaveSystem.createDefault(),
        ...parsed,
        lastSelectedCharacter: parsed.lastSelectedCharacter ?? parsed.lastCharacterId ?? "pinocchio",
        aimMode: parsed.aimMode ?? "auto",
        characterStats: parsed.characterStats ?? {},
        stageStats: parsed.stageStats ?? {},
        unlockedItems: parsed.unlockedItems ?? [],
        discoveredWeapons: parsed.discoveredWeapons ?? [],
        discoveredPassives: parsed.discoveredPassives ?? [],
        discoveredEvolutions: parsed.discoveredEvolutions ?? []
      };
    } catch {
      const save = SaveSystem.createDefault();
      SaveSystem.save(save);
      return save;
    }
  }

  static save(data: SaveData): void {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  }

  static setLastCharacter(characterId: string): void {
    const save = SaveSystem.load();
    save.lastCharacterId = characterId;
    save.lastSelectedCharacter = characterId;
    SaveSystem.save(save);
  }

  static setAimMode(aimMode: "auto" | "cursor"): void {
    const save = SaveSystem.load();
    save.aimMode = aimMode;
    SaveSystem.save(save);
  }

  static recordDiscovered(type: "weapon" | "passive", id: string): void {
    const save = SaveSystem.load();
    const key = type === "weapon" ? "discoveredWeapons" : "discoveredPassives";
    save[key] ??= [];
    if (!save[key]!.includes(id)) {
      save[key]!.push(id);
      SaveSystem.save(save);
    }
  }

  static recordEvolution(id: string): void {
    const save = SaveSystem.load();
    save.discoveredEvolutions ??= [];
    if (!save.discoveredEvolutions.includes(id)) {
      save.discoveredEvolutions.push(id);
      SaveSystem.save(save);
    }
  }

  static recordCharacterStart(characterId: string): void {
    const save = SaveSystem.load();
    const stats = SaveSystem.ensureCharacterStats(save, characterId);
    stats.plays += 1;
    save.lastCharacterId = characterId;
    save.lastSelectedCharacter = characterId;
    SaveSystem.save(save);
  }

  static recordStageStart(stageId: string): void {
    const save = SaveSystem.load();
    const stats = SaveSystem.ensureStageStats(save, stageId);
    stats.plays += 1;
    SaveSystem.save(save);
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
  }): SaveData {
    const save = SaveSystem.load();
    if (result.devMode) {
      save.lastCharacterId = result.characterId;
      save.lastSelectedCharacter = result.characterId;
      SaveSystem.save(save);
      return save;
    }
    save.bestTime = Math.max(save.bestTime, result.survivalTime);
    save.bestLevel = Math.max(save.bestLevel, result.level);
    save.totalKills += result.kills;
    save.currency += result.currencyEarned;
    save.lastCharacterId = result.characterId;
    save.lastSelectedCharacter = result.characterId;
    const characterStats = SaveSystem.ensureCharacterStats(save, result.characterId);
    characterStats.bestTime = Math.max(characterStats.bestTime, result.survivalTime);
    characterStats.bestLevel = Math.max(characterStats.bestLevel, result.level);
    if (result.clear) {
      characterStats.clears += 1;
    }
    if (result.clear && result.bossId && !save.clearedBosses.includes(result.bossId)) {
      save.clearedBosses.push(result.bossId);
    }
    if (result.stageId) {
      const stageStats = SaveSystem.ensureStageStats(save, result.stageId);
      if (result.clear) {
        stageStats.clears += 1;
      }
      if (result.survivalTime > stageStats.bestTime) {
        stageStats.bestTime = result.survivalTime;
        stageStats.bestCharacterId = result.characterId;
      }
    }
    SaveSystem.save(save);
    return save;
  }

  private static ensureCharacterStats(data: ReturnType<typeof SaveSystem.createDefault>, characterId: string) {
    data.characterStats ??= {};
    data.characterStats[characterId] ??= {
      plays: 0,
      clears: 0,
      bestTime: 0,
      bestLevel: 1
    };
    return data.characterStats[characterId];
  }

  private static ensureStageStats(data: ReturnType<typeof SaveSystem.createDefault>, stageId: string) {
    data.stageStats ??= {};
    data.stageStats[stageId] ??= {
      plays: 0,
      clears: 0,
      bestTime: 0
    };
    return data.stageStats[stageId];
  }
}
