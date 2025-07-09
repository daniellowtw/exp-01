import { Resource, type ResourceType } from "./Resource";
import { ironPlateRecipe, type Recipe } from "./Recipe";
import type { Player } from "./Player";
import type { World } from "./World";
import type { ResourceAmount } from "./ResourceAmount";

export type BuildingType = "miner" | "belt" | "assembler" | "delete" | "iron-plate-seller";

export class Building {
	x: number;
	y: number;
	width: number;
	height: number;
	type: BuildingType;
	color: string;
	inventory: ResourceAmount[] = [];
	miningSpeed: number = 1; // resources per tick
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

	tickUpdate(world: World, player: Player, deltaTime: number) {
		if (this.type === "miner") {
			const resource = world.getResourceAt(this.x, this.y);
			if (resource) {
				this.addResourceToInventory(resource.type, this.miningSpeed);
			}
		}
		if (this.type === "belt") {
			if (this.inventory.length > 0) {
				const resourceToMove = this.inventory[0]; // Peek at the first resource

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
				if (nextBuilding && nextBuilding.canAcceptResource(resourceToMove.type)) {
					nextBuilding.addResourceToInventory(resourceToMove.type, 1);
					this.removeResourceFromInventory(resourceToMove.type, 1);
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
					this.addResourceToInventory(resourceToPull.type, 1);
					prevBuilding.removeResourceFromInventory(resourceToPull.type, 1);
				}
			}
		}
		if (this.type === "assembler" && this.recipe) {
			const hasInputs = this.recipe.inputs.every((input) => {
				return this.getResourceCount(input.type) >= input.amount;
			});

			if (hasInputs) {
				this.craftingProgress += 1;
				if (this.craftingProgress >= this.recipe.craftTime) {
					// Consume inputs
					this.recipe.inputs.forEach((input) => {
						this.removeResourceFromInventory(input.type, input.amount);
					});
					// Produce output
					const outputResourceType = this.recipe.output.type;
					const outputResourceAmount = this.recipe.output.amount;

					const nextBuilding = world.getBuildingAt(this.x + this.width, this.y); // Still hardcoded for now
					if (nextBuilding && nextBuilding.canAcceptResource(outputResourceType)) {
						nextBuilding.addResourceToInventory(outputResourceType, outputResourceAmount);
					} else {
						player.collectResource(outputResourceType, outputResourceAmount);
					}
					this.craftingProgress = 0;
				}
			}
		}
		if (this.type === "iron-plate-seller") {
            const ironPlates = player.getResourceCount('iron-plate');
            if (ironPlates > 0) {
                player.removeResourceFromInventory('iron-plate', 1);
                player.collectResource('money', 10); // Sell 1 iron plate for 10 money
            }
		}
	}

    addResourceToInventory(type: ResourceType, amount: number) {
        const existingResource = this.inventory.find(r => r.type === type);
        if (existingResource) {
            existingResource.amount += amount;
        } else {
            this.inventory.push({ type, amount });
        }
    }

    removeResourceFromInventory(type: ResourceType, amount: number) {
        const existingResource = this.inventory.find(r => r.type === type);
        if (existingResource) {
            existingResource.amount -= amount;
            if (existingResource.amount <= 0) {
                this.inventory = this.inventory.filter(r => r.type !== type);
            }
        }
    }

    getResourceCount(type: ResourceType): number {
        const resource = this.inventory.find(r => r.type === type);
        return resource ? resource.amount : 0;
    }

    canAcceptResource(resourceType: ResourceType): boolean {
        // Belts can accept any resource
        if (this.type === "belt") {
            return true;
        }
        // Assemblers can accept resources that are inputs for their recipe
        if (this.type === "assembler" && this.recipe) {
            return this.recipe.inputs.some(input => input.type === resourceType);
        }
        // Iron plate sellers can accept iron plates
        if (this.type === "iron-plate-seller") {
            return resourceType === 'iron-plate';
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
				return "#add3e6";
            case "delete":
                return "#ff0000"; // Red for delete mode
            case "iron-plate-seller":
                return "#ffd700"; // Gold for iron plate seller
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