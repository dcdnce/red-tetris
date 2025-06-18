import ActivePlayersSingleton from "./activePlayersSingleton.js";
import Token from "./token.js";

class Player {
	constructor(username) {
		this.username = username;
		// this.userId = generateUserId()
		// this.lastSeen  === null
		this.currentSocketId = null;
		this.currentGameRoomName = null;
		this.token = new Token(username).token;
		console.log(`Player created: ${username} with token: ${this.token}`);
		const activePlayers = new ActivePlayersSingleton();
        activePlayers.set(username, this);

	}
}

export default Player;