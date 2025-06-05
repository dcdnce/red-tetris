import Player from "./player";

class ActivePlayersSingleton {
	constructor() {
		if (ActivePlayersSingleton._instance) {
			return ActivePlayersSingleton._instance;
		}
		_instance = this;

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
}

export default ActivePlayersSingleton;