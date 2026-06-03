import { LocalizedText } from "../types/gameTypes";

export type AchievementCategory = "progress" | "character" | "combat" | "boss" | "collection" | "challenge";

export interface AchievementData {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  rewardCurrency: number;
  category: AchievementCategory;
  hidden?: boolean;
}

const rows: Array<[string, string, string, number, AchievementCategory]> = [
  ["first_page", "First Page", "Start your first game.", 25, "progress"],
  ["first_level_up", "First Level Up", "Level up for the first time.", 25, "progress"],
  ["first_clear", "First Clear", "Clear any stage.", 75, "progress"],
  ["storybook_survivor", "Storybook Survivor", "Survive for 15 minutes.", 100, "progress"],
  ["four_tales_begin", "Four Tales Begin", "Play all four characters.", 100, "progress"],
  ["world_traveler", "World Traveler", "Play all four stages.", 100, "progress"],
  ["boss_beginner", "Boss Beginner", "Defeat one boss.", 75, "progress"],
  ["boss_collector", "Boss Collector", "Defeat all four bosses.", 200, "progress"],
  ["honest_hands_clear", "Honest Hands", "Clear with Woodcutter.", 100, "character"],
  ["real_boy_clear", "Real Boy", "Clear with Pinocchio.", 100, "character"],
  ["midnight_waltz_clear", "Midnight Waltz", "Clear with Cinderella.", 100, "character"],
  ["peach_commander_clear", "Peach Commander", "Clear with Momotaro.", 100, "character"],
  ["axe_catcher", "Axe Catcher", "Catch 50 axes as Woodcutter.", 100, "character"],
  ["punch_storm", "Punch Storm", "Reach high attack speed as Pinocchio.", 100, "character"],
  ["glass_dancer", "Glass Dancer", "Trigger dash-empowered attacks as Cinderella.", 100, "character"],
  ["loyal_companions", "Loyal Companions", "Let Momotaro companions defeat many enemies.", 100, "character"],
  ["little_cleanup", "Little Cleanup", "Defeat 500 enemies total.", 75, "combat"],
  ["big_cleanup", "Big Cleanup", "Defeat 2000 enemies total.", 200, "combat"],
  ["crit_fairy_tale", "Crit Fairy Tale", "Land many critical hits.", 100, "combat"],
  ["dash_master", "Dash Master", "Use Fairy Dash 100 times.", 100, "combat"],
  ["ultimate_moment", "Ultimate Moment", "Use ultimates 20 times.", 100, "combat"],
  ["no_panic", "No Panic", "Survive while badly hurt.", 100, "challenge"],
  ["shiny_hunter", "Shiny Hunter", "Defeat 20 elites.", 125, "combat"],
  ["story_shard_saver", "Story Shard Saver", "Earn 1000 Story Shards total.", 150, "progress"],
  ["first_evolution", "First Evolution", "Obtain your first evolution.", 75, "collection"],
  ["evolution_student", "Evolution Student", "Discover 5 evolutions.", 100, "collection"],
  ["evolution_scholar", "Evolution Scholar", "Discover 12 evolutions.", 150, "collection"],
  ["evolution_master", "Evolution Master", "Discover all 20 evolutions.", 300, "collection"],
  ["weapon_collector", "Weapon Collector", "Discover 16 shared weapons.", 200, "collection"],
  ["passive_collector", "Passive Collector", "Discover 16 shared passives.", 200, "collection"],
  ["combo_time", "Combo Time", "Obtain one special combo.", 100, "collection"],
  ["combo_collector", "Combo Collector", "Obtain four special combos.", 200, "collection"],
  ["wolf_tamer", "Wolf Tamer", "Defeat the Big Bad Wolf.", 100, "boss"],
  ["candy_breaker", "Candy Breaker", "Defeat the Candy Witch.", 125, "boss"],
  ["midnight_clear", "Midnight Clear", "Defeat the Midnight Stepmother Queen.", 150, "boss"],
  ["oni_festival", "Oni Festival", "Defeat the Oni Island King.", 175, "boss"],
  ["forest_clear", "Forest Clear", "Clear Topsy-Turvy Storybook Forest.", 100, "boss"],
  ["candy_clear", "Candy Clear", "Clear Candy Cottage Carnival.", 125, "boss"],
  ["palace_clear", "Palace Clear", "Clear Midnight Palace.", 150, "boss"],
  ["island_clear", "Island Clear", "Clear Peach Island & Dragon Palace.", 175, "boss"]
];

export const achievements: AchievementData[] = rows.map(([id, name, description, rewardCurrency, category]) => ({
  id,
  name: { ko: name, en: name },
  description: { ko: description, en: description },
  rewardCurrency,
  category
}));

export function getAchievement(id: string): AchievementData | undefined {
  return achievements.find((achievement) => achievement.id === id);
}
