import Logger from "../utils/logger.js";
import GameMapSingleton from "./gameMapSingleton.js";
import RoomState, { kStartedState } from "./roomstate.js";

const GAME_TICK_RATE_MS = 1000;

class Game {
    constructor(roomName) {
        Logger.info(true, roomName, `Creating game room: ${roomName}`);
        this.roomName = roomName;
        this.leaderToken = null;
        this.players = new Map(); // <username, Player>
        this.state = new RoomState();
        this.loopIntervalId = null;
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

    setFinished() {
        this.state.setFinished();
    }

    getState() {
        return this.state.getState();
    }

    startGame() {
        if (this.getState() == kStartedState) {
            throw new Error("startGame(): state is kStartedState");
        }

        if (this.loopIntervalId != null) {
            throw new Error("startGame() : loopIntervalId is not null");
        }

        this.setStarted();

        this.loopIntervalId = setInterval(() => {
            this.gameTick();
        }, GAME_TICK_RATE_MS);

        Logger.info(true, this.roomName, "Game loop started");
    }

    endGame() {
        if (this.getState() != kStartedState) {
            Logger.info(true, this.roomName, `End room that didn't start`);
            return;
        }

        clearInterval(this.loopIntervalId);
        this.loopIntervalId = null;

        this.setFinished();

        Logger.info(true, this.roomName, "Game loop ended");
    }

    gameTick() {
        Logger.info(true, this.roomName, "IM CALLED EVERY SECOND");
    }
}

export default Game;
