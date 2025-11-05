import Logger from "../services/logger.js";
import Tetrimino, {
    kMoveLeft,
    kRotateLeft,
    kRotateRight,
} from "./tetrimino.js";
import { TetriminoOutOfBoundsException } from "../services/exceptions.js";
import { kicksI, kicksJLSTZ } from "./tetrimino.js";

export const kLockedBlock = 1;

const LOCK_DELAY_MS = 500;
const MAXIMUM_EPL_INPUTS = 15;

class Board {
    constructor() {
        this._board = createEmptyBoard();
        this._tetrimino = null;
        this._lockDelayTimer = null;
        this._remainingEPLInputs = MAXIMUM_EPL_INPUTS;
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
        if (this.isInLockDelay() === true) return;

        let testedTetrimino = this._tetrimino.clone();

        testedTetrimino.moveDown();

        // Lock tetrimino
        if (this.isTetriminoInLockState(testedTetrimino)) {
            this.lockTetrimino();
            return;
        }

        // Simple gravity
        this._tetrimino.enforceMove(testedTetrimino.lastMove);
    }

    handleInput(input) {
        if (this._tetrimino == null) return;

        let testedTetrimino = this._tetrimino.clone();

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

        // TODO merge this code in the above switch
        // Wall-Kick
        if (this.isTetriminoInCollisionState(testedTetrimino)) {
            if (
                testedTetrimino.lastMove === kRotateLeft ||
                testedTetrimino.lastMove === kRotateRight
            ) {
                const kickedTetrimino = this.tryWallKick(
                    testedTetrimino,
                    this._tetrimino
                );
                if (kickedTetrimino) {
                    this._tetrimino = kickedTetrimino;
                    return true;
                }
            }

            return false;
        }

        // Lock delay shenanigans
        if (this.isTetriminoInSurfaceState(testedTetrimino)) {
            // Is there a block below ?
            if (this.isInLockDelay() === true) {
                if (
                    this.isLockDelayExpired() === true ||
                    this._remainingEPLInputs == 0
                ) {
                    // Lock, so do nothing
                    // TODO normally lock is handled by next tick
                    return false;
                } else if (this.isLockDelayExpired() === false) {
                    this.initLockDelay(); // reset lock delay
                    this._remainingEPLInputs -= 1;
                }
            } else if (this.isInLockDelay() === false) {
                this.initLockDelay();
            }
        } else {
            if (this.isInLockDelay()) {
                this.endLockDelay(); // end lock cause no surface below
            }
        }

        this._tetrimino = testedTetrimino;
        return true;
    }

    tryWallKick(rotatedTetrimino, originalTetrimino) {
        const from = originalTetrimino.getOrientation(); // ex: 0
        const to = rotatedTetrimino.getOrientation(); // ex: 1
        const transitionKey = `${from}->${to}`; // ex: '0->1'

        const kicksData =
            rotatedTetrimino.getType() === "I" ? kicksI : kicksJLSTZ;
        const kickTests = kicksData[transitionKey];

        if (!kickTests) {
            // No kicks. Shouldn't happen.
            return null;
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
        this.endLockDelay();
        this._remainingEPLInputs = MAXIMUM_EPL_INPUTS;
        Logger.success(true, null, "Applied lock");
    }

    initLockDelay() {
        this._lockDelayTimer = Date.now();
        Logger.info(true, null, `Lock Delay reset.`);
    }

    isLockDelayExpired() {
        if (this._lockDelayTimer === null) return false;

        return Date.now() - this._lockDelayTimer >= LOCK_DELAY_MS;
    }

    endLockDelay() {
        this._lockDelayTimer = null;
        Logger.info(true, null, `Lock Delay ended.`);
    }

    isInLockDelay() {
        return this._lockDelayTimer !== null;
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
    ];
}

export default Board;
