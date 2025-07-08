import { Keyboard } from './Keyboard';
import { ResourceType } from './Resource';
import { ResourceAmount } from './ResourceAmount';

export class Player {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    speed: number;
    inventory: ResourceAmount[] = [{ type: 'money', amount: 0 }];

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.color = 'blue';
        this.speed = 5;
    }

    update(keyboard: Keyboard) {
        if (keyboard.isPressed('ArrowUp') || keyboard.isPressed('w')) {
            this.y -= this.speed;
        }
        if (keyboard.isPressed('ArrowDown') || keyboard.isPressed('s')) {
            this.y += this.speed;
        }
        if (keyboard.isPressed('ArrowLeft') || keyboard.isPressed('a')) {
            this.x -= this.speed;
        }
        if (keyboard.isPressed('ArrowRight') || keyboard.isPressed('d')) {
            this.x += this.speed;
        }
    }

    collectResource(type: ResourceType, amount: number) {
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

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}