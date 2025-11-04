import Token from "../services/token.js";
import Logger from "../services/logger.js";
import Board from "./board.js";

const GRACE_TICK_AMOUNT = 10;

class Player {
    constructor(username, game) {
        this.username = username;
        this.socket = null;
        this.isConnected = false;
        this.didLost = false;
        this.currentGame = game;
        this.currentGame.players.set(username, this);
        this.board = new Board();
        this.token = Token.sign(username, game.roomName);
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

    setDisconnected() {
        this.isConnected = false;
        this._graceTicks = GRACE_TICK_AMOUNT;
    }

    setConnected() {
        this.isConnected = true;
        this._graceTicks = null;
    }

    setLost() {
        this.didLost = true;

        Logger.info(
            true,
            this.currentGame.roomName,
            `${this.username} just lost.`
        );
    }

    decrementGraceTicks() {
        this._graceTicks -= 1;
        return this._graceTicks;
    }

    getBoard() {
        return this.board.getBoard();
    }

    handleTetriminoSpawn() {
        if (this.didLost) return;
        if (this.board.isTetriminoNull() === false) return;

        const tetriminoId =
            this.currentGame.getPiecesSequence()[this._piecesSequenceIndex];
        this._piecesSequenceIndex += 1;
        this.board.handleTetriminoSpawn(tetriminoId);
    }

    handleGravityAndLock() {
        if (this.didLost) return;

        this.board.handleGravityAndLock();
    }

    handleInput(input) {
        return this.board.handleInput(input);
    }
}

export default Player;
