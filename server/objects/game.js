import Logger from "../utils/logger.js";
import GameMapSingleton from "./gameMapSingleton.js";
import RoomState from "./roomstate.js";

class Game {
    constructor(roomName) {
        Logger.info(true, `Creating game room: ${roomName}`);
        this.roomName = roomName;
        this.leaderToken = null;
        this.players = new Map(); // <username, Player>
        this.state = new RoomState();
        const gameMapSingletonInstance = new GameMapSingleton();
        gameMapSingletonInstance.set(roomName, this); // <roomName, Game>
    }

    getPlayerListForClient() {
        const playerList = [];
        for (const [username, playerData] of this.players) {
            playerList.push({
                username: username,
                board: playerData.board,
                isConnected: playerData.isConnected,
                isLeader: playerData.token === this.leaderToken,
            });
        }
        return playerList;
    }

    setPending() {
        this.state.setPending();
    }

    setStarted() {
        this.state.setStarted();
    }

    getState() {
        return this.state.getState();
    }
}

export default Game;
