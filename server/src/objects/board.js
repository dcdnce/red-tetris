import Logger from "../services/logger.js";
import Tetrimino, {
    kMoveLeft,
    kRotateLeft,
    kRotateRight,
} from "./tetrimino.js";
import { TetriminoOutOfBoundsException } from "../services/exceptions.js";
import { kicksI, kicksJLSTZ } from "./tetrimino.js";

export const kLockedBlock = 1;

class Board {
    constructor() {
        this._board = createEmptyBoard();
        this._tetrimino = null;
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
        if (this._tetrimino == null) return;

        let testedTetrimino = this._tetrimino.clone();

        testedTetrimino.moveDown();

        // Lock tetrimino
        if (this.isGivenTetriminoInLockState(testedTetrimino)) {
            this._lockTetrimino();
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
        if (this.isGivenTetriminoInCollisionState(testedTetrimino)) {
            // If rotation, we try a wall-kick
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

            if (!this.isGivenTetriminoInCollisionState(kicked)) {
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

    isGivenTetriminoInLockState(tetrimino) {
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

    isGivenTetriminoInCollisionState(tetrimino) {
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

    isTetriminoNull() {
        return this._tetrimino === null;
    }

    // Private

    _lockTetrimino() {
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
        Logger.success(true, null, "Applied lock");
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
