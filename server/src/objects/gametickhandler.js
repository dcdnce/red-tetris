import { TetriminoOutOfBoundsException } from "../services/exceptions.js";
import Logger from "../services/logger.js";
import { definitiveDisconnection } from "../socket-events/handlers/handleRoomExit.js";

class GameTickHandler {
    constructor(roomName, players, onGameEndCallback) {
        this.roomName = roomName;
        this.players = players;
        this.onGameEndCallback = onGameEndCallback; // Callback to notify Game that it's over
    }

    /**
     * Handle game logic for each tick.
     * (e.g. gravity, pieces locking, tetrimino spawn, collisions, etc.)
     */
    tick() {
        this.handleGraceTicks();

        if (!this.players.size || this.allPlayersLost()) {
            this.onGameEndCallback();
            return;
        }

        this.handleEPLLockDelay(); // check if lock delay expired
        this.handleGravityAndLock();
        this.handleTetriminoSpawn();
    }

    // LOBBY RELATED METHODS
    allPlayersLost() {
        return Array.from(this.players.values()).every(
            (player) => player.didLost
        );
    }

    handleGraceTicks() {
        this.players.forEach((player) => {
            if (!player.isConnected) {
                const ticksRemaining = player.decrementGraceTicks();
                if (!ticksRemaining) {
                    definitiveDisconnection(player);
                }
            }
        });
    }

    // GAME LOGIC METHODS

    /**
     * Handler that spawns a new tetrimino if the last one was just locked on the board.
     *
     * Player will lose is the piece cannot spawn / be lock.
     * @param {number} id Type of the spawning piece.
     */
    handleTetriminoSpawn() {
        this.players.forEach((player) => {
            try {
                player.handleTetriminoSpawn();
            } catch (error) {
                // Block out
                if (error instanceof TetriminoOutOfBoundsException) {
                    player.setLost();
                } else {
                    throw error;
                }
            }
        });
    }

    handleGravityAndLock() {
        this.players.forEach((player) => {
            try {
                player.handleGravityAndLock();
            } catch (error) {
                // Lock out
                if (error instanceof TetriminoOutOfBoundsException) {
                    player.setLost();
                } else {
                    throw error;
                }
            }
        });
    }

    handleEPLLockDelay() {
        this.players.forEach((player) => {
            player.handleEPLLockDelay();
        });
    }
}

export default GameTickHandler;
