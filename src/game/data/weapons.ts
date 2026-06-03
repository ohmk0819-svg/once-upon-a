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
    isCharacterBase: true,
    levels: [
      { level: 1, description: { ko: "전방 펀치", en: "Front punch" }, damage: 18, cooldownMs: 900, range: 150, size: 44 },
      { level: 2, description: { ko: "피해량 증가", en: "More damage" }, damage: 25, cooldownMs: 880, range: 150, size: 44 },
      { level: 3, description: { ko: "범위 증가 + 피해량 증가", en: "Larger punch and more damage" }, damage: 32, cooldownMs: 860, range: 165, size: 56 },
      { level: 4, description: { ko: "밀어냄 효과 증가", en: "Stronger knockback" }, damage: 38, cooldownMs: 830, range: 170, size: 60 },
      { level: 5, description: { ko: "2연타 발생", en: "Double punch" }, damage: 42, cooldownMs: 780, range: 175, size: 64, count: 2 }
    ]
  },
  {
    id: "oldAxe",
    name: { ko: "낡은 도끼", en: "Old Axe" },
    role: { ko: "근접/투척 회수 무기", en: "Melee and thrown axe catcher" },
    kind: "projectile",
    maxLevel: 5,
    visualType: "catchingAxe",
    iconKey: "Axe",
    isCharacterBase: true,
    levels: [
      { level: 1, description: { ko: "낡은 도끼 1개 사용", en: "Use one old axe" }, damage: 22, cooldownMs: 980, range: 520, size: 48, speed: 360 },
      { level: 2, description: { ko: "피해량 증가", en: "More axe damage" }, damage: 30, cooldownMs: 940, range: 540, size: 48, speed: 370 },
      { level: 3, description: { ko: "공격 범위 증가 + 피해량 증가", en: "Larger swings and more damage" }, damage: 36, cooldownMs: 910, range: 570, size: 58, speed: 385 },
      { level: 4, description: { ko: "도끼 투척 속도 증가", en: "Faster thrown axes" }, damage: 40, cooldownMs: 850, range: 600, size: 58, speed: 440 },
      { level: 5, description: { ko: "치명타 피해 증가, 회수 판정 증가", en: "More crit damage and easier catches" }, damage: 46, cooldownMs: 800, range: 630, size: 68, speed: 460 }
    ]
  },
  {
    id: "glassShards",
    name: { ko: "유리파편", en: "Glass Shards" },
    role: { ko: "원거리 유리 투사체", en: "Ranged glass projectiles" },
    kind: "projectile",
    maxLevel: 5,
    visualType: "sparklingGlass",
    iconKey: "Glass",
    isCharacterBase: true,
    levels: [
      { level: 1, description: { ko: "유리파편 1개 발사", en: "Fires one glass shard" }, damage: 16, cooldownMs: 820, range: 620, size: 18, speed: 440, count: 1 },
      { level: 2, description: { ko: "피해량 증가", en: "More shard damage" }, damage: 23, cooldownMs: 800, range: 640, size: 18, speed: 455, count: 1 },
      { level: 3, description: { ko: "투사체 속도 증가", en: "Faster glass shards" }, damage: 25, cooldownMs: 760, range: 660, size: 18, speed: 520, count: 1 },
      { level: 4, description: { ko: "작은 파편 폭발 추가", en: "Adds a small shard burst" }, damage: 29, cooldownMs: 730, range: 690, size: 20, speed: 540, count: 1 },
      { level: 5, description: { ko: "투사체 수 +1", en: "One more glass shard" }, damage: 30, cooldownMs: 700, range: 720, size: 20, speed: 560, count: 2 }
    ]
  },
  {
    id: "peachBlade",
    name: { ko: "복숭아 검", en: "Peach Blade" },
    role: { ko: "전방 복숭아색 베기", en: "Forward peach slash" },
    kind: "melee",
    maxLevel: 5,
    visualType: "peachSlash",
    iconKey: "Peach",
    isCharacterBase: true,
    levels: [
      { level: 1, description: { ko: "전방 베기", en: "Forward slash" }, damage: 19, cooldownMs: 920, range: 150, size: 54 },
      { level: 2, description: { ko: "피해량 증가", en: "More slash damage" }, damage: 27, cooldownMs: 900, range: 155, size: 54 },
      { level: 3, description: { ko: "범위 증가", en: "Larger slash" }, damage: 30, cooldownMs: 880, range: 170, size: 72 },
      { level: 4, description: { ko: "공격속도 증가", en: "Faster slashes" }, damage: 32, cooldownMs: 740, range: 175, size: 74 },
      { level: 5, description: { ko: "짧은 검기 투사체 추가", en: "Adds a short blade wave" }, damage: 38, cooldownMs: 700, range: 210, size: 78, speed: 360 }
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
  },
  {
    id: "jacksBeanstalk",
    name: { ko: "잭의 콩나무", en: "Jack's Beanstalk" },
    role: { ko: "설치형 덩굴 공격", en: "Planted vine strike" },
    kind: "area",
    maxLevel: 5,
    visualType: "beanstalk",
    iconKey: "Bean",
    levels: [
      { level: 1, description: { ko: "작은 덩굴 1개 생성", en: "Grow one small vine" }, damage: 20, cooldownMs: 2500, range: 420, size: 54, durationMs: 420, count: 1 },
      { level: 2, description: { ko: "피해량 증가", en: "More vine damage" }, damage: 28, cooldownMs: 2450, range: 440, size: 56, durationMs: 430, count: 1 },
      { level: 3, description: { ko: "덩굴 범위 증가", en: "Larger vine" }, damage: 31, cooldownMs: 2400, range: 460, size: 76, durationMs: 460, count: 1 },
      { level: 4, description: { ko: "덩굴 개수 +1", en: "One more vine" }, damage: 32, cooldownMs: 2350, range: 480, size: 78, durationMs: 480, count: 2 },
      { level: 5, description: { ko: "적을 짧게 둔화", en: "Briefly slows enemies" }, damage: 38, cooldownMs: 2250, range: 500, size: 84, durationMs: 520, count: 2 }
    ]
  },
  {
    id: "rapunzelsHair",
    name: { ko: "라푼젤의 머리카락", en: "Rapunzel's Hair" },
    role: { ko: "긴 채찍 공격", en: "Long hair whip" },
    kind: "melee",
    maxLevel: 5,
    visualType: "goldHairWhip",
    iconKey: "Hair",
    levels: [
      { level: 1, description: { ko: "한 방향 머리카락 채찍", en: "One direction hair whip" }, damage: 24, cooldownMs: 1350, range: 260, size: 36 },
      { level: 2, description: { ko: "피해량 증가", en: "More whip damage" }, damage: 34, cooldownMs: 1320, range: 270, size: 38 },
      { level: 3, description: { ko: "길이 증가", en: "Longer hair" }, damage: 38, cooldownMs: 1300, range: 330, size: 40 },
      { level: 4, description: { ko: "타격 폭 증가", en: "Wider lash" }, damage: 42, cooldownMs: 1260, range: 350, size: 56 },
      { level: 5, description: { ko: "짧은 둔화 추가", en: "Adds a short slow" }, damage: 48, cooldownMs: 1200, range: 370, size: 60 }
    ]
  },
  {
    id: "mermaidsBubble",
    name: { ko: "인어공주의 물방울", en: "Mermaid's Bubble" },
    role: { ko: "느린 관통 탄막", en: "Slow piercing bubbles" },
    kind: "projectile",
    maxLevel: 5,
    visualType: "bubble",
    iconKey: "Bubble",
    levels: [
      { level: 1, description: { ko: "물방울 1개 생성", en: "Create one bubble" }, damage: 14, cooldownMs: 1600, range: 520, size: 22, speed: 170, count: 1 },
      { level: 2, description: { ko: "피해량 증가", en: "More bubble damage" }, damage: 21, cooldownMs: 1580, range: 540, size: 22, speed: 175, count: 1 },
      { level: 3, description: { ko: "물방울 크기 증가", en: "Bigger bubbles" }, damage: 23, cooldownMs: 1540, range: 560, size: 32, speed: 180, count: 1 },
      { level: 4, description: { ko: "물방울 개수 +1", en: "One more bubble" }, damage: 24, cooldownMs: 1500, range: 580, size: 32, speed: 185, count: 2 },
      { level: 5, description: { ko: "둔화 효과 증가", en: "Stronger slow" }, damage: 30, cooldownMs: 1450, range: 600, size: 36, speed: 190, count: 2 }
    ]
  },
  {
    id: "beastsRose",
    name: { ko: "야수의 장미", en: "Beast's Rose" },
    role: { ko: "회전 장미 오브", en: "Orbiting rose orb" },
    kind: "area",
    maxLevel: 5,
    visualType: "orbitRose",
    iconKey: "BRose",
    levels: [
      { level: 1, description: { ko: "장미 오브 1개", en: "One rose orb" }, damage: 16, cooldownMs: 900, range: 0, size: 36, durationMs: 360, count: 1 },
      { level: 2, description: { ko: "피해량 증가", en: "More rose damage" }, damage: 23, cooldownMs: 870, range: 0, size: 36, durationMs: 360, count: 1 },
      { level: 3, description: { ko: "회전 속도 증가", en: "Faster orbit" }, damage: 25, cooldownMs: 720, range: 0, size: 38, durationMs: 360, count: 1 },
      { level: 4, description: { ko: "오브 개수 +1", en: "One more orb" }, damage: 26, cooldownMs: 700, range: 0, size: 38, durationMs: 360, count: 2 },
      { level: 5, description: { ko: "오브 크기 증가", en: "Larger rose orbs" }, damage: 31, cooldownMs: 660, range: 0, size: 52, durationMs: 380, count: 2 }
    ]
  },
  {
    id: "bremenChorus",
    name: { ko: "브레멘의 합창", en: "Bremen Chorus" },
    role: { ko: "주기적 음파 공격", en: "Rhythmic sound wave" },
    kind: "area",
    maxLevel: 5,
    visualType: "soundWave",
    iconKey: "Song",
    levels: [
      { level: 1, description: { ko: "작은 원형 음파", en: "Small sound wave" }, damage: 18, cooldownMs: 2300, range: 0, size: 92, durationMs: 240, count: 1 },
      { level: 2, description: { ko: "피해량 증가", en: "More sound damage" }, damage: 26, cooldownMs: 2250, range: 0, size: 94, durationMs: 250, count: 1 },
      { level: 3, description: { ko: "범위 증가", en: "Larger chorus" }, damage: 29, cooldownMs: 2200, range: 0, size: 126, durationMs: 260, count: 1 },
      { level: 4, description: { ko: "음파 횟수 +1", en: "One more wave" }, damage: 30, cooldownMs: 2150, range: 0, size: 126, durationMs: 260, count: 2 },
      { level: 5, description: { ko: "넉백 증가", en: "Stronger knockback" }, damage: 36, cooldownMs: 2050, range: 0, size: 138, durationMs: 280, count: 2 }
    ]
  },
  {
    id: "magicMirrorShard",
    name: { ko: "마법 거울 조각", en: "Magic Mirror Shard" },
    role: { ko: "반짝이는 반사 투사체", en: "Sparkling mirror projectile" },
    kind: "projectile",
    maxLevel: 5,
    visualType: "mirrorShard",
    iconKey: "Mirror",
    levels: [
      { level: 1, description: { ko: "거울 조각 1개", en: "One mirror shard" }, damage: 17, cooldownMs: 1300, range: 620, size: 18, speed: 390, count: 1 },
      { level: 2, description: { ko: "피해량 증가", en: "More mirror damage" }, damage: 25, cooldownMs: 1280, range: 640, size: 18, speed: 400, count: 1 },
      { level: 3, description: { ko: "반사 횟수 증가", en: "Better bounce" }, damage: 27, cooldownMs: 1240, range: 660, size: 20, speed: 420, count: 1 },
      { level: 4, description: { ko: "조각 수 +1", en: "One more shard" }, damage: 28, cooldownMs: 1220, range: 680, size: 20, speed: 430, count: 2 },
      { level: 5, description: { ko: "투사체 속도 증가", en: "Faster shards" }, damage: 33, cooldownMs: 1160, range: 700, size: 22, speed: 500, count: 2 }
    ]
  },
  {
    id: "ruyiJinguBang",
    name: { ko: "여의봉", en: "Ruyi Jingu Bang" },
    role: { ko: "직선 관통 타격", en: "Straight staff strike" },
    kind: "melee",
    maxLevel: 5,
    visualType: "goldStaff",
    iconKey: "Staff",
    levels: [
      { level: 1, description: { ko: "직선 봉 공격", en: "Straight staff attack" }, damage: 26, cooldownMs: 1600, range: 300, size: 34 },
      { level: 2, description: { ko: "피해량 증가", en: "More staff damage" }, damage: 38, cooldownMs: 1560, range: 310, size: 34 },
      { level: 3, description: { ko: "길이 증가", en: "Longer staff" }, damage: 42, cooldownMs: 1530, range: 390, size: 36 },
      { level: 4, description: { ko: "두께 증가", en: "Thicker staff" }, damage: 46, cooldownMs: 1480, range: 400, size: 52 },
      { level: 5, description: { ko: "2방향 공격", en: "Two direction strike" }, damage: 52, cooldownMs: 1420, range: 420, size: 54, count: 2 }
    ]
  },
  {
    id: "heungbusGourdSeed",
    name: { ko: "흥부의 박씨", en: "Heungbu's Gourd Seed" },
    role: { ko: "성장형 설치 폭탄", en: "Growing gourd bomb" },
    kind: "area",
    maxLevel: 5,
    visualType: "gourdSeed",
    iconKey: "Gourd",
    levels: [
      { level: 1, description: { ko: "박씨 1개 설치 후 폭발", en: "Plant one gourd seed" }, damage: 22, cooldownMs: 3000, range: 420, size: 70, durationMs: 360, count: 1 },
      { level: 2, description: { ko: "피해량 증가", en: "More gourd damage" }, damage: 32, cooldownMs: 2960, range: 440, size: 72, durationMs: 370, count: 1 },
      { level: 3, description: { ko: "폭발 범위 증가", en: "Larger burst" }, damage: 36, cooldownMs: 2920, range: 460, size: 94, durationMs: 380, count: 1 },
      { level: 4, description: { ko: "박씨 개수 +1", en: "One more seed" }, damage: 37, cooldownMs: 2860, range: 480, size: 94, durationMs: 390, count: 2 },
      { level: 5, description: { ko: "보상 드랍 확률 증가", en: "Better reward chance" }, damage: 44, cooldownMs: 2780, range: 500, size: 104, durationMs: 400, count: 2 }
    ]
  },
  {
    id: "goblinClub",
    name: { ko: "도깨비 방망이", en: "Goblin Club" },
    role: { ko: "랜덤 강타", en: "Random club slam" },
    kind: "area",
    maxLevel: 5,
    visualType: "clubSlam",
    iconKey: "Club",
    levels: [
      { level: 1, description: { ko: "방망이 강타 1회", en: "One club slam" }, damage: 28, cooldownMs: 2600, range: 520, size: 72, durationMs: 260, count: 1 },
      { level: 2, description: { ko: "피해량 증가", en: "More club damage" }, damage: 40, cooldownMs: 2560, range: 540, size: 74, durationMs: 260, count: 1 },
      { level: 3, description: { ko: "범위 증가", en: "Larger slam" }, damage: 44, cooldownMs: 2520, range: 560, size: 98, durationMs: 280, count: 1 },
      { level: 4, description: { ko: "강타 횟수 +1", en: "One more slam" }, damage: 46, cooldownMs: 2460, range: 580, size: 100, durationMs: 280, count: 2 },
      { level: 5, description: { ko: "낮은 확률로 보상 드랍", en: "Small reward chance" }, damage: 54, cooldownMs: 2380, range: 600, size: 108, durationMs: 300, count: 2 }
    ]
  },
  {
    id: "fairyRobe",
    name: { ko: "선녀의 날개옷", en: "Fairy Robe" },
    role: { ko: "이동/도약 연계 공격", en: "Dash and movement feathers" },
    kind: "movementShockwave",
    maxLevel: 5,
    visualType: "fairyRobe",
    iconKey: "Robe",
    levels: [
      { level: 1, description: { ko: "Dash 후 깃털 피해", en: "Feather damage after Dash" }, damage: 18, cooldownMs: 0, range: 0, size: 72, count: 1 },
      { level: 2, description: { ko: "피해량 증가", en: "More feather damage" }, damage: 26, cooldownMs: 0, range: 0, size: 74, count: 1 },
      { level: 3, description: { ko: "깃털 수 증가", en: "More feathers" }, damage: 28, cooldownMs: 0, range: 0, size: 82, count: 2 },
      { level: 4, description: { ko: "이동 거리 기반 추가 발동", en: "Triggers while moving" }, damage: 30, cooldownMs: 0, range: 0, size: 88, count: 2 },
      { level: 5, description: { ko: "Dash 후 짧은 보호막", en: "Brief shield after Dash" }, damage: 35, cooldownMs: 0, range: 0, size: 96, count: 3 }
    ]
  },
  {
    id: "simcheongsLotus",
    name: { ko: "심청의 연꽃", en: "Simcheong's Lotus" },
    role: { ko: "회복/보호 정화", en: "Healing lotus cleanse" },
    kind: "area",
    maxLevel: 5,
    visualType: "lotus",
    iconKey: "Lotus",
    levels: [
      { level: 1, description: { ko: "작은 연꽃 정화 발생", en: "Small lotus cleanse" }, damage: 14, cooldownMs: 5200, range: 0, size: 92, durationMs: 500 },
      { level: 2, description: { ko: "회복량 증가", en: "More healing" }, damage: 16, cooldownMs: 5000, range: 0, size: 94, durationMs: 520 },
      { level: 3, description: { ko: "피해량 증가", en: "More cleanse damage" }, damage: 24, cooldownMs: 4800, range: 0, size: 96, durationMs: 540 },
      { level: 4, description: { ko: "범위 증가", en: "Larger lotus" }, damage: 26, cooldownMs: 4600, range: 0, size: 128, durationMs: 560 },
      { level: 5, description: { ko: "체력이 낮을 때 효과 증가", en: "Stronger at low HP" }, damage: 32, cooldownMs: 4300, range: 0, size: 138, durationMs: 600 }
    ]
  },
  ...[
    ["eternalMatchFlameWeapon", "Eternal Match Flame", "EFlame", "eternalFlame", "matchGirlsMatch"],
    ["skyHighBeanstalkWeapon", "Sky-High Beanstalk", "SkyBean", "skyBeanstalk", "jacksBeanstalk"],
    ["goldenTowerBraidWeapon", "Golden Tower Braid", "Braid", "goldenBraid", "rapunzelsHair"],
    ["duelistsRedBootsWeapon", "Duelist's Red Boots", "DBoots", "duelistBoots", "pussInBootsBoots"],
    ["deepSeaWhirlpoolWeapon", "Deep Sea Whirlpool", "Whirl", "whirlpool", "mermaidsBubble"],
    ["hundredYearBriarCurseWeapon", "Hundred-Year Briar Curse", "Briar+", "briarCurse", "sleepingBriarRose"],
    ["goldComeForthWeapon", "Gold, Come Forth!", "Gold!", "goldClub", "goblinClub"],
    ["enchantedRoseCastleWeapon", "Enchanted Rose Castle", "Castle", "roseCastle", "beastsRose"],
    ["fourAnimalGrandChorusWeapon", "Four-Animal Grand Chorus", "4Song", "grandChorus", "bremenChorus"],
    ["queensMagicMirrorWeapon", "Queen's Magic Mirror", "QMirror", "queenMirror", "magicMirrorShard"],
    ["heavenSplittingStaffWeapon", "Heaven-Splitting Staff", "HStaff", "heavenStaff", "ruyiJinguBang"],
    ["lotusOfIndangsuWeapon", "Lotus of Indangsu", "ILotus", "indangsuLotus", "simcheongsLotus"],
    ["threeHonestAxesWeapon", "Three Honest Axes", "3Axes", "threeAxes", "oldAxe"],
    ["realBoysSteelFistsWeapon", "Real Boy's Steel Fists", "Steel", "steelFists", "woodenPunch"],
    ["midnightGlassSlippersWeapon", "Midnight Glass Slippers", "Slipper", "glassSlippers", "glassShards"],
    ["oniCuttingPeachBladeWeapon", "Oni-Cutting Peach Blade", "OniCut", "oniPeachBlade", "peachBlade"],
    ["wolfHuntersBasketWeapon", "Wolf Hunter's Basket", "Hunter", "hunterBasket", "redRidingHoodsBasket"],
    ["witchsCandyHouseWeapon", "Witch's Candy House", "CandyH", "candyHouse", "hanselsBreadcrumb"],
    ["burningBriarGardenWeapon", "Burning Briar Garden", "FireRose", "burningBriar", "matchGirlsMatch"],
    ["mirrorLakeWeapon", "Mirror Lake", "Lake", "mirrorLake", "mermaidsBubble"]
  ].map(([id, name, iconKey, visualType, baseWeaponId]) => ({
    id,
    name: { ko: name, en: name },
    role: { ko: "진화/조합 무기", en: "Evolution or combo weapon" },
    kind: "area" as const,
    maxLevel: 1,
    visualType,
    iconKey,
    evolved: !id.includes("BasketWeapon") && !id.includes("CandyHouseWeapon") && !id.includes("GardenWeapon") && !id.includes("LakeWeapon"),
    combo: id.includes("BasketWeapon") || id.includes("CandyHouseWeapon") || id.includes("GardenWeapon") || id.includes("LakeWeapon"),
    baseWeaponId,
    tags: ["evolved"],
    levels: [
      {
        level: 1,
        description: { ko: "진화 효과 발동", en: "Evolution effect" },
        damage: 58,
        cooldownMs: 1500,
        range: 620,
        size: 120,
        durationMs: 900,
        count: 2,
        speed: 520
      }
    ]
  }))
];

export function getWeapon(id: string): WeaponData {
  return weapons.find((weapon) => weapon.id === id) ?? weapons[0];
}
