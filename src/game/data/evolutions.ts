import { EvolutionData } from "../types/gameTypes";

export const evolutions: EvolutionData[] = [
  {
    id: "eternalMatchFlame",
    name: { ko: "꺼지지 않는 성냥불", en: "Eternal Match Flame" },
    description: { ko: "커지고 오래 남는 불꽃이 작은 불씨를 퍼뜨립니다.", en: "Larger, longer flames spread little sparks." },
    type: "weapon_passive",
    requiredWeaponIds: ["matchGirlsMatch"],
    requiredPassiveIds: ["witchsBlackHat"],
    resultWeaponId: "eternalMatchFlameWeapon",
    iconKey: "EFlame",
    visualType: "eternalFlame"
  },
  {
    id: "skyHighBeanstalk",
    name: { ko: "하늘까지 닿는 콩나무", en: "Sky-High Beanstalk" },
    description: { ko: "거대한 콩나무가 솟아 넓은 범위의 적을 밀어냅니다.", en: "A giant beanstalk erupts and pushes enemies away." },
    type: "weapon_passive",
    requiredWeaponIds: ["jacksBeanstalk"],
    requiredPassiveIds: ["rabbitsLiver"],
    resultWeaponId: "skyHighBeanstalkWeapon",
    iconKey: "SkyBean",
    visualType: "skyBeanstalk"
  },
  {
    id: "goldenTowerBraid",
    name: { ko: "탑을 감는 황금머리", en: "Golden Tower Braid" },
    description: { ko: "황금 머리카락이 여러 방향으로 뻗어 다단히트합니다.", en: "Golden braids lash in several directions." },
    type: "weapon_passive",
    requiredWeaponIds: ["rapunzelsHair"],
    requiredPassiveIds: ["wizardsBook"],
    resultWeaponId: "goldenTowerBraidWeapon",
    iconKey: "Braid",
    visualType: "goldenBraid"
  },
  {
    id: "duelistsRedBoots",
    name: { ko: "결투왕의 붉은 장화", en: "Duelist's Red Boots" },
    description: { ko: "이동과 대시가 붉은 검격 충격파를 남깁니다.", en: "Movement and dashes leave red slash shockwaves." },
    type: "weapon_passive",
    requiredWeaponIds: ["pussInBootsBoots"],
    requiredPassiveIds: ["redShoes"],
    resultWeaponId: "duelistsRedBootsWeapon",
    iconKey: "DBoots",
    visualType: "duelistBoots"
  },
  {
    id: "deepSeaWhirlpool",
    name: { ko: "심해의 소용돌이", en: "Deep Sea Whirlpool" },
    description: { ko: "밝은 소용돌이가 적을 늦추고 지속 피해를 줍니다.", en: "A bright whirlpool slows enemies and deals damage." },
    type: "weapon_passive",
    requiredWeaponIds: ["mermaidsBubble"],
    requiredPassiveIds: ["candyHouseKey"],
    resultWeaponId: "deepSeaWhirlpoolWeapon",
    iconKey: "Whirl",
    visualType: "whirlpool"
  },
  {
    id: "hundredYearBriarCurse",
    name: { ko: "백년가시의 저주", en: "Hundred-Year Briar Curse" },
    description: { ko: "넓은 장미 정원이 적을 둔화시키고 찌릅니다.", en: "A wide rose garden slows and damages enemies." },
    type: "weapon_passive",
    requiredWeaponIds: ["sleepingBriarRose"],
    requiredPassiveIds: ["tigersPersimmon"],
    resultWeaponId: "hundredYearBriarCurseWeapon",
    iconKey: "Briar+",
    visualType: "briarCurse"
  },
  {
    id: "goldComeForth",
    name: { ko: "금 나와라 뚝딱", en: "Gold, Come Forth!" },
    description: { ko: "커다란 방망이가 별빛 금색 충격파를 일으킵니다.", en: "A larger club creates starry golden shockwaves." },
    type: "weapon_passive",
    requiredWeaponIds: ["goblinClub"],
    requiredPassiveIds: ["aladdinsLamp"],
    resultWeaponId: "goldComeForthWeapon",
    iconKey: "Gold!",
    visualType: "goldClub"
  },
  {
    id: "enchantedRoseCastle",
    name: { ko: "저주받은 장미성", en: "Enchanted Rose Castle" },
    description: { ko: "장미 오브가 보호벽처럼 회전하며 꽃잎 반격을 합니다.", en: "Rose orbs guard the player with petal bursts." },
    type: "weapon_passive",
    requiredWeaponIds: ["beastsRose"],
    requiredPassiveIds: ["princesCloak"],
    resultWeaponId: "enchantedRoseCastleWeapon",
    iconKey: "Castle",
    visualType: "roseCastle"
  },
  {
    id: "fourAnimalGrandChorus",
    name: { ko: "네 동물의 대합창", en: "Four-Animal Grand Chorus" },
    description: { ko: "네 가지 음파가 차례로 퍼져 적을 밀어냅니다.", en: "Four sound waves pulse in sequence." },
    type: "weapon_passive",
    requiredWeaponIds: ["bremenChorus"],
    requiredPassiveIds: ["fairysBlessing"],
    resultWeaponId: "fourAnimalGrandChorusWeapon",
    iconKey: "4Song",
    visualType: "grandChorus"
  },
  {
    id: "queensMagicMirror",
    name: { ko: "여왕의 마법 거울", en: "Queen's Magic Mirror" },
    description: { ko: "더 많은 거울 조각이 약하게 유도되어 날아갑니다.", en: "More mirror shards fly with gentle homing." },
    type: "weapon_passive",
    requiredWeaponIds: ["magicMirrorShard"],
    requiredPassiveIds: ["aladdinsLamp"],
    resultWeaponId: "queensMagicMirrorWeapon",
    iconKey: "QMirror",
    visualType: "queenMirror"
  },
  {
    id: "heavenSplittingStaff",
    name: { ko: "하늘을 가르는 여의봉", en: "Heaven-Splitting Staff" },
    description: { ko: "십자 방향의 긴 여의봉 충격파가 화면을 가릅니다.", en: "Long cross-shaped staff strikes split the field." },
    type: "weapon_passive",
    requiredWeaponIds: ["ruyiJinguBang"],
    requiredPassiveIds: ["goblinCloak"],
    resultWeaponId: "heavenSplittingStaffWeapon",
    iconKey: "HStaff",
    visualType: "heavenStaff"
  },
  {
    id: "lotusOfIndangsu",
    name: { ko: "인당수의 연꽃", en: "Lotus of Indangsu" },
    description: { ko: "넓은 연꽃 정화 파동이 회복과 피해를 동시에 줍니다.", en: "A wide lotus wave heals and cleanses enemies." },
    type: "weapon_passive",
    requiredWeaponIds: ["simcheongsLotus"],
    requiredPassiveIds: ["princesCloak"],
    resultWeaponId: "lotusOfIndangsuWeapon",
    iconKey: "ILotus",
    visualType: "indangsuLotus"
  },
  {
    id: "threeHonestAxes",
    name: { ko: "탐욕을 베는 삼도끼", en: "Three Honest Axes" },
    description: { ko: "회수 성공 후 더 강한 세 도끼 공격으로 강화됩니다.", en: "Axe catches empower the next axe attacks." },
    type: "character_weapon",
    requiredCharacterId: "woodcutter",
    requiredBaseWeaponId: "oldAxe",
    requiredWeaponIds: ["oldAxe"],
    requiredPassiveIds: ["wolfsClaw"],
    resultWeaponId: "threeHonestAxesWeapon",
    iconKey: "3Axes",
    visualType: "threeAxes"
  },
  {
    id: "realBoysSteelFists",
    name: { ko: "진짜 소년의 강철 주먹", en: "Real Boy's Steel Fists" },
    description: { ko: "빠른 연속 주먹과 푸른 충격파가 발생합니다.", en: "Rapid punches create blue shockwaves." },
    type: "character_weapon",
    requiredCharacterId: "pinocchio",
    requiredBaseWeaponId: "woodenPunch",
    requiredWeaponIds: ["woodenPunch"],
    requiredPassiveIds: ["sleepingSpindle"],
    resultWeaponId: "realBoysSteelFistsWeapon",
    iconKey: "Steel",
    visualType: "steelFists"
  },
  {
    id: "midnightGlassSlippers",
    name: { ko: "자정의 유리구두", en: "Midnight Glass Slippers" },
    description: { ko: "유리구두 투사체가 빠르게 날고 파편을 남깁니다.", en: "Glass slipper shots fly quickly and burst." },
    type: "character_weapon",
    requiredCharacterId: "cinderella",
    requiredBaseWeaponId: "glassShards",
    requiredWeaponIds: ["glassShards"],
    requiredPassiveIds: ["redShoes"],
    resultWeaponId: "midnightGlassSlippersWeapon",
    iconKey: "Slipper",
    visualType: "glassSlippers"
  },
  {
    id: "oniCuttingPeachBlade",
    name: { ko: "귀신을 가르는 복숭아검", en: "Oni-Cutting Peach Blade" },
    description: { ko: "복숭아색 큰 검기가 넓게 퍼집니다.", en: "Large peach blade waves sweep forward." },
    type: "character_weapon",
    requiredCharacterId: "momotaro",
    requiredBaseWeaponId: "peachBlade",
    requiredWeaponIds: ["peachBlade"],
    requiredPassiveIds: ["milletDumplings"],
    resultWeaponId: "oniCuttingPeachBladeWeapon",
    iconKey: "OniCut",
    visualType: "oniPeachBlade"
  },
  {
    id: "wolfHuntersBasket",
    name: { ko: "늑대 사냥꾼의 바구니", en: "Wolf Hunter's Basket" },
    description: { ko: "바구니에서 사냥 도구와 덫이 튀어나옵니다.", en: "Hunter tools and traps fly from the basket." },
    type: "special_combo",
    requiredWeaponIds: ["redRidingHoodsBasket"],
    requiredPassiveIds: ["wolfsClaw"],
    resultWeaponId: "wolfHuntersBasketWeapon",
    iconKey: "Hunter",
    visualType: "hunterBasket"
  },
  {
    id: "witchsCandyHouse",
    name: { ko: "마녀의 과자집", en: "Witch's Candy House" },
    description: { ko: "과자집 조각이 적을 유인한 뒤 사탕 폭발을 냅니다.", en: "Candy house pieces lure enemies before bursting." },
    type: "special_combo",
    requiredWeaponIds: ["hanselsBreadcrumb"],
    requiredPassiveIds: ["candyHouseKey"],
    resultWeaponId: "witchsCandyHouseWeapon",
    iconKey: "CandyH",
    visualType: "candyHouse"
  },
  {
    id: "burningBriarGarden",
    name: { ko: "불타는 가시정원", en: "Burning Briar Garden" },
    description: { ko: "불꽃과 장미가 섞인 넓은 정원이 지속 피해를 줍니다.", en: "A burning rose garden deals lasting damage." },
    type: "special_combo",
    requiredWeaponIds: ["matchGirlsMatch", "sleepingBriarRose"],
    resultWeaponId: "burningBriarGardenWeapon",
    iconKey: "FireRose",
    visualType: "burningBriar"
  },
  {
    id: "mirrorLake",
    name: { ko: "거울 호수", en: "Mirror Lake" },
    description: { ko: "하늘색 호수 위에서 거울 조각이 계속 반짝입니다.", en: "Mirror shards sparkle over a bright blue lake." },
    type: "special_combo",
    requiredWeaponIds: ["mermaidsBubble", "magicMirrorShard"],
    resultWeaponId: "mirrorLakeWeapon",
    iconKey: "Lake",
    visualType: "mirrorLake"
  }
];

export function getEvolution(id: string): EvolutionData | undefined {
  return evolutions.find((evolution) => evolution.id === id);
}
