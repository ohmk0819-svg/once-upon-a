import { evolutions, getEvolution } from "../data/evolutions";
import { getWeapon } from "../data/weapons";
import { EvolutionData, LevelUpOption, PassiveState, WeaponState } from "../types/gameTypes";

export class EvolutionSystem {
  getAvailableEvolutions(args: {
    characterId: string;
    weaponStates: WeaponState[];
    passiveStates: PassiveState[];
    ownedEvolutionIds: string[];
  }): EvolutionData[] {
    const ownedWeaponIds = new Set(args.weaponStates.map((state) => state.id));
    const ownedPassiveIds = new Set(args.passiveStates.map((state) => state.id));
    const ownedEvolutions = new Set(args.ownedEvolutionIds);

    return evolutions.filter((evolution) => {
      if (ownedEvolutions.has(evolution.id) || ownedWeaponIds.has(evolution.resultWeaponId)) {
        return false;
      }
      if (evolution.requiredCharacterId && evolution.requiredCharacterId !== args.characterId) {
        return false;
      }
      const requiredWeapons = evolution.requiredWeaponIds ?? [];
      for (const weaponId of requiredWeapons) {
        const state = args.weaponStates.find((candidate) => candidate.id === weaponId);
        if (!state) {
          return false;
        }
        const weapon = getWeapon(weaponId);
        if (evolution.type !== "special_combo" && state.level < weapon.maxLevel) {
          return false;
        }
      }
      const requiredPassives = evolution.requiredPassiveIds ?? [];
      for (const passiveId of requiredPassives) {
        if (!ownedPassiveIds.has(passiveId)) {
          return false;
        }
      }
      return true;
    });
  }

  toOptions(evolutions: EvolutionData[], language: "ko" | "en"): LevelUpOption[] {
    return evolutions.slice(0, 3).map((evolution, index) => ({
      id: evolution.id,
      type: "evolution",
      category: "evolution",
      title: evolution.name[language],
      itemKind: evolution.type === "special_combo" ? "Combo EVO" : "Evolution",
      description: evolution.description[language],
      currentLevel: 0,
      nextLevel: 0,
      isNew: true,
      isMax: true,
      iconKey: evolution.iconKey,
      visualType: evolution.visualType,
      color: [0xfff176, 0x80deea, 0xffab91][index % 3],
      evolutionId: evolution.id,
      resultWeaponId: evolution.resultWeaponId
    }));
  }

  getEvolution(id: string): EvolutionData | undefined {
    return getEvolution(id);
  }
}
