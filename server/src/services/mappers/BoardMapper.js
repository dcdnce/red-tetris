import { kGhostBlock } from "../../constants/board_constants.js";
import { BoardRules } from "../../objects/board/BoardRules.js";

/**
 * Handles formatting of Board object data for emitting purpose.
 */
export class BoardMapper {
    /**
     * Get inner board WITH current tetrimino and ghost.
     */
    static getFullBoard(boardObject) {
        let board = boardObject.getBoard().map((row) => [...row]);
        let tetrimino = boardObject.getTetrimino();

        if (tetrimino != null) {
            // Add ghost
            let ghost = tetrimino.clone();
            while (!BoardRules.isTetriminoInLockState(boardObject, ghost)) {
                ghost.moveDown();
            }
            ghost.moveUp();

            const ghostAbsoluteBlocksPosition =
                ghost.getAbsoluteBlocksPositionArray();

            ghostAbsoluteBlocksPosition.forEach(([x, y]) => {
                if (!BoardRules.coordsAreOutOfBound(x, y)) {
                    board[y][x] = kGhostBlock;
                }
            });

            // Add tetrimino
            const absoluteBlocksPosition =
                tetrimino.getAbsoluteBlocksPositionArray();
            const id = tetrimino.id;

            absoluteBlocksPosition.forEach(([x, y]) => {
                if (!BoardRules.coordsAreOutOfBound(x, y)) {
                    board[y][x] = id;
                }
            });
        }

        return board;
    }

    //  /**
    //  * Get ghost coords.
    //  *
    //  * @returns an array of array [0=y, 1=x, 2=id].
    //  */
    // getGhostCoords() {
    //     let extraCoords = [];

    //     if (this._tetrimino != null) {
    //         // Add ghost
    //         let ghost = this._tetrimino.clone();
    //         while (!BoardRules.isTetriminoInLockState(this, ghost)) {
    //             ghost.moveDown();
    //         }
    //         ghost.moveUp();

    //         const ghostAbsoluteBlocksPosition =
    //             ghost.getAbsoluteBlocksPositionArray();

    //         ghostAbsoluteBlocksPosition.forEach(([x, y]) => {
    //             if (!BoardRules.coordsAreOutOfBound(x, y)) {
    //                 extraCoords.push([y, x, kGhostBlock]);
    //             }
    //         });
    //     }

    //     return extraCoords;
    // }

    // /**
    //  * Get tetrimino coords.
    //  *
    //  * @returns an array of array [0=y, 1=x, 2=id].
    //  */
    // getTetriminoCoords() {
    //     let extraCoords = [];

    //     if (this._tetrimino != null) {
    //         // Add tetrimino
    //         const absoluteBlocksPosition =
    //             this._tetrimino.getAbsoluteBlocksPositionArray();
    //         const id = this._tetrimino.id;

    //         absoluteBlocksPosition.forEach(([x, y]) => {
    //             if (!BoardRules.coordsAreOutOfBound(x, y)) {
    //                 extraCoords.push([y, x, id]);
    //             }
    //         });
    //     }

    //     return extraCoords;
    // }
}
