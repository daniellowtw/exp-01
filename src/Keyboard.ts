export class Keyboard {
	private keys: { [key: string]: boolean } = {};

	constructor() {
		window.addEventListener("keydown", (e) => this.onKeyDown(e));
		window.addEventListener("keyup", (e) => this.onKeyUp(e));
	}

	private onKeyDown(event: KeyboardEvent) {
		this.keys[event.key] = true;
	}

	private onKeyUp(event: KeyboardEvent) {
		this.keys[event.key] = false;
	}

	isPressed(key: string): boolean {
		return this.keys[key] || false;
	}
}
