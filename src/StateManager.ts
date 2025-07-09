import { Building } from "./Building";
import type { Game } from "./Game";
import { Resource } from "./Resource";

export class StateManager {
    private static readonly SAVE_KEY = 'gameState';

    saveState(game: Game) {
        const state = {
            player: {
                x: game.player.x,
                y: game.player.y,
                inventory: game.player.inventory,
            },
            world: {
                resources: game.world.resources,
                buildings: game.world.buildings,
            },
            objective: game.objective,
        };

        localStorage.setItem(StateManager.SAVE_KEY, JSON.stringify(state));
        console.log("Game state saved.");
    }

    loadState(game: Game) {
        const savedState = localStorage.getItem(StateManager.SAVE_KEY);

        if (savedState) {
            const state = JSON.parse(savedState);

            game.player.x = state.player.x;
            game.player.y = state.player.y;
            game.player.inventory = state.player.inventory;

            game.world.resources = state.world.resources.map((r: any) => new Resource(r.x, r.y, r.width, r.height, r.type));
            game.world.buildings = state.world.buildings.map((b: any) => {
                const building = new Building(b.x, b.y, b.type, b.width, b.direction);
                building.inventory = b.inventory;
                return building;
            });

            game.objective = state.objective;

            console.log("Game state loaded.");
        }
    }
}
