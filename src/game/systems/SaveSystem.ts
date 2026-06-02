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
      language: "en"
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
      return { ...SaveSystem.createDefault(), ...JSON.parse(raw) };
    } catch {
      const save = SaveSystem.createDefault();
      SaveSystem.save(save);
      return save;
    }
  }

  static save(data: SaveData): void {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  }

  static recordRun(result: {
    survivalTime: number;
    level: number;
    kills: number;
    clear: boolean;
    bossId?: string;
    currencyEarned: number;
  }): SaveData {
    const save = SaveSystem.load();
    save.bestTime = Math.max(save.bestTime, result.survivalTime);
    save.bestLevel = Math.max(save.bestLevel, result.level);
    save.totalKills += result.kills;
    save.currency += result.currencyEarned;
    if (result.clear && result.bossId && !save.clearedBosses.includes(result.bossId)) {
      save.clearedBosses.push(result.bossId);
    }
    SaveSystem.save(save);
    return save;
  }
}
