import { definitiveDisconnection } from "../socket-events/handlers/handleRoomExit.js";

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

        this.handleTopOut();
        this.handleGravityAndLock();
        this.handleTetriminoSpawn(1);
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

    handleGravityAndLock() {
        this.players.forEach((player) => player.handleGravityAndLock());
    }

    handleTopOut() {
        this.players.forEach((player) => player.handleTopOut());
    }
}

export default GameTickHandler;
