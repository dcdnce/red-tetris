import { describe, it, beforeEach, afterEach, vi, expect } from "vitest";

// --- IMPORTER LES MODULES ---
import Board from "../../../src/objects/board/board.js";
import { kTetriminosTypes } from "../../../src/constants/tetriminos_constants.js";
import { TestBoardHelper } from "./BoardTestHelper.js";
import { TetriminoOutOfBoundsException } from "../../../src/services/exceptions.js";

function getSpawnAbsoluteBlockPositionArray(id) {
    const relativeBlocks = kTetriminosTypes[id].rotationStates[0];
    const [posX, posY] = kTetriminosTypes[id].basePosition;
    return relativeBlocks.map(([x, y]) => [x + posX, y + posY]);
}

describe("Board", () => {
    let currentBoard;

    beforeEach(() => {
        vi.useFakeTimers();

        currentBoard = new Board();
        currentBoard._board = TestBoardHelper.createEmptyBoard(); // TODO remove when project is finished
    });

    afterEach(() => {
        // Clean spies and mocks
        vi.clearAllMocks();
        vi.useRealTimers();
        currentBoard = null;
    });

    // --- TESTS ---
    it("should spawn all tetriminos in their valid position", () => {
        // https://harddrop.com/wiki/Spawn_Location
        for (let id = 1; id <= 7; id++) {
            currentBoard.clearTetrimino();
            currentBoard.handleTetriminoSpawn(id);

            const absoluteBlocksPosition = currentBoard
                .getTetrimino()
                .getAbsoluteBlocksPositionArray();
            const spawnAbsoluteBlocksPosition =
                getSpawnAbsoluteBlockPositionArray(id);

            // Expect everything to be equal
            for (let j = 0; j < 4; j++) {
                expect(absoluteBlocksPosition[j][0]).toBe(
                    spawnAbsoluteBlocksPosition[j][0]
                );
                expect(absoluteBlocksPosition[j][1]).toBe(
                    spawnAbsoluteBlocksPosition[j][1]
                );
            }
        }
    });

    it("should BLOCK OUT if spawn is partially locked", () => {
        currentBoard.getBoard()[1][4] = 8; // Spawn block shared by all tetriminos.

        for (let id = 1; id <= 7; id++) {
            currentBoard.clearTetrimino();

            expect(() => currentBoard.handleTetriminoSpawn(id)).toThrowError(
                new TetriminoOutOfBoundsException(
                    "Spawn is partially locked, BLOCK OUT."
                )
            );
        }
    });

    // TODO -> FIX THIS TEST
    // it("should LOCK OUT if locked tetrimino is fully OOO", () => {
    //     // currentBoard.getBoard()[2][4] = 8; // Blocking spawn movement
    //     currentBoard._board = TestBoardHelper.createEmptyBoard(); // TODO remove when project is finished

    //     for (let id = 1; id <= 7 ; id++) {
    //         currentBoard.clearTetrimino();
    //         currentBoard.handleTetriminoSpawn(id);

    //         expect(() => currentBoard.lockTetrimino()).toThrowError(
    //             new TetriminoOutOfBoundsException(
    //                 "Tried to lock a whole tetrimino out of bounds, LOCK OUT."
    //             ),
    //         );
    //     }
    // });

    // TODO
    // - rotations
    // - wall-kicks (t-spin, etc.)
});
