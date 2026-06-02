import { CharacterData } from "../types/gameTypes";

export const characters: CharacterData[] = [
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
    maxHp: 130,
    hpRegenPerSecond: 0.6,
    attackMultiplier: 0.95,
    moveSpeed: 0.9,
    attackSpeed: 1,
    critChance: 0.03,
    passiveId: "growingWoodenHeart",
    baseWeaponId: "woodenPunch",
    ultimateId: "realBoyMight",
    visualType: "brightBlueWoodenDoll"
  }
];

export function getCharacter(id: string): CharacterData {
  return characters.find((character) => character.id === id) ?? characters[0];
}
