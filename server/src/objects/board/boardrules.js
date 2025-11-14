import {
    BOARD_HEIGHT,
    BOARD_WIDTH,
    kLockedBlock,
} from "../../constants/board_constants.js";
import { kicksI, kicksJLSTZ } from "../../constants/tetriminos_constants.js";
import Logger from "../../services/logger.js";

/**
 * Pure static helper class handling board rules :
 *  collisions, block out, lock out, etc.
 *
 */
export class BoardRules {
    static coordsAreOutOfBound(x, y) {
        return x < 0 || y < 0 || x >= BOARD_WIDTH || y >= BOARD_HEIGHT;
    }

    static coordsAreBelowSkyline(x, y) {
        return y >= 2;
    }

    static isBlockedOut(board) {
        const tetrimino = board.getTetrimino();
        const innerBoard = board.getBoard();

        if (tetrimino === null) return;

        const absoluteBlocksPosition =
            tetrimino.getAbsoluteBlocksPositionArray();

        // Will touch locked piece at spawn
        let willTouchLockedPieceAtSpawn = false;
        let lowestY = BOARD_HEIGHT;

        absoluteBlocksPosition.forEach(([x, y]) => {
            if (innerBoard[y][x] == kLockedBlock) {
                willTouchLockedPieceAtSpawn = true;
                lowestY = Math.min(lowestY, y);
            }
        });

        return willTouchLockedPieceAtSpawn;
    }

    static isTetriminoInLockState(board, tetrimino) {
        let readyToLock = false;
        const absoluteBlocksPosition =
            tetrimino.getAbsoluteBlocksPositionArray();

        // y > 22
        readyToLock |= tetrimino.isVerticallyOutOfBoundsBottom();

        // Touch locked piece
        const innerBoard = board.getBoard();
        if (readyToLock == false) {
            absoluteBlocksPosition.forEach(([x, y]) => {
                readyToLock |= innerBoard[y][x] == kLockedBlock;
            });
        }

        return readyToLock;
    }

    static isTetriminoInCollisionState(board, tetrimino) {
        let isColliding = false;

        const absoluteBlocksPosition =
            tetrimino.getAbsoluteBlocksPositionArray();

        // y
        isColliding |= tetrimino.isVerticallyOutOfBoundsBottom();

        // x
        isColliding |= tetrimino.isHorizontallyOutOfBounds();

        // Touching locked piece
        const innerBoard = board.getBoard();
        if (isColliding == false) {
            absoluteBlocksPosition.forEach(([x, y]) => {
                if (!BoardRules.coordsAreOutOfBound(x, y)) {
                    isColliding |= innerBoard[y][x] == kLockedBlock;
                }
            });
        }

        return isColliding;
    }

    static isTetriminoInSurfaceState(board, tetrimino) {
        let testedTetrimino = tetrimino.clone();
        testedTetrimino.moveDown();

        return BoardRules.isTetriminoInCollisionState(board, testedTetrimino);
    }

    /**
     * Handles wall kick logic when a Tetrimino is rotated and collides with obstacles.
     *
     * @param {Tetrimino} rotatedTetrimino - The Tetrimino after rotation, potentially in a collision state.
     * @param {Tetrimino} originalTetrimino - The Tetrimino before rotation, used to determine rotation direction and orientation.
     * @returns the kicked tetrimino.
     */
    static handleWallKick(board, rotatedTetrimino, originalTetrimino) {
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

            if (!BoardRules.isTetriminoInCollisionState(board, kicked)) {
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
}
