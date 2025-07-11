import { Player } from "./Player";
import { tickInterval, TICKS_PER_SECOND } from "./main";
import { Keyboard } from "./Keyboard";
import { World } from "./World";
import { Mouse } from "./Mouse";
import type { BuildingType } from "./Building";
import { UI } from "./UI";
import { type ResourceAmount } from "./ResourceAmount";
import { StateManager } from "./StateManager";

export class Game {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	player: Player;
	keyboard: Keyboard;
	world: World;
	mouse: Mouse;
	buildingType: BuildingType = "miner";
	currentBeltDirection: "up" | "down" | "left" | "right" = "right";
	ui: UI;
	objective: { description: string; current: number; target: number };
    stateManager: StateManager;
	cameraX: number = 0;
	cameraY: number = 0;
	lastTickTime: number = 0;
	hoveredTile: {
		x: number;
		y: number;
		type: string;
		inventory?: ResourceAmount[];
	} | null = null;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d")!;
		this.player = new Player(100, 100);
		this.keyboard = new Keyboard();
		this.world = new World(100, 100, 30);
		this.world.generate();
		this.mouse = new Mouse(this.canvas);
		this.ui = new UI(TICKS_PER_SECOND);
        this.stateManager = new StateManager();
		this.objective = {
			description: "Produce 10 Iron Plates",
			current: 0,
			target: 10,
		};
        this.stateManager.loadState(this);
		this.gameLoop = this.gameLoop.bind(this);
		this.canvas.addEventListener("click", () => this.handleClick());
		this.canvas.addEventListener("mousemove", () => this.handleMouseMove());

		document
			.getElementById("miner-button")!
			.addEventListener("click", () => (this.buildingType = "miner"));
		document
			.getElementById("belt-button")!
			.addEventListener("click", () => (this.buildingType = "belt"));
		document
			.getElementById("assembler-button")!
			.addEventListener("click", () => (this.buildingType = "assembler"));
        document
            .getElementById("iron-plate-seller-button")!
            .addEventListener("click", () => (this.buildingType = "iron-plate-seller" as BuildingType));
        document
            .getElementById("delete-button")!
            .addEventListener("click", () => (this.buildingType = "delete" as BuildingType));
        document
            .getElementById("save-button")!
            .addEventListener("click", () => this.stateManager.saveState(this));

		window.addEventListener("keydown", (e) => this.handleKey(e));
	}

	start() {
		this.gameLoop();
		setInterval(() => this.gameTick(), tickInterval);
	}

	gameTick() {
		this.world.update(this.player);
	}

    handleKey(e: KeyboardEvent) {
        if (e.key === 'r' && this.buildingType === 'belt') {
            const directions = ['right', 'down', 'left', 'up'];
            const currentIndex = directions.indexOf(this.currentBeltDirection);
            const nextIndex = (currentIndex + 1) % directions.length;
            this.currentBeltDirection = directions[nextIndex] as any;
        }
    }

	handleMouseMove() {
		const gridX = Math.floor(
			(this.mouse.x + this.cameraX) / this.world.tileSize,
		);
		const gridY = Math.floor(
			(this.mouse.y + this.cameraY) / this.world.tileSize,
		);

		const resource = this.world.getResourceAt(
			gridX * this.world.tileSize,
			gridY * this.world.tileSize,
		);
		const building = this.world.getBuildingAt(
			gridX * this.world.tileSize,
			gridY * this.world.tileSize,
		);

        if (building) {
            this.hoveredTile = {
                x: this.mouse.x,
                y: this.mouse.y,
                type: building.type,
                inventory: building.inventory,
            };
            console.log(`Hovered building: ${building.type} at (${gridX}, ${gridY}) with inventory: ${building.inventory.map(item => item.type).join(", ")}`);
        } else if (resource) {
            this.hoveredTile = {
                x: this.mouse.x,
                y: this.mouse.y,
                type: resource.type,
            };
        } else {
            this.hoveredTile = null;
        }
	}

	handleClick() {
		const gridX = Math.floor(
			(this.mouse.x + this.cameraX) / this.world.tileSize,
		);
		const gridY = Math.floor(
			(this.mouse.y + this.cameraY) / this.world.tileSize,
		);
        if (this.buildingType === 'delete') {
            this.world.removeBuilding(gridX * this.world.tileSize, gridY * this.world.tileSize);
        } else {
            this.world.addBuilding(
                gridX * this.world.tileSize,
                gridY * this.world.tileSize,
                this.buildingType,
                this.buildingType === 'belt' ? this.currentBeltDirection : undefined
            );
        }
	}

	gameLoop() {
		this.update();
		this.draw();
		requestAnimationFrame(this.gameLoop);
	}

	update() {
		this.player.update(this.keyboard);
		this.objective.current = this.player.inventory.find(item => item.type === "iron-plate")?.amount || 0;

		// Update camera position based on player position
		this.cameraX = this.player.x - this.canvas.width / 2;
		this.cameraY = this.player.y - this.canvas.height / 2;
	}

	draw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.save();
		this.ctx.translate(-this.cameraX, -this.cameraY);
		this.world.draw(this.ctx);
		this.player.draw(this.ctx);
		this.ctx.restore();
		this.ui.draw(
				this.ctx,
				this.player,
				this.objective,
				this.hoveredTile,
				this.world
			);
	}
}
