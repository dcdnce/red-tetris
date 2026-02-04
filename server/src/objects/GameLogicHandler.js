import { TetriminoOutOfBoundsException } from "../services/exceptions.js";
import { definitiveDisconnection } from "../socket-events/handlers/handleRoomExit.js";

class GameLogicHandler {
    constructor(roomName, players, onGameEndCallback) {
        this.roomName = roomName;
        this.players = players;
        this.onGameEndCallback = onGameEndCallback; // Callback to notify Game that it's over
    }

    /**
     * Handle game logic for each tick.
     * (e.g. fall, pieces locking, tetrimino spawn, collisions, etc.)
     */
    tick() {
        this.handleGraceTicks();

        if (!this.players.size || this.areAllPlayersOutOfPlay()) {
            this.onGameEndCallback();
            return;
        }

        this.handleEPLLockDelay(); // check if lock delay expired
        this.handleFallOrLock(false);
        this.handleTetriminoSpawn();
        this.handleNewIndestructibleLines();
    }

    // LOBBY RELATED METHODS
    areAllPlayersOutOfPlay() {
        return Array.from(this.players.values()).every(
            (player) => player.isOutOfPlay
        );
    }

    handleGraceTicks() {
        this.players.forEach((player) => {
            if (player.isOutOfPlay) return;

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
            if (player.isOutOfPlay) return;

            try {
                player.handleTetriminoSpawn();
            } catch (error) {
                // Block out
                if (error instanceof TetriminoOutOfBoundsException) {
                    player.setOutOfPlay();
                } else {
                    throw error;
                }
            }
        });
    }

    handleFallOrLock() {
        this.players.forEach((player) => {
            if (player.isOutOfPlay) return;

            try {
                player.handleFallOrLock();
            } catch (error) {
                // Lock out
                if (error instanceof TetriminoOutOfBoundsException) {
                    player.setOutOfPlay();
                } else {
                    throw error;
                }
            }
        });
    }

    handleEPLLockDelay() {
        this.players.forEach((player) => {
            if (player.isOutOfPlay) return;

            try {
                player.handleEPLLockDelay();
            } catch (error) {
                // Lock out
                if (error instanceof TetriminoOutOfBoundsException) {
                    player.setOutOfPlay();
                } else {
                    throw error;
                }
            }
        });
    }

    handleNewIndestructibleLines() {
        let linesClearedFrom = {};

        // Searching for number of lines
        this.players.forEach((player) => {
            if (player.isOutOfPlay) return; // TODO just delete the player from the list if he lost ?

            linesClearedFrom[player.username] = player
                .getBoardObject()
                .getClearedLinesNumber();
            player.getBoardObject().resetClearedLinesNumber();
        });

        // Adding the lines
        this.players.forEach((player) => {
            if (player.isOutOfPlay) return;

            let totalLinesToAdd = 0;
            for (const [key, value] of Object.entries(linesClearedFrom)) {
                if (key != player.username) {
                    totalLinesToAdd += value;
                }
            }

            try {
                player.addIndestructibleLines(totalLinesToAdd);
            } catch (error) {
                // Top out
                if (error instanceof TetriminoOutOfBoundsException) {
                    player.setOutOfPlay();
                } else {
                    throw error;
                }
            }
        });
    }
}

export default GameLogicHandler;
