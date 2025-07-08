import { Resource } from "./Resource";
import { ironPlateRecipe, type Recipe } from "./Recipe";
import type { Player } from "./Player";
import type { World } from "./World";

export type BuildingType = "miner" | "belt" | "assembler" | "delete";

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

	constructor(x: number, y: number, type: BuildingType, direction?: "up" | "down" | "left" | "right") {
		this.x = x;
		this.y = y;
		this.width = 50;
		this.height = 50;
		this.type = type;
		this.color = this.getColor();
		if (type === "assembler") {
			this.recipe = ironPlateRecipe;
		}
		if (direction) {
			this.direction = direction;
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
				let nextX = this.x;
				let nextY = this.y;

				switch (this.direction) {
					case "right":
						nextX += this.width;
						break;
					case "left":
						nextX -= this.width;
						break;
					case "up":
						nextY -= this.height;
						break;
					case "down":
						nextY += this.height;
						break;
				}

				const nextBuilding = world.getBuildingAt(nextX, nextY);
				if (nextBuilding && nextBuilding.canAcceptResource(this.inventory[0])) {
					nextBuilding.inventory.push(this.inventory.shift()!); // Use shift to remove from the front
				}
			} else { // If inventory is empty, try to pull from previous building
				let prevX = this.x;
				let prevY = this.y;

				switch (this.direction) {
					case "right":
						prevX -= this.width;
						break;
					case "left":
						prevX += this.width;
						break;
					case "up":
						prevY += this.height;
						break;
					case "down":
						prevY -= this.height;
						break;
				}

				const prevBuilding = world.getBuildingAt(prevX, prevY);
				if (prevBuilding && prevBuilding.inventory.length > 0) {
					const resourceToPull = prevBuilding.inventory[0];
					// Belts can accept any resource, so no need to check canAcceptResource here
					this.inventory.push(prevBuilding.inventory.shift()!); // Pull the resource
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
					const nextBuilding = world.getBuildingAt(this.x + this.width, this.y); // Still hardcoded for now
					if (nextBuilding && nextBuilding.canAcceptResource(outputResource)) {
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

	canAcceptResource(resource: Resource): boolean {
		// Belts can accept any resource
		if (this.type === "belt") {
			return true;
		}
		// Assemblers can accept resources that are inputs for their recipe
		if (this.type === "assembler" && this.recipe) {
			return this.recipe.inputs.some(input => input.type === resource.type);
		}
		return false;
	}

	getColor(): string {
		switch (this.type) {
			case "miner":
				return "#808080";
			case "belt":
				return "#f5f5dc";
			case "assembler":
				return "#add8e6";
            case "delete":
                return "#ff0000"; // Red for delete mode
		}
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);

		if (this.type === 'belt') {
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 2;
			ctx.beginPath();

			const centerX = this.x + this.width / 2;
			const centerY = this.y + this.height / 2;
			const arrowSize = 10;

			switch (this.direction) {
				case 'right':
					ctx.moveTo(centerX - arrowSize, centerY - arrowSize);
					ctx.lineTo(centerX + arrowSize, centerY);
					ctx.lineTo(centerX - arrowSize, centerY + arrowSize);
					break;
				case 'left':
					ctx.moveTo(centerX + arrowSize, centerY - arrowSize);
					ctx.lineTo(centerX - arrowSize, centerY);
					ctx.lineTo(centerX + arrowSize, centerY + arrowSize);
					break;
				case 'up':
					ctx.moveTo(centerX - arrowSize, centerY + arrowSize);
					ctx.lineTo(centerX, centerY - arrowSize);
					ctx.lineTo(centerX + arrowSize, centerY + arrowSize);
					break;
				case 'down':
					ctx.moveTo(centerX - arrowSize, centerY - arrowSize);
					ctx.lineTo(centerX, centerY + arrowSize);
					ctx.lineTo(centerX + arrowSize, centerY - arrowSize);
					break;
			}
			ctx.stroke();
		}
	}
}
