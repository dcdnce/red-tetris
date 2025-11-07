import Logger from "../services/logger.js";
import Tetrimino from "./tetrimino.js";
import { TetriminoOutOfBoundsException } from "../services/exceptions.js";
import { kicksI, kicksJLSTZ } from "./tetrimino.js";
import { LockDelay } from "./lockdelay.js";

export const kLockedBlock = 1;

const MAXIMUM_EPL_INPUTS = 15;

class Board {
    constructor() {
        this._board = createEmptyBoard();
        this._tetrimino = null;
        this._remainingEPLInputs = MAXIMUM_EPL_INPUTS;
        this.lockDelay = new LockDelay();
    }

    getBoard() {
        let board = this._board.map((row) => [...row]);

        // Add tetrimino if it exists
        if (this._tetrimino != null) {
            const absoluteBlocksPosition =
                this._tetrimino.getAbsoluteBlocksPositionArray();
            const id = this._tetrimino.id;

            absoluteBlocksPosition.forEach(([x, y]) => {
                if (!this.coordsAreOutOfBound(x, y)) {
                    board[y][x] = id;
                }
            });
        }

        return board;
    }

    coordsAreOutOfBound(x, y) {
        return x < 0 || y < 0 || x >= 10 || y >= 20;
    }

    isBlockedOut() {
        if (this._tetrimino == null) return;

        const absoluteBlocksPosition =
            this._tetrimino.getAbsoluteBlocksPositionArray();

        // Will touch locked piece at spawn
        let willTouchLockedPieceAtSpawn = false;
        let lowestY = 20;

        absoluteBlocksPosition.forEach(([x, y]) => {
            if (this._board[y][x] == kLockedBlock) {
                willTouchLockedPieceAtSpawn = true;
                lowestY = Math.min(lowestY, y);
            }
        });

        // Readjust tetrimino spawn if topping out
        if (willTouchLockedPieceAtSpawn) {
            for (; lowestY < this._tetrimino._baseHeight; lowestY++) {
                this._tetrimino.moveUp();
            }
        }

        return willTouchLockedPieceAtSpawn;
    }

    handleTetriminoSpawn(id) {
        if (this._tetrimino != null) return;

        this._tetrimino = new Tetrimino(id);

        if (this.isBlockedOut()) {
            Logger.error(
                true,
                "handleTetriminoSpawn spawn is locked, topping out."
            );
            throw new TetriminoOutOfBoundsException(
                "handleTetriminoSpawn spawn is locked, topping out."
            );
        }
    }

    handleGravityAndLock() {
        if (this._tetrimino === null) return;
        if (this.lockDelay.isActive() === true) return;

        let testedTetrimino = this._tetrimino.clone();

        testedTetrimino.moveDown();

        // Lock tetrimino
        if (this.isTetriminoInLockState(testedTetrimino)) {
            this.lockTetrimino();
            return;
        }

        // Simple gravity
        this._remainingEPLInputs = MAXIMUM_EPL_INPUTS;
        this._tetrimino.enforceMove(testedTetrimino.lastMove);
    }

    handleInput(input) {
        if (this._tetrimino == null) return;

        let testedTetrimino = this._tetrimino.clone();

        this.applyInputToTetrimino(testedTetrimino, input);

        // Collision
        if (this.isTetriminoInCollisionState(testedTetrimino)) {
            if (testedTetrimino.isLastMoveARotation()) {
                // try Wall-Kick
                const kickedTetrimino = this.handleWallKick(
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
        if (this.isTetriminoInSurfaceState(testedTetrimino)) {
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

    /**
     * Handles wall kick logic when a Tetrimino is rotated and collides with obstacles.
     *
     * @param {Tetrimino} rotatedTetrimino - The Tetrimino after rotation, potentially in a collision state.
     * @param {Tetrimino} originalTetrimino - The Tetrimino before rotation, used to determine rotation direction and orientation.
     * @returns the kicked tetrimino.
     */
    handleWallKick(rotatedTetrimino, originalTetrimino) {
        const from = originalTetrimino.getOrientation(); // ex: 0
        const to = rotatedTetrimino.getOrientation(); // ex: 1
        const transitionKey = `${from}->${to}`; // ex: '0->1'

        const kicksData =
            rotatedTetrimino.getType() === "I" ? kicksI : kicksJLSTZ;
        const kickTests = kicksData[transitionKey];

        if (!kickTests) {
            // No kicks. Shouldn't happen.
            throw Error("No kicks available.");
        }

        // Loop on all 5 kick for given transition.
        for (const [dx, dy] of kickTests) {
            const kicked = rotatedTetrimino.clone();

            kicked.offset(dx, dy);

            if (!this.isTetriminoInCollisionState(kicked)) {
                Logger.success(
                    true,
                    null,
                    `Wall Kick succeeded with (${dx}, ${dy})`
                );
                return kicked;
            }
        }

        // Wall kick failed
        return null;
    }

    isTetriminoInLockState(tetrimino) {
        let readyToLock = false;
        const absoluteBlocksPosition =
            tetrimino.getAbsoluteBlocksPositionArray();

        // y > 20
        readyToLock |= tetrimino.isVerticallyOutOfBoundsBottom();

        // Touch locked piece
        if (readyToLock == false) {
            absoluteBlocksPosition.forEach(([x, y]) => {
                readyToLock |= this._board[y][x] == kLockedBlock;
            });
        }

        return readyToLock;
    }

    isTetriminoInCollisionState(tetrimino) {
        let isColliding = false;

        const absoluteBlocksPosition =
            tetrimino.getAbsoluteBlocksPositionArray();

        // y
        isColliding |= tetrimino.isVerticallyOutOfBoundsBottom();

        // x
        isColliding |= tetrimino.isHorizontallyOutOfBounds();

        // Touching locked piece
        if (isColliding == false) {
            absoluteBlocksPosition.forEach(([x, y]) => {
                if (!this.coordsAreOutOfBound(x, y)) {
                    isColliding |= this._board[y][x] == kLockedBlock;
                }
            });
        }

        return isColliding;
    }

    isTetriminoInSurfaceState(tetrimino) {
        let testedTetrimino = tetrimino.clone();
        testedTetrimino.moveDown();

        return this.isTetriminoInCollisionState(testedTetrimino);
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

        absoluteBlocksPosition.forEach(([x, y]) => {
            if (this.coordsAreOutOfBound(x, y)) {
                // Lock Out
                Logger.error(
                    true,
                    "Tried to lock a tetrimino out of bounds, lock out."
                );
                throw new TetriminoOutOfBoundsException(
                    "Tried to lock a tetrimino out of bounds, lock out."
                );
            }
            this._board[y][x] = kLockedBlock;
        });

        this._tetrimino = null;
        this.lockDelay.end();
        // this._remainingEPLInputs = MAXIMUM_EPL_INPUTS;
        Logger.success(true, null, "Applied lock");
    }

    // SETTERS and GETTERS
    getRemainingEPLInputs() {
        return this._remainingEPLInputs;
    }
}

function createEmptyBoard() {
    return [
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
