import { StageData } from "../types/gameTypes";

export const stages: StageData[] = [
  {
    id: "topsyTurvyStorybookForest",
    name: { ko: "Topsy-Turvy Storybook Forest", en: "Topsy-Turvy Storybook Forest" },
    description: { ko: "A bright beginner forest of mixed fairy tales.", en: "A bright beginner forest of mixed fairy tales." },
    difficulty: "easy",
    durationSeconds: 900,
    bossTimeSeconds: 900,
    normalBossTimeSec: 900,
    devBossTimeSec: 180,
    backgroundColor: "#b4ee81",
    colorPalette: { background: 0xb4ee81, ground: 0x8edb74, accent: 0xc88955 },
    bossId: "bigBadWolf",
    enemyPool: ["smallWolf", "cookieSoldier", "forestMushroomBuddy", "redHoodShadow", "toyCrow", "rootSprout"],
    elitePool: ["bigWolf", "treeStumpGolem"],
    timeline: [
      { atSeconds: 0, event: "addEnemy", enemyId: "smallWolf" },
      { atSeconds: 90, event: "addEnemy", enemyId: "cookieSoldier" },
      { atSeconds: 180, event: "spawnElite" },
      { atSeconds: 300, event: "addEnemy", enemyId: "forestMushroomBuddy" },
      { atSeconds: 480, event: "increaseDensity" },
      { atSeconds: 600, event: "spawnElite" },
      { atSeconds: 720, event: "addEnemy", enemyId: "rootSprout" },
      { atSeconds: 840, event: "increaseDensity" },
      { atSeconds: 900, event: "spawnBoss", bossId: "bigBadWolf" }
    ]
  },
  {
    id: "candyCottageCarnival",
    name: { ko: "Candy Cottage Carnival", en: "Candy Cottage Carnival" },
    description: { ko: "A sweet carnival of cookies, candy, and jelly.", en: "A sweet carnival of cookies, candy, and jelly." },
    difficulty: "normal",
    durationSeconds: 900,
    bossTimeSeconds: 900,
    normalBossTimeSec: 900,
    devBossTimeSec: 180,
    backgroundColor: "#ffd3e2",
    colorPalette: { background: 0xffd3e2, ground: 0xfff4c7, accent: 0x8d5f37 },
    bossId: "candyWitch",
    enemyPool: ["cookieSoldier", "candyBat", "jellySlime", "chocolateGolem", "sugarGhost", "breadCrumbMouse", "ovenSpark"],
    elitePool: ["giantCookieKnight", "candyCart"],
    timeline: [
      { atSeconds: 0, event: "addEnemy", enemyId: "cookieSoldier" },
      { atSeconds: 90, event: "addEnemy", enemyId: "candyBat" },
      { atSeconds: 180, event: "spawnElite" },
      { atSeconds: 300, event: "addEnemy", enemyId: "jellySlime" },
      { atSeconds: 480, event: "increaseDensity" },
      { atSeconds: 600, event: "spawnElite" },
      { atSeconds: 720, event: "addEnemy", enemyId: "ovenSpark" },
      { atSeconds: 840, event: "increaseDensity" },
      { atSeconds: 900, event: "spawnBoss", bossId: "candyWitch" }
    ]
  },
  {
    id: "midnightPalace",
    name: { ko: "Midnight Palace", en: "Midnight Palace" },
    description: { ko: "A glittering palace of clocks, glass slippers, and roses.", en: "A glittering palace of clocks, glass slippers, and roses." },
    difficulty: "hard",
    durationSeconds: 900,
    bossTimeSeconds: 900,
    normalBossTimeSec: 900,
    devBossTimeSec: 180,
    backgroundColor: "#cfe7ff",
    colorPalette: { background: 0xcfe7ff, ground: 0xd8c8ff, accent: 0xffd54f },
    bossId: "midnightQueen",
    enemyPool: ["ballroomGhost", "clockSoldier", "glassSlipperSprite", "candleKnight", "roseVine", "pumpkinMouse", "palaceShadow"],
    elitePool: ["giantClockSoldier", "roseKnight"],
    timeline: [
      { atSeconds: 0, event: "addEnemy", enemyId: "ballroomGhost" },
      { atSeconds: 90, event: "addEnemy", enemyId: "pumpkinMouse" },
      { atSeconds: 180, event: "spawnElite" },
      { atSeconds: 300, event: "addEnemy", enemyId: "clockSoldier" },
      { atSeconds: 480, event: "increaseDensity" },
      { atSeconds: 600, event: "spawnElite" },
      { atSeconds: 720, event: "addEnemy", enemyId: "roseVine" },
      { atSeconds: 840, event: "increaseDensity" },
      { atSeconds: 900, event: "spawnBoss", bossId: "midnightQueen" }
    ]
  },
  {
    id: "peachIslandDragonPalace",
    name: { ko: "Peach Island & Dragon Palace", en: "Peach Island & Dragon Palace" },
    description: { ko: "A festive island where peach shores meet a dragon palace.", en: "A festive island where peach shores meet a dragon palace." },
    difficulty: "expert",
    durationSeconds: 900,
    bossTimeSeconds: 900,
    normalBossTimeSec: 900,
    devBossTimeSec: 180,
    backgroundColor: "#9be7db",
    colorPalette: { background: 0x9be7db, ground: 0xffc6a6, accent: 0xb388ff },
    bossId: "oniIslandKing",
    enemyPool: ["littleOni", "clubOni", "turtleGuard", "fishYokai", "monkeyShadow", "peachSpirit", "cloudImp"],
    elitePool: ["oniGeneral", "dragonPalaceGatekeeper"],
    timeline: [
      { atSeconds: 0, event: "addEnemy", enemyId: "littleOni" },
      { atSeconds: 90, event: "addEnemy", enemyId: "monkeyShadow" },
      { atSeconds: 180, event: "spawnElite" },
      { atSeconds: 300, event: "addEnemy", enemyId: "turtleGuard" },
      { atSeconds: 480, event: "increaseDensity" },
      { atSeconds: 600, event: "spawnElite" },
      { atSeconds: 720, event: "addEnemy", enemyId: "cloudImp" },
      { atSeconds: 840, event: "increaseDensity" },
      { atSeconds: 900, event: "spawnBoss", bossId: "oniIslandKing" }
    ]
  }
];

for (const stage of stages) {
  stage.waveTimeline = stage.timeline;
}

export function getStage(id: string): StageData {
  return stages.find((stage) => stage.id === id) ?? stages[0];
}
