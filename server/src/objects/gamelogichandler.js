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
        this.handleWinConditions();

        if (!this.players.size || this.didAllPlayersLost()) {
            this.onGameEndCallback();
            return;
        }

        this.handleEPLLockDelay(); // check if lock delay expired
        this.handleFallOrLock(false);
        this.handleTetriminoSpawn();
        this.handleNewIndestructibleLines();
    }

    // LOBBY RELATED METHODS
    didAllPlayersLost() {
        return Array.from(this.players.values()).every(
            (player) => player.didLost
        );
    }

    countAlivePlayers() {
        return Array.from(this.players.values()).filter(
            player => !player.didLost
        ).length;
    }

    handleWinConditions() {
        if (this.players.size <= 1) return ; // Do nothing if singleplayer

        if (this.countAlivePlayers() === 1) {
            console.log("ONE LAST STANDING");
        }

        // IF MULTIPLAYER
        // check if there is one last standing
            // if yes 
                // => winner message ?
                // end game (set lost ?)
    }

    handleGraceTicks() {
        this.players.forEach((player) => {
            if (player.didLost) return;

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
            if (player.didLost) return;

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

    handleFallOrLock() {
        this.players.forEach((player) => {
            if (player.didLost) return;

            try {
                player.handleFallOrLock();
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
            if (player.didLost) return;

            try {
                player.handleEPLLockDelay();
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

    handleNewIndestructibleLines() {
        let linesClearedFrom = {};

        // Searching for number of lines
        this.players.forEach((player) => {
            if (player.didLost) return; // TODO just delete the player from the list if he lost ?

            linesClearedFrom[player.username] = player
                .getBoardObject()
                .getClearedLinesNumber();
            player.getBoardObject().resetClearedLinesNumber();
        });

        // Adding the lines
        this.players.forEach((player) => {
            if (player.didLost) return;

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
                    player.setLost();
                } else {
                    throw error;
                }
            }
        });
    }
}

export default GameLogicHandler;
