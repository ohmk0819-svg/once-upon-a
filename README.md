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

## Phase 1 Content
- Character: Pinocchio
- Stage: Topsy-Turvy Storybook Forest
- Boss: Big Bad Wolf
- Tone: Bright, simple, readable, Holocure-inspired

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
