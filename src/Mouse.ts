export class Mouse {
    x: number = 0;
    y: number = 0;
    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    private onMouseMove(event: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        this.x = event.clientX - rect.left;
        this.y = event.clientY - rect.top;
    }
}
