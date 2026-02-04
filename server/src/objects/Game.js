import { definitiveDisconnection } from "../socket-events/handlers/handleRoomExit.js";
import Logger from "../services/logger.js";
import GameMapSingleton from "../services/gameMapSingleton.js";
import GameState, { kPendingState } from "./GameState.js";
import GameLogicHandler from "./GameLogicHandler.js";
import emitUpdateGameData from "../socket-events/emitters/emit_update_game_data.js";
import { GameRules } from "./GameRules.js";

const GAME_TICK_RATE_MS = 1000;
export const PIECE_SEQUENCE_LENGTH = 1000;

/**
 * Class handling game room/lobby responsabilities.
 * Contains room info, can start game and game tick handler, etc.
 */
class Game {
    constructor(roomName) {
        Logger.info(false, null, `Creating game room: ${roomName}`);
        this.roomName = roomName;
        this.leaderToken = null;
        this.players = new Map(); // <username, Player>
        this.state = new GameState();
        this.winnerUsername = null;
        this.gameLogicHandler = null;
        this.loopIntervalId = null;
        this.piecesSequence = null;

        GameMapSingleton.set(roomName, this); // <roomName, Game>
    }

    startGame() {
        if (
            this.getState() !== kPendingState ||
            this.gameLogicHandler !== null
        ) {
            throw new Error(
                "Attempted to start a game that is already running or not pending."
            );
        }

        this.piecesSequence = GameRules.generatePiecesSequence();

        this.setStarted();
        this.startBoardStats();

        this.gameLogicHandler = new GameLogicHandler(
            this.roomName,
            this.players, // this is a reference
            () => endAndDeleteGameCallback(this)
        );

        this.loopIntervalId = setInterval(() => {
            // Logger.info(
            //     true,
            //     this.roomName,
            //     `GameLogicHandler.tick() called every ${GAME_TICK_RATE_MS}ms`
            // );

            this.gameLogicHandler.tick();
            this.handleWinConditions();
            emitUpdateGameData(this);
        }, GAME_TICK_RATE_MS);

        Logger.info(true, this.roomName, "Room loop started");
    }

    endAndDelete() {
        clearInterval(this.loopIntervalId);
        this.loopIntervalId = null;
        this.gameLogicHandler = null;
        this.setFinished();

        // [US-47] Ensures all players are disconnected if game ends
        this.players.forEach((player) => {
            definitiveDisconnection(player);
        });

        if (GameMapSingleton.delete(this.roomName) === true) {
            Logger.info(false, null, `Deleting game room ${this.roomName}`);
        }
    }

    handleInput(player, input) {
        let inputIsValid = player.handleInput(input);

        if (inputIsValid) {
            emitUpdateGameData(this);
        }
    }

    // GETTERS / SETTERS
    getPiecesSequence() {
        return this.piecesSequence;
    }

    setPending() {
        this.state.setPending();
    }

    setStarted() {
        this.state.setStarted();
    }

    startBoardStats() {
        this.players.forEach((player) => {
            player.startBoardStats();
        });
    }

    setFinished() {
        this.state.setFinished();
    }

    getState() {
        return this.state.getState();
    }

    countInPlayPlayers() {
        return Array.from(this.players.values()).filter(
            (player) => !player.isOutOfPlay
        ).length;
    }

    getLastInPlayPlayer() {
        if (this.countInPlayPlayers() !== 1) return null;

        for (const player of this.players.values()) {
            if (!player.isOutOfPlay) {
                return player;
            }
        }

        return null;
    }

    handleWinConditions() {
        if (this.players.size <= 1) return; // Do nothing if singleplayer

        if (this.countInPlayPlayers() !== 1) return;

        let lastInPlayPlayer = this.getLastInPlayPlayer();
        lastInPlayPlayer.setOutOfPlay("just won.");
        this.winnerUsername = lastInPlayPlayer.username;
    }
}

function endAndDeleteGameCallback(game) {
    game.endAndDelete();
}

export default Game;
