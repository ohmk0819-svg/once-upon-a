import { EnemyData } from "../types/gameTypes";

export const enemies: EnemyData[] = [
  {
    id: "smallWolf",
    name: { ko: "작은 늑대", en: "Small Wolf" },
    hp: 20,
    damage: 8,
    moveSpeed: 80,
    expDrop: 1,
    behavior: "chase",
    visualType: "cuteWolf"
  },
  {
    id: "cookieSoldier",
    name: { ko: "쿠키 병사", en: "Cookie Soldier" },
    hp: 35,
    damage: 10,
    moveSpeed: 55,
    expDrop: 2,
    behavior: "chase",
    visualType: "gingerbreadSoldier"
  },
  {
    id: "forestMushroomBuddy",
    name: { ko: "숲 버섯 친구", en: "Forest Mushroom Buddy" },
    hp: 50,
    damage: 12,
    moveSpeed: 35,
    expDrop: 3,
    behavior: "slowChase",
    visualType: "roundMushroom"
  },
  {
    id: "bigWolf",
    name: { ko: "커다란 늑대", en: "Big Wolf" },
    hp: 600,
    damage: 18,
    moveSpeed: 75,
    expDrop: 20,
    behavior: "eliteChase",
    visualType: "bigCuteWolf"
  }
];

export function getEnemy(id: string): EnemyData {
  return enemies.find((enemy) => enemy.id === id) ?? enemies[0];
}
