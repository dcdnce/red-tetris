import ActivePlayersSingleton from "./activePlayersSingleton";

class Player {
	constructor(username) {
		this.username = username;
		// this.userId = generateUserId()
		// this.lastSeen  === null
		this.currentSocketId = null;
		this.currentGameRoomName = null;

		activePlayers = new ActivePlayersSingleton();
        activePlayers.set(username, this);

	}
}

export default Player;