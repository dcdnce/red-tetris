import Logger from "../../services/logger.js";
import { TetriminoOutOfBoundsException } from "../../services/exceptions.js";
import { LockDelay } from "./lockdelay.js";
import { BoardRules } from "./boardrules.js";
import { kHardDrop, Tetrimino } from "./tetrimino.js";
import {
    BOARD_HEIGHT,
    kEmptyBlock,
    kIndestructibleBlock,
} from "../../constants/board_constants.js";

const MAXIMUM_EPL_INPUTS = 15;

/**
 * Class holding the board object (and tetrimino),
 *  inherent to each player.
 * Holds board tick handlers (spawn, fall, lock delay, etc).
 */
class Board {
    constructor() {
        this.lockDelay = new LockDelay();
        this._board = createEmptyBoard();
        this._tetrimino = null;
        this._remainingEPLInputs = MAXIMUM_EPL_INPUTS;
        this._clearedLinesNumber = 0;
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

    handleFallOrLock(justSpawned) {
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

        // Simple fall
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

        // Handle hard drop
        if (this._tetrimino.lastMove === kHardDrop) {
            this.lockTetrimino();
        }

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

            case " ":
                testedTetrimino.hardDrop(this);

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

    /**
     * Lock a tetrimino. And check for lines clear.
     */
    lockTetrimino() {
        if (this._tetrimino === null) {
            throw new Error("lockTetrimino called without valid tetrimino");
        }

        const absoluteBlocksPosition =
            this._tetrimino.getAbsoluteBlocksPositionArray();

        let willLockBelowSkyline = false;

        absoluteBlocksPosition.forEach(([x, y]) => {
            willLockBelowSkyline |= BoardRules.coordsAreBelowSkyline(x, y);
            this._board[y][x] = this._tetrimino.id; // locking with id
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
        this._clearedLinesNumber = this.clearLines();
        // Logger.success(true, null, "Applied lock");
    }

    clearLines() {
        let innerBoard = this._board;
        let linesToClear = [];

        for (let i = 2; i < BOARD_HEIGHT; i++) {
            // TODO maybe we can clear above the skyline ?
            if (BoardRules.isLineFullAndDestructible(innerBoard[i])) {
                linesToClear.push(i);
            }
        }

        const ln = linesToClear.length;
        if (ln) {
            for (let j = linesToClear.pop(); j >= 0; j--) {
                let newLine =
                    j - ln >= 0
                        ? innerBoard[j - ln]
                        : Array(10).fill(kEmptyBlock);
                innerBoard[j] = newLine;
            }
        }

        return ln;
    }

    addIndestructibleLines(totalLinesToAdd) {
        let innerBoard = this._board;

        while (totalLinesToAdd--) {
            const voidedLine = innerBoard[0];

            // Shift up
            for (let i = 0; i < BOARD_HEIGHT - 1; i++) {
                innerBoard[i] = innerBoard[i + 1];
            }
            innerBoard[BOARD_HEIGHT - 1] = Array(10).fill(kIndestructibleBlock); // Add indestructible line

            // Check eventual top out
            if (!BoardRules.isLineEmpty(voidedLine)) {
                Logger.error(
                    true,
                    "Line shift exceeding buffer contains blocks, TOP OUT."
                );
                throw new TetriminoOutOfBoundsException(
                    "Line shift exceeding buffer contains blocks, TOP OUT."
                );
            }
        }
    }

    // SETTERS and GETTERS
    /** Get inner board */
    getBoard() {
        return this._board; // should be a reference
    }

    getTetrimino() {
        return this._tetrimino; // should be a reference
    }

    clearTetrimino() {
        this._tetrimino = null;
    }

    getRemainingEPLInputs() {
        return this._remainingEPLInputs;
    }

    getClearedLinesNumber() {
        return this._clearedLinesNumber;
    }

    resetClearedLinesNumber() {
        this._clearedLinesNumber = 0;
    }
}

// TODO create this object dynamically with BOARD_WIDTH and BOARD_HEIGHT
function createEmptyBoard() {
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
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
    ];
}

export default Board;
