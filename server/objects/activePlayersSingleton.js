import Player from "./player.js";

class ActivePlayersSingleton {
	constructor() {
		if (ActivePlayersSingleton._instance) {
			return ActivePlayersSingleton._instance;
		}
		ActivePlayersSingleton._instance = this;

		this.container = new Map(); // <username, Player>
	}

	get(key) {
		return this.container.get(key);
	}

	has(key) {
		return this.container.has(key);
	}

	set(key, value) {
		this.container.set(key, value);
	}

	delete(key) {
		return this.container.delete(key);
	}
}

export default ActivePlayersSingleton;