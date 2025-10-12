import Logger from "../services/logger.js";
import Tetrimino from "./tetrimino.js";

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
                board[y][x] = id;
            });
        }

        return board;
    }

    coordsAreOutOfBound(x, y) {
        return x < 0 || y < 0 || x >= 10 || y >= 20;
    }

    handleTetriminoSpawn(id) {
        if (this._tetrimino != null) return;

        this._tetrimino = new Tetrimino(id);
    }

    handleTopOut() {
        if (this._tetrimino == null) return false;

        let didTopOut = false;

        const absoluteBlocksPosition =
            this._tetrimino.getAbsoluteBlocksPositionArray();

        absoluteBlocksPosition.forEach(([x, y]) => {
            if (!this.coordsAreOutOfBound(x, y)) {
                didTopOut |= this._board[y][x] == kLockedBlock;
            }
        });

        return didTopOut;
    }

    handleGravityAndLock() {
        if (this._tetrimino == null) return;

        let testedTetrimino = this._tetrimino.clone(this._tetrimino.id);

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

        let testedTetrimino = this._tetrimino.clone(this._tetrimino.id);

        if (input === "ArrowUp") {
            testedTetrimino.rotate();
        }

        if (input === "ArrowRight") {
            testedTetrimino.moveRight();
        }

        if (input === "ArrowLeft") {
            testedTetrimino.moveLeft();
        }

        if (input === "ArrowDown") {
            testedTetrimino.moveDown();
        }

        if (this.isGivenTetriminoInCollisionState(testedTetrimino)) {
            return false;
        }

        this._tetrimino.enforceMove(testedTetrimino.lastMove);
        return true;
    }

    isGivenTetriminoInLockState(tetrimino) {
        let readyToLock = false;
        const absoluteBlocksPosition =
            tetrimino.getAbsoluteBlocksPositionArray();

        // y > 20
        readyToLock |= tetrimino.isVerticallyOutOfBounds();

        // Touch locked piece
        if (readyToLock == false) {
            absoluteBlocksPosition.forEach(([x, y]) => {
                if (!this.coordsAreOutOfBound(x, y)) {
                    readyToLock |= this._board[y][x] == kLockedBlock;
                }
            });
        }

        return readyToLock;
    }

    isGivenTetriminoInCollisionState(tetrimino) {
        let isColliding = false;

        const absoluteBlocksPosition =
            tetrimino.getAbsoluteBlocksPositionArray();

        // y
        isColliding |= tetrimino.isVerticallyOutOfBounds();

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

    // Private

    _lockTetrimino() {
        if (this._tetrimino == null) {
            throw new Error("lockTetrimino called without valid tetrimino");
        }

        const absoluteBlocksPosition =
            this._tetrimino.getAbsoluteBlocksPositionArray();

        absoluteBlocksPosition.forEach(([x, y]) => {
            this._board[y][x] = kLockedBlock;
        });

        this._tetrimino = null;
        Logger.success(true, "Applied lock");
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
