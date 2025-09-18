import Token from "../services/token.js";

const GRACE_TICK_AMOUNT = 10;

class Player {
    constructor(username, game) {
        this.username = username;
        this.socket = null;
        this.isConnected = false;
        this.currentGame = game;
        this.currentGame.players.set(username, this);
        this.board = this.createEmptyBoard();
        this.token = Token.sign(username, game.roomName);
        this._graceTicks = null;

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

    decrementGraceTicks() {
        this._graceTicks -= 1;
        return this._graceTicks;
    }

    createEmptyBoard() {
        return [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ];
    }
}

export default Player;
