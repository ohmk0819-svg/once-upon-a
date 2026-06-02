import Phaser from "phaser";
import { passives, getPassive } from "../data/passives";
import { weapons, getWeapon } from "../data/weapons";
import { LevelUpOption, PassiveState, UpgradeCategory, WeaponState } from "../types/gameTypes";
import { requiredExpForLevel } from "../utils/balance";

const OPTION_COLORS = [0xfff176, 0x80deea, 0xffab91, 0xce93d8, 0xa5d6a7, 0xffcc80];
const CHARACTER_PASSIVE_MAX_LEVEL = 3;

interface WeightedOption {
  option: LevelUpOption;
  weight: number;
  priority: boolean;
}

export class LevelSystem {
  level = 1;
  exp = 0;
  requiredExp = requiredExpForLevel(1);
  pendingLevelUps = 0;

  addExp(value: number, expGain: number): boolean {
    this.exp += value * expGain;
    let leveled = false;
    while (this.exp >= this.requiredExp) {
      this.exp -= this.requiredExp;
      this.level += 1;
      this.requiredExp = requiredExpForLevel(this.level);
      this.pendingLevelUps += 1;
      leveled = true;
    }
    return leveled;
  }

  consumeLevelUp(): boolean {
    if (this.pendingLevelUps <= 0) {
      return false;
    }
    this.pendingLevelUps -= 1;
    return true;
  }

  generateOptions(
    weaponStates: WeaponState[],
    passiveStates: PassiveState[],
    language: "ko" | "en",
    characterBaseWeaponId = "woodenPunch",
    characterPassiveLevel = 0
  ): LevelUpOption[] {
    const candidates: WeightedOption[] = [];

    if (characterPassiveLevel < CHARACTER_PASSIVE_MAX_LEVEL) {
      candidates.push({
        option: this.createOption({
          id: "growingWoodenHeart",
          type: "characterPassive",
          category: "character_passive",
          title: language === "ko" ? "자라는 나무 심장" : "Growing Wooden Heart",
          itemKind: language === "ko" ? "캐릭터 스킬" : "Character Skill",
          description:
            language === "ko"
              ? "피노키오의 공격속도가 추가로 6% 증가합니다."
              : "Pinocchio gains an extra +6% attack speed.",
          currentLevel: characterPassiveLevel,
          nextLevel: characterPassiveLevel + 1,
          maxLevel: CHARACTER_PASSIVE_MAX_LEVEL,
          iconKey: "Heart",
          visualType: "growingWoodenHeart"
        }),
        weight: 7,
        priority: true
      });
    }

    for (const state of weaponStates) {
      const weapon = getWeapon(state.id);
      if (state.level >= weapon.maxLevel) {
        continue;
      }
      const isBaseWeapon = state.id === characterBaseWeaponId;
      const next = weapon.levels[state.level];
      candidates.push({
        option: this.createOption({
          id: state.id,
          type: "weapon",
          category: isBaseWeapon ? "character_base_weapon" : "common_weapon",
          title: weapon.name[language],
          itemKind: isBaseWeapon
            ? language === "ko"
              ? "기본무기"
              : "Base Weapon"
            : language === "ko"
              ? "공용 무기"
              : "Common Weapon",
          description: next.description[language],
          currentLevel: state.level,
          nextLevel: state.level + 1,
          maxLevel: weapon.maxLevel,
          iconKey: weapon.iconKey,
          visualType: weapon.visualType
        }),
        weight: isBaseWeapon ? 9 : 5,
        priority: true
      });
    }

    for (const weapon of weapons) {
      if (weaponStates.some((state) => state.id === weapon.id)) {
        continue;
      }
      candidates.push({
        option: this.createOption({
          id: weapon.id,
          type: "weapon",
          category: "common_weapon",
          title: weapon.name[language],
          itemKind: language === "ko" ? "공용 무기" : "Common Weapon",
          description: weapon.levels[0].description[language],
          currentLevel: 0,
          nextLevel: 1,
          maxLevel: weapon.maxLevel,
          iconKey: weapon.iconKey,
          visualType: weapon.visualType
        }),
        weight: 4,
        priority: false
      });
    }

    for (const state of passiveStates) {
      const passive = getPassive(state.id);
      if (state.level >= passive.maxLevel) {
        continue;
      }
      const next = passive.levels[state.level];
      candidates.push({
        option: this.createOption({
          id: state.id,
          type: "passive",
          category: "common_passive",
          title: passive.name[language],
          itemKind: language === "ko" ? "공용 패시브" : "Common Passive",
          description: next.description[language],
          currentLevel: state.level,
          nextLevel: state.level + 1,
          maxLevel: passive.maxLevel,
          iconKey: passive.iconKey,
          visualType: passive.visualType
        }),
        weight: 5,
        priority: true
      });
    }

    for (const passive of passives) {
      if (passiveStates.some((state) => state.id === passive.id)) {
        continue;
      }
      candidates.push({
        option: this.createOption({
          id: passive.id,
          type: "passive",
          category: "common_passive",
          title: passive.name[language],
          itemKind: language === "ko" ? "공용 패시브" : "Common Passive",
          description: passive.levels[0].description[language],
          currentLevel: 0,
          nextLevel: 1,
          maxLevel: passive.maxLevel,
          iconKey: passive.iconKey,
          visualType: passive.visualType
        }),
        weight: 4,
        priority: false
      });
    }

    candidates.push({
      option: this.createOption({
        id: "heal",
        type: "heal",
        category: "healing",
        title: language === "ko" ? "따뜻한 이야기 조각" : "Warm Story Fragment",
        itemKind: language === "ko" ? "회복" : "Recovery",
        description: language === "ko" ? "HP를 30 회복합니다." : "Restore 30 HP.",
        currentLevel: 0,
        nextLevel: 0,
        maxLevel: 0,
        iconKey: "Heal",
        visualType: "warmStoryFragment"
      }),
      weight: 2,
      priority: false
    });

    const selected: LevelUpOption[] = [];
    const priorityPool = candidates.filter((candidate) => candidate.priority);
    if (priorityPool.length > 0) {
      selected.push(this.takeWeighted(priorityPool, candidates).option);
    }
    while (selected.length < 3 && candidates.length > 0) {
      selected.push(this.takeWeighted(candidates, candidates).option);
    }
    return selected.slice(0, 3).map((option, index) => ({
      ...option,
      color: OPTION_COLORS[index % OPTION_COLORS.length]
    }));
  }

