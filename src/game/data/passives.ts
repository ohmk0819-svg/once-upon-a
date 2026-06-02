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
  }
];

export function getPassive(id: string): PassiveData {
  return passives.find((passive) => passive.id === id) ?? passives[0];
}
