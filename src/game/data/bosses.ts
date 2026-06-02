import { BossData } from "../types/gameTypes";

export const bosses: BossData[] = [
  {
    id: "bigBadWolf",
    name: { ko: "커다란 늑대 대장", en: "Big Bad Wolf" },
    hp: 3200,
    damage: 20,
    moveSpeed: 70,
    visualType: "storybookBossWolf"
  }
];

export function getBoss(id: string): BossData {
  return bosses.find((boss) => boss.id === id) ?? bosses[0];
}
