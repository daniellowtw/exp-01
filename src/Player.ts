import type { Keyboard } from './Keyboard';
import type { ResourceType } from './Resource';

export class Player {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    speed: number;
    inventory: { iron: number, copper: number, 'iron-plate': number } = { iron: 0, copper: 0, 'iron-plate': 0 };

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
        this.inventory[type] += amount;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
