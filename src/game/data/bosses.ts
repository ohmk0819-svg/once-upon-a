import { BossData } from "../types/gameTypes";

export const bosses: BossData[] = [
  {
    id: "bigBadWolf",
    name: { ko: "Big Bad Wolf", en: "Big Bad Wolf" },
    hp: 3200,
    damage: 20,
    moveSpeed: 70,
    visualType: "storybookBossWolf",
    color: 0xb8afa5,
    patterns: ["wolfDash", "pawSwipe", "playfulHowl"]
  },
  {
    id: "candyWitch",
    name: { ko: "Candy Witch", en: "Candy Witch" },
    hp: 4200,
    damage: 22,
    moveSpeed: 55,
    visualType: "candyWitch",
    color: 0xf06292,
    patterns: ["candyPuddle", "cookieSummon", "ovenPop"]
  },
  {
    id: "midnightQueen",
    name: { ko: "Midnight Stepmother Queen", en: "Midnight Stepmother Queen" },
    hp: 5200,
    damage: 24,
    moveSpeed: 60,
    visualType: "midnightQueen",
    color: 0x9575cd,
    patterns: ["clockHands", "glassShards", "carriageRush"]
  },
  {
    id: "oniIslandKing",
    name: { ko: "Oni Island King", en: "Oni Island King" },
    hp: 6500,
    damage: 26,
    moveSpeed: 50,
    visualType: "oniIslandKing",
    color: 0xb388ff,
    patterns: ["clubSlam", "oniRush", "oniFireDance"]
  }
];

export function getBoss(id: string): BossData {
  return bosses.find((boss) => boss.id === id) ?? bosses[0];
}
