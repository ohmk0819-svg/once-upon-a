# Once upon a...

A bright fairy-tale survivors game built with Vite, Phaser 3, and TypeScript.

## Install
npm install

## Development
npm run dev

## Build
npm run build

## Preview
npm run preview

## Controls
WASD / Arrow Keys: Move
Space / Shift: Fairy Dash
Q / R: Ultimate
Enter: Confirm
1 / 2 / 3: Pick a level-up card
Tab / C: Toggle aim mode

## Dev Mode
Run with `?dev=1`.

- DEV MODE appears in the HUD.
- EXP pickups grant 5x experience.
- Stage boss timing is compressed from 15:00 to 03:00.
- B: Spawn stage boss.
- E: Spawn stage elite.
- F5: Max current weapons and passives.
- F6: Grant a passive pack.
- F7: Prepare and open a character/shared evolution.
- F8: Prepare and open a combo evolution.
- U: Ready ultimate instantly.
- Shift + 1-4: Restart directly into stages 1-4.
- Dev runs do not write best-time or clear records.

## Phase 2-D Hotfix
- Fixed stage boss name display
- Fixed stage description display
- Added cursor aim line/reticle
- Added pause menu
- Added weapon/passive slot count display
- Improved Fairy Dash locked/unlocked messaging
- Added boss phase transition alerts
- Improved character select details
- Adjusted EXP curve
- Separated normal ultimate cooldown from Dev Mode testing

## Phase 3 Content
- Meta upgrade shop
- Story Shards economy
- 40 achievements
- Collection scene
- Evolution recipe book
- Character unlocks
- Stage unlocks
- Free Survival mode
- Boss Practice mode
- Settings scene
- English/Korean localization expansion
- First-play tutorial
- Save data migration

## Settings
- Language: English / Korean
- Volume Master / BGM / SFX
- Screen Shake
- Aim Mode Default
- Damage Numbers
- Reduced Effects
- Tutorial replay
- Reset Save Data

## Phase 2-D Content
- Stage Select Scene after Character Select.
- Four data-driven stages:
  - Topsy-Turvy Storybook Forest
  - Candy Cottage Carnival
  - Midnight Palace
  - Peach Island & Dragon Palace
- Four stage bosses:
  - Big Bad Wolf
  - Candy Witch
  - Midnight Stepmother Queen
  - Oni Island King
- Each boss has three patterns and a 50% faster second phase below half HP.
- Stage-specific enemy and elite pools drive wave spawning.
- Normal runs use a 15-minute boss timer; dev runs use a 3-minute boss timer.
- Stage stats are saved per stage for normal runs.

## Phase 2-B Content
- Aim mode toggle:
  - Auto Target
  - Cursor Direction
- Playable Characters:
  - Woodcutter
  - Pinocchio
  - Cinderella
  - Momotaro
- Shared Weapons:
  - 16 total
- Shared Passives:
  - 16 total
- Momotaro summon AI:
  - Dog melee attacker
  - Monkey ranged attacker
  - Pheasant EXP support and feather attacker
- Shared Stage:
  - Topsy-Turvy Storybook Forest
- Boss:
  - Big Bad Wolf

## Phase 2-C Content
- Evolution System
- 12 shared weapon evolutions
- 4 character base weapon evolutions
- 4 special combo evolutions
- Evolution chest rewards
- EVO display in HUD
- Evolution discovery saved in localStorage

## Phase 1 Checklist
- Title, character select, game, level-up overlay, and result scenes are implemented.
- Pinocchio starts with Wooden Punch and gains attack speed on level-up.
- Enemies spawn by timeline, chase the player, drop EXP gems, and trigger level-ups.
- Five common weapons and five common passives are data-driven and upgradeable.
- Fairy Dash unlocks at level 7 and shows its cooldown in the HUD.
- Real Boy Might can be used with Q or R. The first charge is ready after 30 seconds for Phase 1 testing, while the base cooldown remains 90 seconds.
- Big Wolf appears at 3 minutes and grants a treasure-style level reward.
- Big Bad Wolf appears at 5 minutes with dash, swipe, and howl patterns.
- Boss defeat opens the clear screen. HP reaching 0 opens the game-over screen.
- Basic run records are stored in localStorage under `once_upon_a_save`.
