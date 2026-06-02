import { StageData } from "../types/gameTypes";

export const stages: StageData[] = [
  {
    id: "topsyTurvyStorybookForest",
    name: {
      ko: "뒤섞인 동화의 숲",
      en: "Topsy-Turvy Storybook Forest"
    },
    durationSeconds: 300,
    bossTimeSeconds: 300,
    backgroundColor: "#b4ee81",
    timeline: [
      { atSeconds: 0, event: "addEnemy", enemyId: "smallWolf" },
      { atSeconds: 60, event: "addEnemy", enemyId: "cookieSoldier" },
      { atSeconds: 120, event: "addEnemy", enemyId: "forestMushroomBuddy" },
      { atSeconds: 180, event: "spawnElite", enemyId: "bigWolf" },
      { atSeconds: 240, event: "increaseDensity" },
      { atSeconds: 300, event: "spawnBoss", bossId: "bigBadWolf" }
    ]
  }
];

export function getStage(id: string): StageData {
  return stages.find((stage) => stage.id === id) ?? stages[0];
}
