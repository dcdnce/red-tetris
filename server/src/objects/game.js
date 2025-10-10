import { endAndDeleteRoom } from "../socket-events/handlers/handleRoomExit.js";
import Logger from "../services/logger.js";
import GameMapSingleton from "../services/gameMapSingleton.js";
import RoomState, { kStartedState, kPendingState } from "./roomstate.js";
import GameTickHandler from "./gametickhandler.js";
import emitUpdateGameData from "../socket-events/emitters/emit_update_game_data.js";

const GAME_TICK_RATE_MS = 1000;

class Game {
    constructor(roomName) {
        Logger.info(false, null, `Creating game room: ${roomName}`);
        this.roomName = roomName;
        this.leaderToken = null;
        this.players = new Map(); // <username, Player>
        this.state = new RoomState();
        this.gametickhandler = null;
        this.loopIntervalId = null; // La boucle appartient maintenant à la Room

        const gameMapSingletonInstance = new GameMapSingleton();
        gameMapSingletonInstance.set(roomName, this); // <roomName, Game>
    }

    getPlayerListForClient() {
        const playerList = [];
        for (const [username, playerData] of this.players) {
            playerList.push({
                username: username,
                board: playerData.getBoard(),
                isConnected: playerData.isConnected,
                didLost: playerData.didLost,
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
        if (
            this.getState() !== kPendingState ||
            this.gametickhandler !== null
        ) {
            throw new Error(
                "Attempted to start a game that is already running or not pending."
            );
        }

        this.setStarted();

        this.gametickhandler = new GameTickHandler(
            this.roomName,
            this.players, // this is a reference
            () => endAndDeleteRoom(this)
        );

        this.loopIntervalId = setInterval(() => {
            Logger.info(
                true,
                this.roomName,
                `GameTickHandler.tick() called every ${GAME_TICK_RATE_MS}ms`
            );

            this.gametickhandler.tick();
            emitUpdateGameData(this);
        }, GAME_TICK_RATE_MS);

        Logger.info(true, this.roomName, "Room loop started");
    }

    endGame() {
        if (
            this.getState() !== kStartedState ||
            this.gametickhandler === null
        ) {
            Logger.warning(
                true,
                this.roomName,
                "Attempted to end a game that is not running."
            );
            return;
        }

        clearInterval(this.loopIntervalId);
        this.loopIntervalId = null;
        this.gametickhandler = null;
        this.setFinished();
        Logger.info(true, this.roomName, "Room loop ended");
    }
}

export default Game;
