import Logger from "../services/logger.js";
import GameMapSingleton from "../services/gameMapSingleton.js";
import GameState, { kFinishedState, kPendingState } from "./GameState.js";
import GameLogicHandler from "./GameLogicHandler.js";
import emitUpdateGameData from "../socket-events/emitters/emit_update_game_data.js";
import { GameRules } from "./GameRules.js";
import { levelToSpeed } from "../constants/game_constants.js";

const DEFAULT_GAME_TICK_RATE_MS = levelToSpeed[1];
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
        this.startedAsMultiplayer = false;
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
        this.startedAsMultiplayer = this.players.size > 1;

        this.setStarted();
        this.startBoardStats();

        this.gameLogicHandler = new GameLogicHandler(
            this.roomName,
            this.players, // this is a reference
            () => endAndDeleteGameCallback(this),
            (newLevel) => this.setNewGameInterval(newLevel)
        );

        this.setNewGameInterval();

        Logger.info(true, this.roomName, "Room loop started");
    }

    restartGame() {
        if (this.getState() !== kFinishedState) {
            throw new Error("Cannot replay game: room is not in finished state.");
        }
        if (this.gameLogicHandler !== null) {
            throw new Error("Cannot replay game: game loop is already running.");
        }

        this.players.forEach((player) => {
            player.resetForNewRound();
        });
        this.winnerUsername = null;
        this.setPending();
        this.startGame();
    }

    setNewGameInterval(newLevel = 1) {
        clearInterval(this.loopIntervalId); // Clear the old one (if any)
        const newSpeed = levelToSpeed[newLevel];

        this.gameLogicHandler.updateCurrentIntervalTime(newSpeed);

        this.loopIntervalId = setInterval(() => {
            // Logger.info(
            //     true,
            //     this.roomName,
            //     `GameLogicHandler.tick() called every ${newSpeed} ms`
            // );

            this.gameLogicHandler.tick();
            this.handleWinConditions();
            emitUpdateGameData(this);
        }, newSpeed);
    }

    endRound() {
        clearInterval(this.loopIntervalId);
        this.loopIntervalId = null;
        this.gameLogicHandler = null;
        this.setFinished();
        emitUpdateGameData(this);
    }

    endAndDelete() {
        this.endRound();
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
        if (!this.startedAsMultiplayer) return;
        if (this.players.size === 0) return;
        if (this.countInPlayPlayers() !== 1) return;

        let lastInPlayPlayer = this.getLastInPlayPlayer();
        lastInPlayPlayer.setOutOfPlay("just won.");
        this.winnerUsername = lastInPlayPlayer.username;
        this.leaderToken = lastInPlayPlayer.token;
    }
}

function endAndDeleteGameCallback(game) {
    game.endRound();
}

export default Game;
