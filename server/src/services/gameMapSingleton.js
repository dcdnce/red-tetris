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

    getAllRoom() {
        const allRooms = [];
        for (const [roomName, gameInstance] of this.container) {
            allRooms.push({
                roomName: roomName,
                playerCount: gameInstance.players
                    ? gameInstance.players.size
                    : 0,
                players: GameMapper.getPlayerList(gameInstance),
            });
        }
        return allRooms;
    }

    getRoomBySearch(searchValue) {
        const filteredRooms = [];
        if (!searchValue) return this.getAllRoom();
        for (const [roomName, gameInstance] of this.container) {
            if (roomName.includes(searchValue)) {
                filteredRooms.push({
                    roomName: roomName,
                    playerCount: gameInstance.players
                        ? gameInstance.players.size
                        : 0,
                    players: GameMapper.getPlayerList(gameInstance),
                });
            }
        }
        return filteredRooms;
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
