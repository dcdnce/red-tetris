import Logger from "../utils/logger.js";
import GameMapSingleton from "./gameMapSingleton.js";

class Game {
	constructor(roomName) {
		Logger.debug(`Creating game room: ${roomName}`);
		this.roomName = roomName;
		this.players = new Map(); // <username, Player>
		const gameMap = new GameMapSingleton();
        gameMap.set(roomName, this); // <roomName, Game>
	}


	getPlayerListForClient() {
		const playerList = [];
		for (const [username, playerData] of this.players) {
			playerList.push({
				username: username
			});
		}
		return playerList;
	}
}

export default Game;