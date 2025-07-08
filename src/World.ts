import { Resource } from './Resource';
import type { ResourceType } from './Resource';
import { Building, type BuildingType } from './Building';


export class World {
    width: number;
    height: number;
    tileSize: number;
    resources: Resource[] = [];
    buildings: Building[] = [];

    constructor(width: number, height: number, tileSize: number) {
        this.width = width;
        this.height = height;
        this.tileSize = tileSize;
    }

    generate() {
        this.generateResourcePatch(10, 10, 5, 5, 'iron');
        this.generateResourcePatch(20, 20, 5, 5, 'copper');
    }

    generateResourcePatch(x: number, y: number, width: number, height: number, type: ResourceType) {
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                this.resources.push(new Resource((x + i) * this.tileSize, (y + j) * this.tileSize, this.tileSize, this.tileSize, type));
            }
        }
    }

    addBuilding(x: number, y: number, type: BuildingType) {
        this.buildings.push(new Building(x, y, type));
    }

    getResourceAt(x: number, y: number): Resource | undefined {
        return this.resources.find(r => r.x === x && r.y === y);
    }

    getBuildingAt(x: number, y: number): Building | undefined {
        return this.buildings.find(b => b.x === x && b.y === y);
    }

    update(player: any) {
        for (const building of this.buildings) {
            building.update(this, player);
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        for (const resource of this.resources) {
            resource.draw(ctx);
        }
        for (const building of this.buildings) {
            building.draw(ctx);
        }
    }
}
