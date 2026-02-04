import Token from "../../services/token.js";
import Logger from "../../services/logger.js";
import Board from "../board/board.js";

const GRACE_TICK_AMOUNT = 10;

class Player {
    constructor(username, game) {
        this.username = username;
        this.socket = null;
        this.isConnected = false;
        this.isOutOfPlay = false;
        this.currentGame = game;
        this.currentGame.players.set(username, this);
        this.token = Token.sign(username, game.roomName);
        this._board = new Board();
        this._graceTicks = null;
        this._piecesSequenceIndex = 0;

        // Game leader
        if (this.currentGame.players.size === 1) {
            this.currentGame.leaderToken = this.token;
        }
    }

    refreshSocket(socket, roomName) {
        this.socket = socket;
        this.socket.player = this; // !Important - if socket has no player it won't clean the room at exit time.
        this.socket.join(roomName); // socketio room
    }

    decrementGraceTicks() {
        this._graceTicks -= 1;
        return this._graceTicks;
    }

    handleTetriminoSpawn() {
        if (this.isOutOfPlay) return;
        if (this._board.isTetriminoNull() === false) return;

        const tetriminoId =
            this.currentGame.getPiecesSequence()[this._piecesSequenceIndex];
        this._piecesSequenceIndex += 1;
        this._board.handleTetriminoSpawn(tetriminoId);

        // [US-48] Spawned tetrimino should immediately drop one row
        this._board.handleFallOrLock(true);
    }

    handleFallOrLock() {
        if (this.isOutOfPlay) return;

        this._board.handleFallOrLock(false);
    }

    handleInput(input) {
        return this._board.handleInput(input);
    }

    handleEPLLockDelay() {
        if (this._board.lockDelay.isActive() === true) {
            if (this._board.lockDelay.isExpired() === true) {
                this._board.lockTetrimino();
            }
        }
    }

    addIndestructibleLines(totalLinesToAdd) {
        if (totalLinesToAdd) {
            Logger.info(
                true,
                `${this.username}`,
                `Should receives ${totalLinesToAdd} indestructible lines.`
            );
        }

        this._board.addIndestructibleLines(totalLinesToAdd);
    }

    //GETTERS and SETTERS
    setDisconnected() {
        this.isConnected = false;
        this._graceTicks = GRACE_TICK_AMOUNT;
    }

    setConnected() {
        this.isConnected = true;
        this._graceTicks = null;
    }

    setOutOfPlay(reason = "") {
        this.isOutOfPlay = true;

        Logger.info(
            true,
            this.currentGame.roomName,
            `${this.username} was set out of play. Reason : ${reason}`
        );
    }

    getBoardObject() {
        return this._board;
    }

    getNextPieceId() {
        if (this.currentGame.getPiecesSequence() === null) return null;

        return this.currentGame.getPiecesSequence()[this._piecesSequenceIndex];
    }

    startBoardStats() {
        this._board.boardStats.startTimer();
    }

    getPPS() {
        return this._board.boardStats.getPPS();
    }

    getLinesCleared() {
        return this._board.boardStats.getLinesCleared();
    }
}

export default Player;
