import GameMapSingleton from "./gameMapSingleton.js";
import Player from "./player.js";

class Game {
	constructor(roomName) {
		console.log(`Creating game room: ${roomName}`);
		this.roomName = roomName;
		this.players = new Map(); // <username, Player>
		this.board = null;

		const gameMap = new GameMapSingleton();
        gameMap.set(roomName, this);

	}
}

export default Game;