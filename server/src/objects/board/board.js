import Logger from "../../services/logger.js";
import { TetriminoOutOfBoundsException } from "../../services/exceptions.js";
import { LockDelay } from "./lockdelay.js";
import { BoardRules } from "./boardrules.js";
import { kLockedBlock } from "../../constants/board_constants.js";
import { Tetrimino } from "./tetrimino.js";

const MAXIMUM_EPL_INPUTS = 15;

/**
 * Class holding the board object (and tetrimino),
 *  inherent to each player.
 * Holds board tick handlers (spawn, gravity, lock delay, etc).
 */
class Board {
    constructor() {
        this._board = createEmptyBoard();
        this._tetrimino = null;
        this._remainingEPLInputs = MAXIMUM_EPL_INPUTS;
        this.lockDelay = new LockDelay();
    }

    handleTetriminoSpawn(id) {
        if (this._tetrimino != null) return;

        this._tetrimino = new Tetrimino(id);

        if (BoardRules.isBlockedOut(this)) {
            Logger.error(true, "Spawn is partially locked, BLOCK OUT.");
            throw new TetriminoOutOfBoundsException(
                "Spawn is partially locked, BLOCK OUT."
            );
        }
    }

    handleGravityAndLock(justSpawned) {
        if (this._tetrimino === null) return;
        if (this.lockDelay.isActive() === true) return;

        let testedTetrimino = this._tetrimino.clone();

        testedTetrimino.moveDown();

        // Lock tetrimino
        if (BoardRules.isTetriminoInLockState(this, testedTetrimino)) {
            if (!justSpawned) {
                this.lockTetrimino();
            }
            return;
        }

        // Refresh lowest Y
        this._tetrimino.setLowestY(testedTetrimino.getY());
        this._remainingEPLInputs = MAXIMUM_EPL_INPUTS;

        // Simple gravity
        this._tetrimino.enforceMove(testedTetrimino.lastMove);
    }

    handleInput(input) {
        if (this._tetrimino == null) return;

        let testedTetrimino = this._tetrimino.clone();

        this.applyInputToTetrimino(testedTetrimino, input);

        // Collision
        if (BoardRules.isTetriminoInCollisionState(this, testedTetrimino)) {
            if (testedTetrimino.isLastMoveARotation()) {
                // try Wall-Kick
                const kickedTetrimino = BoardRules.handleWallKick(
                    this,
                    testedTetrimino,
                    this._tetrimino
                );
                if (kickedTetrimino === false) return false;
                testedTetrimino = kickedTetrimino;
            } else {
                return false;
            }
        }

        // Handle lock delay
        if (this.handleLockDelay(testedTetrimino) == false) {
            return false;
        }

        // Refresh lowest Y only if tetrimino falls to its lowest line
        if (this._tetrimino.getLowestY() < testedTetrimino.getY()) {
            testedTetrimino.setLowestY(testedTetrimino.getY());
            this._remainingEPLInputs = MAXIMUM_EPL_INPUTS;
        }

        this._tetrimino = testedTetrimino;
        return true;
    }

    applyInputToTetrimino(testedTetrimino, input) {
        switch (input) {
            case "ArrowUp":
            case "x":
                testedTetrimino.rotateRight();
                break;

            case "z":
                testedTetrimino.rotateLeft();
                break;

            case "ArrowRight":
                testedTetrimino.moveRight();
                break;

            case "ArrowLeft":
                testedTetrimino.moveLeft();
                break;

            case "ArrowDown":
                testedTetrimino.moveDown();
                break;

            default:
                break;
        }
    }

    /**
     * Manages the lock delay mechanism when a Tetrimino touches the surface.
     *
     * @param {Tetrimino} testedTetrimino - The currently active Tetrimino being evaluated for locking behavior.
     * @returns false if the piece should lock on the next tick.
     */
    handleLockDelay(testedTetrimino) {
        // Is there a block below ?
        if (BoardRules.isTetriminoInSurfaceState(this, testedTetrimino)) {
            if (this.lockDelay.isActive() === true) {
                if (
                    this.lockDelay.isExpired() === true ||
                    this._remainingEPLInputs == 0
                ) {
                    // Lock handled in next tick, so do nothing
                    return false;
                } else if (this.lockDelay.isExpired() === false) {
                    this.lockDelay.reset(); // reset lock delay
                    this._remainingEPLInputs -= 1;
                }
            } else if (this.lockDelay.isActive() === false) {
                this.lockDelay.init();
            }
        } else {
            if (this.lockDelay.isActive()) {
                this.lockDelay.end(); // end lock cause no surface below
            }
        }

        return true;
    }

    isTetriminoNull() {
        return this._tetrimino === null;
    }

    lockTetrimino() {
        if (this._tetrimino == null) {
            throw new Error("lockTetrimino called without valid tetrimino");
        }

        const absoluteBlocksPosition =
            this._tetrimino.getAbsoluteBlocksPositionArray();

        let willLockBelowSkyline = false;

        absoluteBlocksPosition.forEach(([x, y]) => {
            willLockBelowSkyline |= BoardRules.coordsAreBelowSkyline(x, y);
            this._board[y][x] = kLockedBlock;
        });

        if (willLockBelowSkyline == false) {
            // Lock Out
            Logger.error(
                true,
                "Tried to lock a whole tetrimino out of bounds, LOCK OUT."
            );
            throw new TetriminoOutOfBoundsException(
                "Tried to lock a whole tetrimino out of bounds, LOCK OUT."
            );
        }

        this._tetrimino = null;
        this.lockDelay.end();
        Logger.success(true, null, "Applied lock");
    }

    // SETTERS and GETTERS
    /**
     * Get inner board WITHOUT current tetrimino.
     */
    getBoard() {
        return this._board; // should be a reference
    }

    getTetrimino() {
        return this._tetrimino; // should be a reference
    }

    getRemainingEPLInputs() {
        return this._remainingEPLInputs;
    }

    /**
     * Get inner board WITH current tetrimino.
     */
    getFullBoard() {
        let board = this._board.map((row) => [...row]);

        // Add tetrimino if it exists
        if (this._tetrimino != null) {
            const absoluteBlocksPosition =
                this._tetrimino.getAbsoluteBlocksPositionArray();
            const id = this._tetrimino.id;

            absoluteBlocksPosition.forEach(([x, y]) => {
                if (!BoardRules.coordsAreOutOfBound(x, y)) {
                    board[y][x] = id;
                }
            });
        }

        return board;
    }

    getTetrimino() {
        return this._tetrimino;
    }
}

function createEmptyBoard() {
    return [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
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
    ];
}

export default Board;
