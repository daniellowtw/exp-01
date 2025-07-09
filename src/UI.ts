import type { BuildingType } from "./Building";
import type { Player } from "./Player";
import { Resource } from "./Resource";
import { ironPlateRecipe, Recipe } from "./Recipe";
import { ResourceAmount } from "./ResourceAmount";


import type { World } from "./World";

export class UI {
    private ticksPerSecond: number;

    constructor(ticksPerSecond: number) {
        this.ticksPerSecond = ticksPerSecond;
    }
    draw(ctx: CanvasRenderingContext2D, buildingType: BuildingType, player: Player, objective: { description: string, current: number, target: number }, hoveredTile: { x: number, y: number, type: string, inventory?: ResourceAmount[] } | null, world: World) {
        ctx.fillStyle = 'white';
        ctx.font = '24px sans-serif';

        // Draw resource count (from player inventory)
        let yOffset = 30;
        player.inventory.forEach(item => {
            ctx.fillText(`${item.type}: ${item.amount}`, 10, yOffset);
            yOffset += 30;
        });

        // Draw tooltip
        if (hoveredTile) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            let tooltipText = hoveredTile.type.toUpperCase();
            let tooltipHeight = 30;

            if (hoveredTile.inventory) {
                tooltipText += '\nInventory:';
                hoveredTile.inventory.forEach(item => {
                    tooltipText += `\n- ${item.type}: ${item.amount}`;
                    tooltipHeight += 20;
                });
            }

            const lines = tooltipText.split('\n');
            const longestLine = lines.reduce((a, b) => a.length > b.length ? a : b);
            const tooltipWidth = ctx.measureText(longestLine).width + 20;

            ctx.fillRect(hoveredTile.x + 10, hoveredTile.y + 10, tooltipWidth, tooltipHeight);
            ctx.fillStyle = 'white';
            lines.forEach((line, index) => {
                ctx.fillText(line, hoveredTile.x + 15, hoveredTile.y + 30 + (index * 20));
            });
        }

        // Update inventory display (sidebar)
        const inventoryList = document.getElementById('inventory-list');
        if (inventoryList) {
            inventoryList.innerHTML = '';
            player.inventory.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.type}: ${item.amount}`;
                inventoryList.appendChild(li);
            });
            const ticksLi = document.createElement('li');
            ticksLi.textContent = `Ticks/Sec: ${this.ticksPerSecond}`;
            inventoryList.appendChild(ticksLi);
        }

        // Update recipe display
        const recipeList = document.getElementById('recipe-list');
        if (recipeList) {
            recipeList.innerHTML = '';
            const recipes: Recipe[] = [ironPlateRecipe]; // Add all recipes here
            recipes.forEach(recipe => {
                const li = document.createElement('li');
                const inputs = recipe.inputs.map(input => `${input.amount} ${input.type}`).join(', ');
                li.textContent = `${recipe.output.amount} ${recipe.output.type} from ${inputs} (${recipe.craftTime}s)`;
                recipeList.appendChild(li);
            });
        }

        // Update objective display
        const objectiveList = document.getElementById('objective-list');
        if (objectiveList) {
            objectiveList.innerHTML = '';
            const descriptionLi = document.createElement('li');
            descriptionLi.textContent = objective.description;
            objectiveList.appendChild(descriptionLi);

            const progressLi = document.createElement('li');
            progressLi.textContent = `Progress: ${objective.current}/${objective.target}`;
            objectiveList.appendChild(progressLi);
        }

        // Draw minimap
        const minimapX = ctx.canvas.width - 210;
        const minimapY = 10;
        const minimapWidth = 200;
        const minimapHeight = 200;
        const minimapScale = 0.1;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(minimapX, minimapY, minimapWidth, minimapHeight);

        for (const resource of world.resources) {
            ctx.fillStyle = resource.color;
            ctx.fillRect(
                minimapX + resource.x * minimapScale,
                minimapY + resource.y * minimapScale,
                resource.width * minimapScale,
                resource.height * minimapScale
            );
        }

        for (const building of world.buildings) {
            ctx.fillStyle = building.color;
            ctx.fillRect(
                minimapX + building.x * minimapScale,
                minimapY + building.y * minimapScale,
                building.width * minimapScale,
                building.height * minimapScale
            );
        }

        ctx.fillStyle = 'red';
        ctx.fillRect(
            minimapX + player.x * minimapScale,
            minimapY + player.y * minimapScale,
            player.width * minimapScale,
            player.height * minimapScale
        );
    }
}