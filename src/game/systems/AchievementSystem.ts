import { getAchievement } from "../data/achievements";
import { SaveSystem } from "./SaveSystem";

export class AchievementSystem {
  static unlock(id: string, devMode = false): string[] {
    return SaveSystem.unlockAchievement(id, devMode);
  }

  static formatUnlocks(ids: string[]): string {
    return ids
      .map((id) => getAchievement(id)?.name.en ?? id)
      .join(", ");
  }
}
