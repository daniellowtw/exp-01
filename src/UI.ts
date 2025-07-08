import type { BuildingType } from "./Building";
import type { Player } from "./Player";
import { ironPlateRecipe, type Recipe } from "./Recipe";
import { type ResourceAmount } from "./ResourceAmount";

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
			inventory?: ResourceAmount[];
		} | null,
	) {
		// Draw resource count (from player inventory)
		player.inventory.forEach((item) => {
			ctx.fillText(
				`${item.type}: ${item.amount}`,
				10,
				30 + player.inventory.indexOf(item) * 30,
			);
		});

		// Draw tooltip
		if (hoveredTile) {
			ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
			let tooltipText = hoveredTile.type.toUpperCase();
			let tooltipHeight = 30;

			if (hoveredTile.inventory) {
				tooltipText += "\nInventory:";
				hoveredTile.inventory.forEach((item) => {
					tooltipText += `\n- ${item.type}: ${item.amount}`;
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

		// Update inventory display (sidebar)
		const inventoryList = document.getElementById("inventory-list");
		if (inventoryList) {
			inventoryList.innerHTML = "";
			player.inventory.forEach((item) => {
				const li = document.createElement("li");
				li.textContent = `${item.type}: ${item.amount}`;
				inventoryList.appendChild(li);
			});
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
