import { definitiveDisconnection } from "../socket-events/handlers/handleRoomExit.js";
import Logger from "../services/logger.js";
import GameMapSingleton from "../services/gameMapSingleton.js";
import RoomState, { kPendingState } from "./roomstate.js";
import GameLogicHandler from "./gamelogichandler.js";
import emitUpdateGameData from "../socket-events/emitters/emit_update_game_data.js";
import { ScoreRepository } from "../repositories/ScoreRepository.js";

const GAME_TICK_RATE_MS = 1000;
export const PIECE_SEQUENCE_LENGTH = 1000;

/**
 * Class handling game room responsabilities.
 * Contains room info, can start game and game tick handler, etc.
 */
class Game {
    constructor(roomName) {
        Logger.info(false, null, `Creating game room: ${roomName}`);
        this.roomName = roomName;
        this.leaderToken = null;
        this.players = new Map(); // <username, Player>
        this.state = new RoomState();
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

        this.generatePiecesSequence();

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
            emitUpdateGameData(this);
        }, GAME_TICK_RATE_MS);

        Logger.info(true, this.roomName, "Room loop started");
    }

    endAndDelete() {
        clearInterval(this.loopIntervalId);
        this.players.forEach(async (player, username) => {
            const score = player.getBoardObject().boardStats.getScore();
            const linesCleared = player
                .getBoardObject()
                .boardStats.getLinesCleared();
            try {
                await ScoreRepository.saveScore(username, score, linesCleared);
            } catch (error) {
                Logger.error(`Failed to save score for ${username}:`, error);
            }
        });
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

    generatePiecesSequence() {
        if (this.piecesSequence !== null) {
            throw new Error(
                "generatePiecesSequence called on a already generated pieces sequence."
            );
        }

        const baseBag = [1, 2, 3, 4, 5, 6, 7];
        this.piecesSequence = [];

        while (this.piecesSequence.length < PIECE_SEQUENCE_LENGTH) {
            let shuffledBag = [...baseBag];

            // Shuffle
            for (let i = shuffledBag.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [shuffledBag[i], shuffledBag[j]] = [
                    shuffledBag[j],
                    shuffledBag[i],
                ];
            }

            this.piecesSequence.push(...shuffledBag);
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
}

function endAndDeleteGameCallback(game) {
    game.endAndDelete();
}

export default Game;
