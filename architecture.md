### Game Tick System Architecture

```mermaid
graph TD
    subgraph Main Loop
        A[setInterval(gameTick, tickInterval)] --> B{Game.ts: gameTick()};
    end

    subgraph Game Logic
        B --> C{World.ts: update()};
        C --> D{For each Building...};
        D --> E[Building.ts: tickUpdate()];
    end

    subgraph State Interaction
        E --> F((World));
        E --> G((Player));
    end

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bbf,stroke:#333,stroke-width:2px
    style E fill:#bbf,stroke:#333,stroke-width:2px
```

### Component Breakdown

1.  **The Trigger (`setInterval`)**
    *   **File:** `src/Game.ts` (within the `start` method)
    *   **Role:** This is the heart of the tick system. It acts as a metronome, firing at a fixed interval defined by `tickInterval`. It is completely separate from the rendering loop (`requestAnimationFrame`), which handles drawing to the screen. This separation ensures that the core game logic runs at a consistent speed, regardless of how fast or slow the user's computer can draw the graphics.

2.  **The Orchestrator (`Game.ts`)**
    *   **Method:** `gameTick()`
    *   **Role:** When `setInterval` fires, it calls `gameTick()`. This method is the main entry point for a single "turn" or "tick" of the game. Its primary responsibility is to delegate the update logic to the appropriate game object, which in this case is the `World`.

3.  **The Manager (`World.ts`)**
    *   **Method:** `update()`
    *   **Role:** The `World` object acts as a container and manager for all the active entities in the game, such as resources and buildings. Its `update()` method is called by `gameTick()`. It iterates through its list of all `buildings` and tells each one to perform its individual tick-based action.

4.  **The Actor (`Building.ts`)**
    *   **Method:** `tickUpdate()`
    *   **Role:** This is where the specific game logic for each building type is executed.
        *   A **Miner** will check the resource at its location and add it to its inventory.
        *   A **Belt** will move resources from its inventory to the next building in its path.
        *   An **Assembler** will check if it has the required input resources, and if so, it will advance its crafting progress.
    *   To perform these actions, the `tickUpdate` method interacts with the `World` (to find other buildings or resources) and the `Player` (to give them items, for example).

### Data Flow Summary

The process for a single game tick is as follows:

1.  The `setInterval` timer fires, calling `game.gameTick()`.
2.  `gameTick()` immediately calls `world.update()`.
3.  `world.update()` loops through every building in its `buildings` array.
4.  For each building, it calls that building's `tickUpdate()` method.
5.  The `tickUpdate()` method then executes its unique logic, reading from and writing to the state of the `World` and `Player` objects as needed.