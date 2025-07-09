
# 001-time.md

## High-Level Specifications

- Introduce a game time concept based on "ticks."
- Each building performs its operation once per tick.
- Allow configuration of "ticks per second."
- Player movement and canvas rendering should be independent of the tick system.

## Relevant Files

- `src/Game.ts`: Likely the central place to manage game loops and time.
- `src/Building.ts`: Buildings will need a method to perform operations per tick.
- `src/main.ts`: Where the main game loop is initialized and potentially where ticks per second will be configured.
- `src/Player.ts`: To ensure player movement remains independent.
- `src/Keyboard.ts`, `src/Mouse.ts`: Input handling should not be tied to ticks.

## Acceptance Criteria

- Game progresses in discrete ticks.
- Buildings execute their logic only when a tick occurs.
- A configurable `TICKS_PER_SECOND` constant exists and functions correctly.
- Player movement and camera panning are smooth and independent of tick rate.

## Implementation Steps

- [x] **Step 1: Define `TICKS_PER_SECOND` and `tickInterval`**
  - Add a `TICKS_PER_SECOND` constant in `src/main.ts` (or a new `Config.ts` if appropriate).
  - Calculate `tickInterval` (milliseconds per tick).

- [x] **Step 2: Implement the game tick loop**
  - Modify `src/Game.ts` to manage a tick-based update loop using `setInterval` or similar.
  - Ensure the existing `requestAnimationFrame` loop for rendering remains separate.

- [x] **Step 3: Integrate buildings with the tick system**
  - Add an `update(deltaTime: number)` method to `Building.ts` that is called only on a tick.
  - Modify `Game.ts` to call `building.update()` for all active buildings during each tick.

- [x] **Step 4: Verify player movement independence**
  - Confirm that `Player.ts` and input handling (Keyboard, Mouse) are not affected by the tick rate.

- [x] **Step 5: Test and Refine**
  - Run the game and verify that buildings operate at the configured tick rate.
  - Ensure player movement and camera remain smooth.
  - Adjust `TICKS_PER_SECOND` to confirm it changes game speed correctly.
