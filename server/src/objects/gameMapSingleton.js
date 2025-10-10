//import Game from "./game";

import Logger from "../utils/logger.js";

class GameMapSingleton {
    constructor() {
        if (GameMapSingleton._instance) {
            return GameMapSingleton._instance;
        }
        GameMapSingleton._instance = this;

        this.container = new Map(); // <roomName, Game>
    }

    getAllRoom() {
        const allRooms = [];
        for (const [roomName, gameInstance] of this.container) {
            allRooms.push({
                roomName: roomName,
                playerCount: gameInstance.players
                    ? gameInstance.players.size
                    : 0,
                players: gameInstance.getPlayerListForClient(),
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
                    players: gameInstance.getPlayerListForClient(),
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

export default GameMapSingleton;
