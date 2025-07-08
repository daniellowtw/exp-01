import type { BuildingType } from "./Building";
import type { Player } from "./Player";
import { Resource } from "./Resource";

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

		// Draw objective
		ctx.fillText(`Objective: ${objective.description}`, 10, 120);
		ctx.fillText(`Progress: ${objective.current}/${objective.target}`, 10, 150);

		// Draw tooltip
		if (hoveredTile) {
			console.log(
				`Hovered tile: ${hoveredTile.type} at (${hoveredTile.x}, ${hoveredTile.y})`,
			);
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

			// const lines = tooltipText.split('\n');
			// const longestLine = lines.reduce((a, b) => a.length > b.length ? a : b);
			// const tooltipWidth = ctx.measureText(longestLine).width + 20;

			// ctx.fillRect(hoveredTile.x + 10, hoveredTile.y + 10, tooltipWidth, tooltipHeight);
			// ctx.fillStyle = 'white';
			// lines.forEach((line, index) => {
			//     ctx.fillText(line, hoveredTile.x + 15, hoveredTile.y + 30 + (index * 20));
			// });
		}

		// Update inventory display
		const inventoryList = document.getElementById("inventory-list");
		if (inventoryList) {
			inventoryList.innerHTML = "";
			for (const item in player.inventory) {
				const li = document.createElement("li");
				li.textContent = `${item}: ${
					player.inventory[item as keyof typeof player.inventory]
				}`;
				inventoryList.appendChild(li);
			}
		}
	}
}
