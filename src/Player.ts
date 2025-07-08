import { Keyboard } from './Keyboard';
import { type ResourceType } from './Resource';
import { type ResourceAmount } from './ResourceAmount';

export class Player {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    speed: number;
    inventory: ResourceAmount[] = [];

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

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
