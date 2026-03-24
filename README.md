# cube.world prototype

Deterministic Cube World-inspired browser prototype with a hardware-style stage instead of a dashboard.

## Run

```bash
cd /Users/maxl/Desktop/cube.world
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173`.

## Controls

- Click a cube to select it.
- Drag a cube briefly to jostle it and trigger the motion reaction.
- `+` adds a new cube by character.
- `[]` adds furniture to the selected cube.
- `R` resets the saved world back to the default lineup.
- Small front button toggles `Sound`.
- Large front button follows the original flow: `On / Stick Game / Game Control`.
- Side button shows `High Score`.
- `Shift+R` also resets the saved world.

## Character Roster

- Series 1: `Slim`, `Scoop`, `Dodger`, `Whip`
- Series 2: `Mic`, `Hans`, `Handy`, `Dusty`

Each character now maps to an original-style mini-game:

- `Slim` -> `Pull Up`
- `Scoop` -> `Keep Away`
- `Dodger` -> `Bounce`
- `Whip` -> `Jump Rope`
- `Mic` -> `Spin Off`
- `Hans` -> `Kick-a-Stick`
- `Handy` -> `Go Go Gopher`
- `Dusty` -> `Buzz Off`

## Cast Behaviors

- `Slim` now prefers watchful visits and will go to `Scoop` to pet the dog.
- `Scoop` now runs a fetch routine with `Slim`, based on the original example where Scoop's dog fetches Slim's stick.
- `Dodger` challenges `Whip` or `Hans` with ball-showoff loops.
- `Whip` runs rope-show routines for `Dodger`, `Mic`, or `Slim`.
- `Mic` starts jam sessions, especially when sound is enabled.
- `Hans` coaches `Slim` or `Dodger` and does edge-watch routines.
- `Handy` visits cluttered or device-heavy cubes to "repair" them.
- `Dusty` visits busy cubes to tidy them and calm them down.

## Simulation

- Residents still use deterministic utility scoring.
- Adjacent cubes can visit one another.
- Furniture exposes `rest`, `play`, and `inspect` affordances.
- The world now autosaves to local storage, including cube layout, furniture, scores, power state, and resident positions/needs.
- Sound mode makes figures dance more often, matching the original toy behavior more closely.
- After 4 minutes without interaction a cube falls asleep; after 5 minutes it powers off, matching the original manual behavior more closely.
- LCD figures now render with stepped pose frames and snapped positions instead of smooth modern tweening.
- Cross-cube visits now pause at the edge, pulse the handoff opening, and animate the empty-cube blind instead of switching instantly.
