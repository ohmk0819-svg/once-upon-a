import { WeaponData } from "../types/gameTypes";

export const weapons: WeaponData[] = [
  {
    id: "woodenPunch",
    name: { ko: "나무 주먹", en: "Wooden Punch" },
    role: { ko: "짧은 전방 펀치", en: "Short front punch" },
    kind: "melee",
    maxLevel: 5,
    visualType: "brightPunch",
    iconKey: "WP",
    levels: [
      { level: 1, description: { ko: "전방 펀치", en: "Front punch" }, damage: 18, cooldownMs: 900, range: 150, size: 44 },
      { level: 2, description: { ko: "피해량 증가", en: "More damage" }, damage: 25, cooldownMs: 880, range: 150, size: 44 },
      { level: 3, description: { ko: "범위 증가 + 피해량 증가", en: "Larger punch and more damage" }, damage: 32, cooldownMs: 860, range: 165, size: 56 },
      { level: 4, description: { ko: "밀어냄 효과 증가", en: "Stronger knockback" }, damage: 38, cooldownMs: 830, range: 170, size: 60 },
      { level: 5, description: { ko: "2연타 발생", en: "Double punch" }, damage: 42, cooldownMs: 780, range: 175, size: 64, count: 2 }
    ]
  },
  {
    id: "matchGirlsMatch",
    name: { ko: "성냥팔이 소녀의 성냥", en: "Match Girl's Match" },
    role: { ko: "화염 장판", en: "Warm flame zone" },
    kind: "area",
    maxLevel: 5,
    visualType: "warmFlame",
    iconKey: "Match",
    levels: [
      { level: 1, description: { ko: "작은 화염 장판 생성", en: "Creates a small flame zone" }, damage: 9, cooldownMs: 2600, range: 380, size: 66, durationMs: 2200, count: 1 },
      { level: 2, description: { ko: "피해량 증가", en: "More damage" }, damage: 13, cooldownMs: 2500, range: 400, size: 68, durationMs: 2200, count: 1 },
      { level: 3, description: { ko: "장판 크기 증가 + 피해량 증가", en: "Larger and warmer" }, damage: 16, cooldownMs: 2450, range: 420, size: 86, durationMs: 2300, count: 1 },
      { level: 4, description: { ko: "장판 개수 +1", en: "Creates one more zone" }, damage: 17, cooldownMs: 2400, range: 440, size: 86, durationMs: 2300, count: 2 },
      { level: 5, description: { ko: "지속시간 증가 + 피해량 증가", en: "Longer and stronger" }, damage: 22, cooldownMs: 2300, range: 460, size: 90, durationMs: 3000, count: 2 }
    ]
  },
  {
    id: "hanselsBreadcrumb",
    name: { ko: "헨젤의 빵조각", en: "Hansel's Breadcrumb" },
    role: { ko: "유도 투사체", en: "Homing projectile" },
    kind: "projectile",
    maxLevel: 5,
    visualType: "breadcrumb",
    iconKey: "Bread",
    levels: [
      { level: 1, description: { ko: "빵조각 1개 발사", en: "Throws one breadcrumb" }, damage: 14, cooldownMs: 1200, range: 560, size: 18, speed: 330, count: 1 },
      { level: 2, description: { ko: "피해량 증가", en: "More damage" }, damage: 20, cooldownMs: 1160, range: 580, size: 18, speed: 340, count: 1 },
      { level: 3, description: { ko: "발사 속도 증가", en: "Faster shots" }, damage: 22, cooldownMs: 900, range: 600, size: 18, speed: 380, count: 1 },
      { level: 4, description: { ko: "투사체 수 +1", en: "One more breadcrumb" }, damage: 23, cooldownMs: 900, range: 620, size: 18, speed: 390, count: 2 },
      { level: 5, description: { ko: "약한 유도 성능 증가", en: "Better gentle homing" }, damage: 26, cooldownMs: 860, range: 660, size: 20, speed: 420, count: 2 }
    ]
  },
  {
    id: "sleepingBriarRose",
    name: { ko: "잠자는 숲속의 장미", en: "Sleeping Briar Rose" },
    role: { ko: "가시 장판", en: "Rose vine zone" },
    kind: "area",
    maxLevel: 5,
    visualType: "roseVine",
    iconKey: "Rose",
    levels: [
      { level: 1, description: { ko: "작은 장미 장판 생성", en: "Creates a rose patch" }, damage: 8, cooldownMs: 3200, range: 320, size: 70, durationMs: 2400, count: 1 },
      { level: 2, description: { ko: "피해량 증가", en: "More damage" }, damage: 12, cooldownMs: 3150, range: 340, size: 70, durationMs: 2400, count: 1 },
      { level: 3, description: { ko: "장판 크기 증가", en: "Larger rose patch" }, damage: 13, cooldownMs: 3100, range: 360, size: 92, durationMs: 2500, count: 1 },
      { level: 4, description: { ko: "장판 지속시간 증가", en: "Longer vines" }, damage: 15, cooldownMs: 3000, range: 380, size: 94, durationMs: 3300, count: 1 },
      { level: 5, description: { ko: "장판 개수 +1", en: "Creates one more patch" }, damage: 17, cooldownMs: 2900, range: 400, size: 96, durationMs: 3300, count: 2 }
    ]
  },
  {
    id: "redRidingHoodsBasket",
    name: { ko: "빨간망토의 바구니", en: "Red Riding Hood's Basket" },
    role: { ko: "랜덤 투척 무기", en: "Playful random throw" },
    kind: "randomThrow",
    maxLevel: 5,
    visualType: "picnicBasket",
    iconKey: "Basket",
    levels: [
      { level: 1, description: { ko: "랜덤 물건 1개 투척", en: "Throws one picnic item" }, damage: 16, cooldownMs: 1700, range: 520, size: 19, speed: 300, count: 1 },
      { level: 2, description: { ko: "피해량 증가", en: "More damage" }, damage: 23, cooldownMs: 1660, range: 540, size: 19, speed: 310, count: 1 },
      { level: 3, description: { ko: "투척 속도 증가", en: "Throws faster" }, damage: 24, cooldownMs: 1280, range: 560, size: 20, speed: 330, count: 1 },
      { level: 4, description: { ko: "투척 물건 수 +1", en: "Throws one more item" }, damage: 25, cooldownMs: 1260, range: 580, size: 20, speed: 340, count: 2 },
      { level: 5, description: { ko: "특수 물건 등장 확률 증가", en: "Better picnic surprises" }, damage: 30, cooldownMs: 1180, range: 620, size: 22, speed: 360, count: 2 }
    ]
  },
  {
    id: "pussInBootsBoots",
    name: { ko: "장화 신은 고양이의 장화", en: "Puss in Boots' Boots" },
    role: { ko: "이동 연계 공격", en: "Movement shockwaves" },
    kind: "movementShockwave",
    maxLevel: 5,
    visualType: "starFootprints",
    iconKey: "Boots",
    levels: [
      { level: 1, description: { ko: "이동 거리 누적 시 작은 충격파", en: "Leaves small step shockwaves" }, damage: 18, cooldownMs: 0, range: 0, size: 58 },
      { level: 2, description: { ko: "충격파 피해량 증가", en: "More shockwave damage" }, damage: 26, cooldownMs: 0, range: 0, size: 58 },
      { level: 3, description: { ko: "충격파 범위 증가", en: "Larger shockwaves" }, damage: 28, cooldownMs: 0, range: 0, size: 76 },
      { level: 4, description: { ko: "Fairy Dash 후 추가 충격파", en: "Extra shockwaves after Fairy Dash" }, damage: 31, cooldownMs: 0, range: 0, size: 80, count: 2 },
      { level: 5, description: { ko: "충격파 발생 주기 감소", en: "Shockwaves appear more often" }, damage: 34, cooldownMs: 0, range: 0, size: 84, count: 2 }
    ]
  }
];

export function getWeapon(id: string): WeaponData {
  return weapons.find((weapon) => weapon.id === id) ?? weapons[0];
}
