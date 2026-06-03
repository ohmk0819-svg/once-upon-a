import { CharacterData } from "../types/gameTypes";

export const characters: CharacterData[] = [
  {
    id: "woodcutter",
    name: {
      ko: "금도끼 은도끼 나무꾼",
      en: "Woodcutter"
    },
    description: {
      ko: "도끼를 던지고 회수하며 강력한 치명타를 노리는 숙련자용 캐릭터.",
      en: "A tricky axe catcher who turns precise movement into explosive crit damage."
    },
    difficulty: "hard",
    maxHp: 105,
    hpRegenPerSecond: 0.45,
    attackMultiplier: 1.05,
    moveSpeed: 1,
    attackSpeed: 1,
    critChance: 0.05,
    critDamage: 2,
    passiveId: "honestHands",
    baseWeaponId: "oldAxe",
    ultimateId: "honestAxeStorm",
    visualType: "roundWoodcutter",
    color: 0x8bc34a
  },
  {
    id: "pinocchio",
    name: {
      ko: "피노키오",
      en: "Pinocchio"
    },
    description: {
      ko: "튼튼한 근접 브루저. 레벨업할수록 공격속도가 빨라진다.",
      en: "A sturdy melee bruiser who attacks faster as he levels up."
    },
    difficulty: "easy",
    maxHp: 130,
    hpRegenPerSecond: 0.6,
    attackMultiplier: 0.95,
    moveSpeed: 0.9,
    attackSpeed: 1,
    critChance: 0.03,
    critDamage: 2,
    passiveId: "growingWoodenHeart",
    baseWeaponId: "woodenPunch",
    ultimateId: "realBoyMight",
    visualType: "brightBlueWoodenDoll",
    color: 0x64c7ff
  },
  {
    id: "cinderella",
    name: {
      ko: "신데렐라",
      en: "Cinderella"
    },
    description: {
      ko: "이동하며 유리파편을 날리는 쉬운 원거리 기동 캐릭터.",
      en: "A graceful ranged attacker who grows stronger while moving."
    },
    difficulty: "easy",
    maxHp: 90,
    hpRegenPerSecond: 0.4,
    attackMultiplier: 1,
    moveSpeed: 1.15,
    attackSpeed: 1.05,
    critChance: 0.05,
    critDamage: 2,
    passiveId: "midnightFootwork",
    baseWeaponId: "glassShards",
    ultimateId: "pumpkinCarriageParade",
    visualType: "brightCinderella",
    color: 0x64b5f6
  },
  {
    id: "momotaro",
    name: {
      ko: "모모타로",
      en: "Momotaro"
    },
    description: {
      ko: "개, 원숭이, 꿩과 함께 싸우는 소환수 중심 캐릭터.",
      en: "A commander who fights with loyal animal companions."
    },
    difficulty: "hard",
    maxHp: 105,
    hpRegenPerSecond: 0.45,
    attackMultiplier: 0.95,
    moveSpeed: 1,
    attackSpeed: 0.95,
    critChance: 0.04,
    critDamage: 2,
    passiveId: "oniIslandBanner",
    baseWeaponId: "peachBlade",
    ultimateId: "oniIslandExpedition",
    visualType: "brightMomotaro",
    color: 0xff8a65
  }
];

export function getCharacter(id: string): CharacterData {
  return characters.find((character) => character.id === id) ?? characters[1];
}
