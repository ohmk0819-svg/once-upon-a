import { PassiveData } from "../types/gameTypes";

export const passives: PassiveData[] = [
  {
    id: "sleepingSpindle",
    name: { ko: "잠자는 숲속의 물레", en: "Sleeping Spindle" },
    kind: "attackSpeed",
    maxLevel: 3,
    visualType: "spindle",
    iconKey: "Spindle",
    levels: [
      { level: 1, description: { ko: "공격속도 +10%", en: "Attack speed +10%" }, attackSpeedBonus: 0.1 },
      { level: 2, description: { ko: "공격속도 +20%", en: "Attack speed +20%" }, attackSpeedBonus: 0.2 },
      { level: 3, description: { ko: "공격속도 +35%", en: "Attack speed +35%" }, attackSpeedBonus: 0.35 }
    ]
  },
  {
    id: "princesCloak",
    name: { ko: "왕자의 망토", en: "Prince's Cloak" },
    kind: "damageReduction",
    maxLevel: 3,
    visualType: "cloak",
    iconKey: "Cloak",
    levels: [
      { level: 1, description: { ko: "받는 피해 -8%", en: "Incoming damage -8%" }, damageReduction: 0.08 },
      { level: 2, description: { ko: "받는 피해 -15%", en: "Incoming damage -15%" }, damageReduction: 0.15 },
      { level: 3, description: { ko: "받는 피해 -25%", en: "Incoming damage -25%" }, damageReduction: 0.25 }
    ]
  },
  {
    id: "oldStorybook",
    name: { ko: "오래된 이야기책", en: "Old Storybook" },
    kind: "expGain",
    maxLevel: 3,
    visualType: "storybook",
    iconKey: "Book",
    levels: [
      { level: 1, description: { ko: "경험치 획득량 +10%", en: "EXP gain +10%" }, expGainBonus: 0.1 },
      { level: 2, description: { ko: "경험치 획득량 +20%", en: "EXP gain +20%" }, expGainBonus: 0.2 },
      { level: 3, description: { ko: "경험치 획득량 +35%", en: "EXP gain +35%" }, expGainBonus: 0.35 }
    ]
  },
  {
    id: "wolfsClaw",
    name: { ko: "늑대의 발톱", en: "Wolf's Claw" },
    kind: "crit",
    maxLevel: 3,
    visualType: "claw",
    iconKey: "Claw",
    levels: [
      { level: 1, description: { ko: "치명타 확률 +10%", en: "Crit chance +10%" }, critChanceBonus: 0.1 },
      { level: 2, description: { ko: "치명타 확률 +15%, 피해 +20%", en: "Crit chance +15%, damage +20%" }, critChanceBonus: 0.15, critDamageBonus: 0.2 },
      { level: 3, description: { ko: "치명타 확률 +25%, 피해 +40%", en: "Crit chance +25%, damage +40%" }, critChanceBonus: 0.25, critDamageBonus: 0.4 }
    ]
  },
  {
    id: "wizardsBook",
    name: { ko: "마법사의 책", en: "Wizard's Book" },
    kind: "cooldownReduction",
    maxLevel: 3,
    visualType: "wizardBook",
    iconKey: "Wizard",
    levels: [
      { level: 1, description: { ko: "쿨타임 -8%", en: "Cooldown -8%" }, cooldownReduction: 0.08 },
      { level: 2, description: { ko: "쿨타임 -15%", en: "Cooldown -15%" }, cooldownReduction: 0.15 },
      { level: 3, description: { ko: "쿨타임 -25%", en: "Cooldown -25%" }, cooldownReduction: 0.25 }
    ]
  },
  {
    id: "fairysBlessing",
    name: { ko: "요정의 축복", en: "Fairy's Blessing" },
    kind: "expGain",
    maxLevel: 3,
    visualType: "fairyBlessing",
    iconKey: "Luck",
    levels: [
      { level: 1, description: { ko: "행운 +10%", en: "Luck +10%" }, luckBonus: 0.1 },
      { level: 2, description: { ko: "행운 +20%", en: "Luck +20%" }, luckBonus: 0.2 },
      { level: 3, description: { ko: "행운 +35%", en: "Luck +35%" }, luckBonus: 0.35 }
    ]
  },
  {
    id: "witchsBlackHat",
    name: { ko: "마녀의 검은 모자", en: "Witch's Black Hat" },
    kind: "crit",
    maxLevel: 3,
    visualType: "blackHat",
    iconKey: "Hat",
    levels: [
      { level: 1, description: { ko: "공격력 +12%, 받는 피해 +4%", en: "Damage +12%, incoming damage +4%" }, attackMultiplierBonus: 0.12, incomingDamageIncrease: 0.04 },
      { level: 2, description: { ko: "공격력 +24%, 받는 피해 +6%", en: "Damage +24%, incoming damage +6%" }, attackMultiplierBonus: 0.24, incomingDamageIncrease: 0.06 },
      { level: 3, description: { ko: "공격력 +40%, 받는 피해 +8%", en: "Damage +40%, incoming damage +8%" }, attackMultiplierBonus: 0.4, incomingDamageIncrease: 0.08 }
    ]
  },
  {
    id: "sevenDwarfsPickaxe",
    name: { ko: "일곱 난쟁이의 곡괭이", en: "Seven Dwarfs' Pickaxe" },
    kind: "expGain",
    maxLevel: 3,
    visualType: "pickaxe",
    iconKey: "Pick",
    levels: [
      { level: 1, description: { ko: "동화 조각 획득 +15%", en: "Story fragment gain +15%" }, currencyGainBonus: 0.15 },
      { level: 2, description: { ko: "동화 조각 획득 +30%", en: "Story fragment gain +30%" }, currencyGainBonus: 0.3 },
      { level: 3, description: { ko: "동화 조각 획득 +45%", en: "Story fragment gain +45%" }, currencyGainBonus: 0.45, luckBonus: 0.08 }
    ]
  },
  {
    id: "peterPansShadow",
    name: { ko: "피터팬의 그림자", en: "Peter Pan's Shadow" },
    kind: "damageReduction",
    maxLevel: 3,
    visualType: "shadow",
    iconKey: "Shadow",
    levels: [
      { level: 1, description: { ko: "이동속도 +8%", en: "Move speed +8%" }, moveSpeedBonus: 0.08 },
      { level: 2, description: { ko: "이동속도 +15%, 회피 +3%", en: "Move speed +15%, evasion +3%" }, moveSpeedBonus: 0.15, evasionChanceBonus: 0.03 },
      { level: 3, description: { ko: "이동속도 +25%, 회피 +6%", en: "Move speed +25%, evasion +6%" }, moveSpeedBonus: 0.25, evasionChanceBonus: 0.06 }
    ]
  },
  {
    id: "candyHouseKey",
    name: { ko: "과자집 열쇠", en: "Candy House Key" },
    kind: "damageReduction",
    maxLevel: 3,
    visualType: "candyKey",
    iconKey: "Candy",
    levels: [
      { level: 1, description: { ko: "회복량 +20%", en: "Healing +20%" }, healingMultiplierBonus: 0.2 },
      { level: 2, description: { ko: "회복량 +35%, 행운 +5%", en: "Healing +35%, luck +5%" }, healingMultiplierBonus: 0.35, luckBonus: 0.05 },
      { level: 3, description: { ko: "회복량 +50%, 행운 +10%", en: "Healing +50%, luck +10%" }, healingMultiplierBonus: 0.5, luckBonus: 0.1 }
    ]
  },
  {
    id: "redShoes",
    name: { ko: "빨간 구두", en: "Red Shoes" },
    kind: "attackSpeed",
    maxLevel: 3,
    visualType: "redShoes",
    iconKey: "Shoes",
    levels: [
      { level: 1, description: { ko: "이동 중 공격력 +8%", en: "Damage while moving +8%" }, movingDamageBonus: 0.08 },
      { level: 2, description: { ko: "이동 중 공격력 +15%, 이동속도 +5%", en: "Moving damage +15%, speed +5%" }, movingDamageBonus: 0.15, moveSpeedBonus: 0.05 },
      { level: 3, description: { ko: "이동 중 공격력 +25%, 이동속도 +10%", en: "Moving damage +25%, speed +10%" }, movingDamageBonus: 0.25, moveSpeedBonus: 0.1 }
    ]
  },
  {
    id: "aladdinsLamp",
    name: { ko: "알라딘의 램프", en: "Aladdin's Lamp" },
    kind: "expGain",
    maxLevel: 3,
    visualType: "lamp",
    iconKey: "Lamp",
    levels: [
      { level: 1, description: { ko: "행운 +12%", en: "Luck +12%" }, luckBonus: 0.12 },
      { level: 2, description: { ko: "행운 +24%", en: "Luck +24%" }, luckBonus: 0.24 },
      { level: 3, description: { ko: "행운 +36%, 동화 조각 +10%", en: "Luck +36%, fragments +10%" }, luckBonus: 0.36, currencyGainBonus: 0.1 }
    ]
  },
  {
    id: "goblinCloak",
    name: { ko: "도깨비 감투", en: "Goblin Cloak" },
    kind: "damageReduction",
    maxLevel: 3,
    visualType: "goblinCloak",
    iconKey: "Cloak+",
    levels: [
      { level: 1, description: { ko: "회피율 +5%", en: "Evasion +5%" }, evasionChanceBonus: 0.05 },
      { level: 2, description: { ko: "회피율 +8%, 받는 피해 -5%", en: "Evasion +8%, damage taken -5%" }, evasionChanceBonus: 0.08, damageReduction: 0.05 },
      { level: 3, description: { ko: "회피율 +12%, 공격력 +8%", en: "Evasion +12%, damage +8%" }, evasionChanceBonus: 0.12, attackMultiplierBonus: 0.08 }
    ]
  },
  {
    id: "tigersPersimmon",
    name: { ko: "호랑이의 곶감", en: "Tiger's Persimmon" },
    kind: "damageReduction",
    maxLevel: 3,
    visualType: "persimmon",
    iconKey: "Persim",
    levels: [
      { level: 1, description: { ko: "가까운 적 이동속도 감소", en: "Nearby enemies slow slightly" }, enemySlowAura: 0.08 },
      { level: 2, description: { ko: "가까운 적 이동속도 더 감소", en: "Nearby enemies slow more" }, enemySlowAura: 0.14 },
      { level: 3, description: { ko: "가까운 적 둔화 + 공격력 증가", en: "Enemy slow and damage up" }, enemySlowAura: 0.2, attackMultiplierBonus: 0.08 }
    ]
  },
  {
    id: "rabbitsLiver",
    name: { ko: "토끼의 간", en: "Rabbit's Liver" },
    kind: "damageReduction",
    maxLevel: 3,
    visualType: "rabbitLiver",
    iconKey: "Liver",
    levels: [
      { level: 1, description: { ko: "최대 HP +10%", en: "Max HP +10%" }, maxHpMultiplierBonus: 0.1 },
      { level: 2, description: { ko: "최대 HP +20%, 재생 +0.2/s", en: "Max HP +20%, regen +0.2/s" }, maxHpMultiplierBonus: 0.2, hpRegenBonus: 0.2 },
      { level: 3, description: { ko: "최대 HP +30%, 재생 +0.35/s", en: "Max HP +30%, regen +0.35/s" }, maxHpMultiplierBonus: 0.3, hpRegenBonus: 0.35, healingMultiplierBonus: 0.15 }
    ]
  },
  {
    id: "milletDumplings",
    name: { ko: "수수경단", en: "Millet Dumplings" },
    kind: "attackSpeed",
    maxLevel: 3,
    visualType: "dumplings",
    iconKey: "Dango",
    levels: [
      { level: 1, description: { ko: "소환수 피해 +15%", en: "Summon damage +15%" }, summonDamageMultiplier: 1.15 },
      { level: 2, description: { ko: "소환수 피해 +25%, 속도 +15%", en: "Summon damage +25%, speed +15%" }, summonDamageMultiplier: 1.25, summonAttackSpeedMultiplier: 1.15 },
      { level: 3, description: { ko: "소환수 피해 +40%, 속도 +25%, 임시 아군 지속 증가", en: "Summon damage +40%, speed +25%, allies last longer" }, summonDamageMultiplier: 1.4, summonAttackSpeedMultiplier: 1.25, temporaryAllyDurationMultiplier: 1.35, summonDurationMultiplier: 1.2 }
    ]
  }
];

export function getPassive(id: string): PassiveData {
  return passives.find((passive) => passive.id === id) ?? passives[0];
}
