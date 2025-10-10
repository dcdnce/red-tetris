import { definitiveDisconnection } from "../socket-events/tetris-events/room_exit.js";
import Logger from "../utils/logger.js";

class GameTickHandler {
    constructor(roomName, players, onGameEndCallback) {
        this.roomName = roomName;
        this.players = players;
        this.onGameEndCallback = onGameEndCallback; // Callback to notify Game that it's over
    }

    tick() {
        this.players.forEach((player) => {
            if (!player.isConnected) {
                const ticksRemaining = player.decrementGraceTicks();
                if (!ticksRemaining) {
                    definitiveDisconnection(player);
                }
            }
        });

        if (!this.players.size || this.allPlayersLost()) {
            this.onGameEndCallback();
            return;
        }

        this.handleTetriminoSpawn(1);
        this.handleTopOut();
        this.handleGravity();
        this.handleTetriminoLock();
    }

    // GAME LOGIC METHODS
    allPlayersLost() {
        return Array.from(this.players.values()).every(
            (player) => player.didLost
        );
    }

    handleTetriminoSpawn(id) {
        this.players.forEach((player) => player.handleTetriminoSpawn(id));
    }

    handleGravity() {
        this.players.forEach((player) => player.handleGravity());
    }

    handleTetriminoLock() {
        this.players.forEach((player) => player.handleTetriminoLock());
    }

    handleTopOut() {
        this.players.forEach((player) => player.handleTopOut());
    }
}

export default GameTickHandler;
