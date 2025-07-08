import type { BuildingType } from "./Building";
import type { Player } from "./Player";
import { Resource } from "./Resource";
import { ironPlateRecipe, Recipe } from "./Recipe";

export class UI {
	draw(
		ctx: CanvasRenderingContext2D,
		buildingType: BuildingType,
		player: Player,
		objective: { description: string; current: number; target: number },
		hoveredTile: {
			x: number;
			y: number;
			type: string;
			inventory?: Resource[];
		} | null,
	) {
		ctx.fillStyle = "white";
		ctx.font = "24px sans-serif";

		// Draw resource count
		ctx.fillText(`Iron: ${player.inventory.iron}`, 10, 30);
		ctx.fillText(`Copper: ${player.inventory.copper}`, 10, 60);
		ctx.fillText(`Iron Plate: ${player.inventory["iron-plate"]}`, 10, 90);

		// Draw tooltip
		if (hoveredTile) {
			ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
			let tooltipText = hoveredTile.type.toUpperCase();
			let tooltipHeight = 30;

			if (hoveredTile.inventory) {
				tooltipText += "\nInventory:";
				hoveredTile.inventory.forEach((item) => {
					tooltipText += `\n- ${item.type}`;
					tooltipHeight += 20;
				});
			}

			const lines = tooltipText.split("\n");
			const longestLine = lines.reduce((a, b) => (a.length > b.length ? a : b));
			const tooltipWidth = ctx.measureText(longestLine).width + 20;

			ctx.fillRect(
				hoveredTile.x + 10,
				hoveredTile.y + 10,
				tooltipWidth,
				tooltipHeight,
			);
			ctx.fillStyle = "white";
			lines.forEach((line, index) => {
				ctx.fillText(line, hoveredTile.x + 15, hoveredTile.y + 30 + index * 20);
			});
		}

		// Update inventory display
		const inventoryList = document.getElementById("inventory-list");
		if (inventoryList) {
			inventoryList.innerHTML = "";
			for (const item in player.inventory) {
				const li = document.createElement("li");
				li.textContent = `${item}: ${player.inventory[item as keyof typeof player.inventory]}`;
				inventoryList.appendChild(li);
			}
		}

		// Update recipe display
		const recipeList = document.getElementById("recipe-list");
		if (recipeList) {
			recipeList.innerHTML = "";
			const recipes: Recipe[] = [ironPlateRecipe]; // Add all recipes here
			recipes.forEach((recipe) => {
				const li = document.createElement("li");
				const inputs = recipe.inputs
					.map((input) => `${input.amount} ${input.type}`)
					.join(", ");
				li.textContent = `${recipe.output.amount} ${recipe.output.type} from ${inputs} (${recipe.craftTime}s)`;
				recipeList.appendChild(li);
			});
		}

		// Update objective display
		const objectiveList = document.getElementById("objective-list");
		if (objectiveList) {
			objectiveList.innerHTML = "";
			const descriptionLi = document.createElement("li");
			descriptionLi.textContent = objective.description;
			objectiveList.appendChild(descriptionLi);

			const progressLi = document.createElement("li");
			progressLi.textContent = `Progress: ${objective.current}/${objective.target}`;
			objectiveList.appendChild(progressLi);
		}
	}
}
