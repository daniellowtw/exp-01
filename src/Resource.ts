export type ResourceType = 'iron' | 'copper' | 'iron-plate' | 'money';

export class Resource {
	x: number;
	y: number;
	width: number;
	height: number;
	type: ResourceType;
	color: string;

	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		type: ResourceType,
	) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.type = type;
		this.color = this.getColor();
	}

	getColor(): string {
		switch (this.type) {
			case "iron":
				return "#a19d94";
			case "copper":
				return "#b87333";
			case 'iron-plate':
                return '#d3d3d3';
            case 'money':
                return '#ffd700'; // Gold color for money
        }
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.fillStyle = "black";
		ctx.font = "12px Arial";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(
			this.type.toUpperCase(),
			this.x + this.width / 2,
			this.y + this.height / 2,
		);
	}
}