  applyOption(option: LevelUpOption, weaponStates: WeaponState[], passiveStates: PassiveState[]): void {
    if (option.type === "weapon") {
      const current = weaponStates.find((state) => state.id === option.id);
      if (current) {
        current.level += 1;
      } else {
        weaponStates.push({ id: option.id, level: 1 });
      }
    }
    if (option.type === "passive") {
      const current = passiveStates.find((state) => state.id === option.id);
      if (current) {
        current.level += 1;
      } else {
        passiveStates.push({ id: option.id, level: 1 });
      }
    }
  }

  private createOption(input: {
    id: string;
    type: LevelUpOption["type"];
    category: UpgradeCategory;
    title: string;
    itemKind: string;
    description: string;
    currentLevel: number;
    nextLevel: number;
    maxLevel: number;
    iconKey: string;
    visualType: string;
  }): LevelUpOption {
    return {
      id: input.id,
      type: input.type,
      category: input.category,
      title: input.title,
      itemKind: input.itemKind,
      description: input.description,
      currentLevel: input.currentLevel,
      nextLevel: input.nextLevel,
      isNew: input.currentLevel === 0 && input.type !== "heal",
      isMax: input.maxLevel > 0 && input.nextLevel >= input.maxLevel,
      iconKey: input.iconKey,
      visualType: input.visualType,
      color: 0xffffff
    };
  }

  private takeWeighted(pool: WeightedOption[], source: WeightedOption[]): WeightedOption {
    const totalWeight = pool.reduce((total, candidate) => total + candidate.weight, 0);
    let roll = Math.random() * totalWeight;
    let chosen = pool[0];
    for (const candidate of pool) {
      roll -= candidate.weight;
      if (roll <= 0) {
        chosen = candidate;
        break;
      }
    }

    this.removeCandidate(source, chosen.option);
    this.removeCandidate(pool, chosen.option);
    Phaser.Utils.Array.Shuffle(source);
    return chosen;
  }

  private removeCandidate(pool: WeightedOption[], option: LevelUpOption): void {
    const index = pool.findIndex((candidate) => candidate.option.id === option.id && candidate.option.type === option.type);
    if (index >= 0) {
      pool.splice(index, 1);
    }
  }
}
