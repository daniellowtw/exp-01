import { Resource } from "./Resource";
import { ironPlateRecipe, type Recipe } from "./Recipe";
import type { Player } from "./Player";
import { World } from "./World";

export type BuildingType = "miner" | "belt" | "assembler";

export class Building {
	x: number;
	y: number;
	width: number;
	height: number;
	type: BuildingType;
	color: string;
	inventory: Resource[] = [];
	miningSpeed: number = 1; // resources per second
	lastMineTime: number = 0;
	direction: "up" | "down" | "left" | "right" = "right";
	recipe: Recipe | null = null;
	craftingProgress: number = 0;

	constructor(x: number, y: number, type: BuildingType) {
		this.x = x;
		this.y = y;
		this.width = 50;
		this.height = 50;
		this.type = type;
		this.color = this.getColor();
		if (type === "assembler") {
			this.recipe = ironPlateRecipe;
		}
	}

	update(world: World, player: Player) {
		if (this.type === "miner") {
			const now = Date.now();
			if (now - this.lastMineTime > 1000 / this.miningSpeed) {
				const resource = world.getResourceAt(this.x, this.y);
				if (resource) {
					this.inventory.push(resource);
					this.lastMineTime = now;
				}
			}
		}
		if (this.type === "belt") {
			if (this.inventory.length > 0) {
				const nextBuilding = world.getBuildingAt(this.x + this.width, this.y);
				if (nextBuilding) {
					nextBuilding.inventory.push(this.inventory.pop()!);
				}
			}
		}
		if (this.type === "assembler" && this.recipe) {
			const hasInputs = this.recipe.inputs.every((input) => {
				return (
					this.inventory.filter((r) => r.type === input.type).length >=
					input.amount
				);
			});

			if (hasInputs) {
				this.craftingProgress += 1 / 60; // Assuming 60 FPS
				if (this.craftingProgress >= this.recipe.craftTime) {
					// Consume inputs
					this.recipe.inputs.forEach((input) => {
						for (let i = 0; i < input.amount; i++) {
							const resourceIndex = this.inventory.findIndex(
								(r) => r.type === input.type,
							);
							this.inventory.splice(resourceIndex, 1);
						}
					});
					// Produce output
					const outputResource = new Resource(
						this.x,
						this.y,
						50,
						50,
						this.recipe.output.type,
					);
					const nextBuilding = world.getBuildingAt(this.x + this.width, this.y);
					if (nextBuilding) {
						nextBuilding.inventory.push(outputResource);
					} else {
						player.collectResource(
							outputResource.type,
							(outputResource.width * outputResource.height) /
								(world.tileSize * world.tileSize),
						);
					}
					this.craftingProgress = 0;
				}
			}
		}
	}

	getColor(): string {
		switch (this.type) {
			case "miner":
				return "#808080";
			case "belt":
				return "#f5f5dc";
			case "assembler":
				return "#add8e6";
		}
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}
