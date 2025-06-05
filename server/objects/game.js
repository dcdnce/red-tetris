import GameMapSingleton from "./gameMapSingleton";
import Player from "./player";

class Game {
	constructor(roomName) {
		this.roomName = roomName;
		this.players = new Map(); // <username, Player>

		gameMap = new GameMapSingleton();
        gameMap.set(roomName, this);

	}
}

export default Game;