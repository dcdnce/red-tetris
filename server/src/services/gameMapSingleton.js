import Logger from "./logger.js";
import { GameMapper } from "./mappers/GameMapper.js";

class GameMapSingleton {
    constructor() {
        this.container = new Map(); // <roomName, Game>
        Logger.warning(
            false,
            null,
            "Creating GameMapSingleton. It should only happen one time."
        );
    }

    get(key) {
        return this.container.get(key);
    }

    has(key) {
        return this.container.has(key);
    }

    delete(key) {
        return this.container.delete(key);
    }

    set(key, value) {
        this.container.set(key, value);
    }

    clear() {
        this.container.clear();
        Logger.info(true, null, "Game map singleton cleared.");
    }
}

// Direct export of unique instance :
const gameMapSingletonInstance = new GameMapSingleton();
export default gameMapSingletonInstance;
