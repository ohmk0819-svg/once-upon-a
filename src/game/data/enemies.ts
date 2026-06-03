import { EnemyData } from "../types/gameTypes";

export const enemies: EnemyData[] = [
  { id: "smallWolf", name: { ko: "Small Wolf", en: "Small Wolf" }, hp: 20, damage: 8, moveSpeed: 80, expDrop: 1, behavior: "chase", visualType: "cuteWolf", color: 0xa7a39d },
  { id: "cookieSoldier", name: { ko: "Cookie Soldier", en: "Cookie Soldier" }, hp: 35, damage: 10, moveSpeed: 55, expDrop: 2, behavior: "chase", visualType: "gingerbreadSoldier", color: 0xc58b4d },
  { id: "forestMushroomBuddy", name: { ko: "Forest Mushroom Buddy", en: "Forest Mushroom Buddy" }, hp: 50, damage: 12, moveSpeed: 35, expDrop: 3, behavior: "slowChase", visualType: "roundMushroom", color: 0x8bc34a },
  { id: "bigWolf", name: { ko: "Big Wolf", en: "Big Wolf" }, hp: 600, damage: 18, moveSpeed: 75, expDrop: 20, behavior: "eliteChase", visualType: "bigCuteWolf", color: 0x8d8984 },

  { id: "redHoodShadow", name: { ko: "Red Hood Shadow", en: "Red Hood Shadow" }, hp: 28, damage: 9, moveSpeed: 115, expDrop: 2, behavior: "fastChase", visualType: "redHoodShadow", color: 0xff6f91 },
  { id: "toyCrow", name: { ko: "Toy Crow", en: "Toy Crow" }, hp: 24, damage: 8, moveSpeed: 95, expDrop: 2, behavior: "ranged", visualType: "toyCrow", color: 0x5c6bc0 },
  { id: "rootSprout", name: { ko: "Root Sprout", en: "Root Sprout" }, hp: 62, damage: 13, moveSpeed: 42, expDrop: 3, behavior: "slowChase", visualType: "rootSprout", color: 0x7cb342 },
  { id: "treeStumpGolem", name: { ko: "Tree Stump Golem", en: "Tree Stump Golem" }, hp: 780, damage: 20, moveSpeed: 45, expDrop: 24, behavior: "tank", visualType: "treeStumpGolem", color: 0x8d6e63 },

  { id: "candyBat", name: { ko: "Candy Bat", en: "Candy Bat" }, hp: 22, damage: 9, moveSpeed: 125, expDrop: 2, behavior: "fastChase", visualType: "candyBat", color: 0xff8ac2 },
  { id: "jellySlime", name: { ko: "Jelly Slime", en: "Jelly Slime" }, hp: 44, damage: 11, moveSpeed: 62, expDrop: 3, behavior: "explodeOnDeath", visualType: "jellySlime", color: 0xba68c8 },
  { id: "chocolateGolem", name: { ko: "Chocolate Golem", en: "Chocolate Golem" }, hp: 90, damage: 16, moveSpeed: 34, expDrop: 4, behavior: "tank", visualType: "chocolateGolem", color: 0x795548 },
  { id: "sugarGhost", name: { ko: "Sugar Ghost", en: "Sugar Ghost" }, hp: 38, damage: 11, moveSpeed: 58, expDrop: 3, behavior: "ranged", visualType: "sugarGhost", color: 0xf8bbd0 },
  { id: "breadCrumbMouse", name: { ko: "Bread Crumb Mouse", en: "Bread Crumb Mouse" }, hp: 26, damage: 9, moveSpeed: 130, expDrop: 2, behavior: "fastChase", visualType: "breadCrumbMouse", color: 0xd7a86e },
  { id: "ovenSpark", name: { ko: "Oven Spark", en: "Oven Spark" }, hp: 30, damage: 16, moveSpeed: 90, expDrop: 3, behavior: "explodeOnDeath", visualType: "ovenSpark", color: 0xff8a3d },
  { id: "giantCookieKnight", name: { ko: "Giant Cookie Knight", en: "Giant Cookie Knight" }, hp: 850, damage: 22, moveSpeed: 52, expDrop: 24, behavior: "eliteChase", visualType: "giantCookieKnight", color: 0xc58b4d },
  { id: "candyCart", name: { ko: "Candy Cart", en: "Candy Cart" }, hp: 760, damage: 24, moveSpeed: 78, expDrop: 24, behavior: "dash", visualType: "candyCart", color: 0xff80ab },

  { id: "ballroomGhost", name: { ko: "Ballroom Ghost", en: "Ballroom Ghost" }, hp: 34, damage: 10, moveSpeed: 76, expDrop: 2, behavior: "chase", visualType: "ballroomGhost", color: 0xb3e5fc },
  { id: "clockSoldier", name: { ko: "Clock Soldier", en: "Clock Soldier" }, hp: 48, damage: 14, moveSpeed: 88, expDrop: 3, behavior: "dash", visualType: "clockSoldier", color: 0xffd54f },
  { id: "glassSlipperSprite", name: { ko: "Glass Slipper Sprite", en: "Glass Slipper Sprite" }, hp: 32, damage: 10, moveSpeed: 92, expDrop: 3, behavior: "explodeOnDeath", visualType: "glassSlipperSprite", color: 0x90caf9 },
  { id: "candleKnight", name: { ko: "Candle Knight", en: "Candle Knight" }, hp: 46, damage: 12, moveSpeed: 58, expDrop: 3, behavior: "ranged", visualType: "candleKnight", color: 0xffcc80 },
  { id: "roseVine", name: { ko: "Rose Vine", en: "Rose Vine" }, hp: 62, damage: 12, moveSpeed: 18, expDrop: 4, behavior: "stationaryShooter", visualType: "roseVine", color: 0xf48fb1 },
  { id: "pumpkinMouse", name: { ko: "Pumpkin Mouse", en: "Pumpkin Mouse" }, hp: 24, damage: 9, moveSpeed: 132, expDrop: 2, behavior: "fastChase", visualType: "pumpkinMouse", color: 0xffa43f },
  { id: "palaceShadow", name: { ko: "Palace Shadow", en: "Palace Shadow" }, hp: 40, damage: 13, moveSpeed: 96, expDrop: 3, behavior: "fastChase", visualType: "palaceShadow", color: 0x7e57c2 },
  { id: "giantClockSoldier", name: { ko: "Giant Clock Soldier", en: "Giant Clock Soldier" }, hp: 920, damage: 24, moveSpeed: 58, expDrop: 26, behavior: "eliteChase", visualType: "giantClockSoldier", color: 0xffd54f },
  { id: "roseKnight", name: { ko: "Rose Knight", en: "Rose Knight" }, hp: 880, damage: 22, moveSpeed: 66, expDrop: 26, behavior: "eliteChase", visualType: "roseKnight", color: 0xec407a },

  { id: "littleOni", name: { ko: "Little Oni", en: "Little Oni" }, hp: 36, damage: 11, moveSpeed: 82, expDrop: 2, behavior: "chase", visualType: "littleOni", color: 0xff8a65 },
  { id: "clubOni", name: { ko: "Club Oni", en: "Club Oni" }, hp: 70, damage: 18, moveSpeed: 46, expDrop: 4, behavior: "tank", visualType: "clubOni", color: 0xba68c8 },
  { id: "turtleGuard", name: { ko: "Turtle Guard", en: "Turtle Guard" }, hp: 100, damage: 14, moveSpeed: 30, expDrop: 4, behavior: "tank", visualType: "turtleGuard", color: 0x4db6ac },
  { id: "fishYokai", name: { ko: "Fish Yokai", en: "Fish Yokai" }, hp: 42, damage: 12, moveSpeed: 72, expDrop: 3, behavior: "ranged", visualType: "fishYokai", color: 0x4fc3f7 },
  { id: "monkeyShadow", name: { ko: "Monkey Shadow", en: "Monkey Shadow" }, hp: 30, damage: 11, moveSpeed: 138, expDrop: 2, behavior: "fastChase", visualType: "monkeyShadow", color: 0xffb74d },
  { id: "peachSpirit", name: { ko: "Peach Spirit", en: "Peach Spirit" }, hp: 44, damage: 13, moveSpeed: 74, expDrop: 3, behavior: "explodeOnDeath", visualType: "peachSpirit", color: 0xffab91 },
  { id: "cloudImp", name: { ko: "Cloud Imp", en: "Cloud Imp" }, hp: 40, damage: 12, moveSpeed: 68, expDrop: 3, behavior: "ranged", visualType: "cloudImp", color: 0xb3e5fc },
  { id: "oniGeneral", name: { ko: "Oni General", en: "Oni General" }, hp: 980, damage: 26, moveSpeed: 56, expDrop: 28, behavior: "eliteChase", visualType: "oniGeneral", color: 0xff7043 },
  { id: "dragonPalaceGatekeeper", name: { ko: "Dragon Palace Gatekeeper", en: "Dragon Palace Gatekeeper" }, hp: 1050, damage: 24, moveSpeed: 44, expDrop: 28, behavior: "tank", visualType: "dragonPalaceGatekeeper", color: 0x4dd0e1 }
];

export function getEnemy(id: string): EnemyData {
  return enemies.find((enemy) => enemy.id === id) ?? enemies[0];
}
