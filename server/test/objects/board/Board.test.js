import { describe, it, beforeEach, afterEach, vi, expect } from "vitest";

// --- IMPORTER LES MODULES ---
import Board, { MAXIMUM_EPL_INPUTS } from "../../../src/objects/board/board.js";
import { kTetriminosTypes } from "../../../src/constants/tetriminos_constants.js";
import { TestBoardHelper } from "./TestBoardHelper.js";
import { TetriminoOutOfBoundsException } from "../../../src/services/exceptions.js";
import { BoardRules } from "../../../src/objects/board/BoardRules.js";

// Spies
const isTetriminoInCollisionStateSpy = vi.spyOn(
    BoardRules,
    "isTetriminoInCollisionState"
);
const isTetriminoInSurfaceStateSpy = vi.spyOn(
    BoardRules,
    "isTetriminoInSurfaceState"
);
const isTetriminoInLockStateSpy = vi.spyOn(
    BoardRules,
    "isTetriminoInLockState"
);

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
        currentBoard._board = TestBoardHelper.createEmptyBoard();
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

    it("should LOCK OUT if locked tetrimino is fully OOO", () => {
        for (let id = 1; id <= 7; id++) {
            currentBoard._board = TestBoardHelper.createEmptyBoard();
            currentBoard.clearTetrimino();
            currentBoard.handleTetriminoSpawn(id);

            expect(() => currentBoard.lockTetrimino()).toThrowError(
                new TetriminoOutOfBoundsException(
                    "Tried to lock a whole tetrimino out of bounds, LOCK OUT."
                )
            );
        }
    });

    it('should move the tetrimino to the left when input is "ArrowLeft" and move is valid', () => {
        currentBoard.handleTetriminoSpawn(1);
        const initialPosition = currentBoard.getTetrimino().getPosition();
        isTetriminoInCollisionStateSpy.mockReturnValue(false);
        isTetriminoInSurfaceStateSpy.mockReturnValue(false);

        const result = currentBoard.handleInput("ArrowLeft");

        expect(result).toBe(true);
        const finalPosition = currentBoard.getTetrimino().getPosition();
        expect(finalPosition[0]).toBe(initialPosition[0] - 1);
        expect(finalPosition[1]).toBe(initialPosition[1]);
    });

    it("should NOT move the tetrimino when input causes a collision", () => {
        currentBoard.handleTetriminoSpawn(1);
        const initialPosition = currentBoard.getTetrimino().getPosition();
        isTetriminoInCollisionStateSpy.mockReturnValue(true);
        isTetriminoInSurfaceStateSpy.mockReturnValue(false);

        const result = currentBoard.handleInput("ArrowLeft");

        expect(result).toBe(false);
        const finalPosition = currentBoard.getTetrimino().getPosition();
        expect(finalPosition).toEqual(initialPosition);
    });

    it("should lock the piece immediately after a hard drop", () => {
        currentBoard.handleTetriminoSpawn(1);
        const lockTetriminoSpy = vi.spyOn(currentBoard, "lockTetrimino");
        isTetriminoInCollisionStateSpy.mockReturnValue(false);
        isTetriminoInSurfaceStateSpy.mockReturnValue(false);

        currentBoard.handleInput(" "); // Input pour le hard drop

        expect(lockTetriminoSpy).toHaveBeenCalled();
        expect(currentBoard.getTetrimino()).toBeNull();
    });

    describe("handleFallOrLock", () => {
        it("should do nothing if there is no falling tetrimino", () => {
            expect(currentBoard.getTetrimino()).toBeNull();
            const initialBoardState = JSON.stringify(currentBoard.getBoard()); // State save

            currentBoard.handleFallOrLock(false);

            expect(JSON.stringify(currentBoard.getBoard())).toBe(
                initialBoardState
            );
            expect(isTetriminoInLockStateSpy).not.toHaveBeenCalled();
        });

        it("should do nothing if the lock delay is already active", () => {
            currentBoard.handleTetriminoSpawn(1);
            currentBoard.lockDelay.init();
            expect(currentBoard.lockDelay.isActive()).toBe(true);
            const initialPosition = currentBoard.getTetrimino().getPosition();

            currentBoard.handleFallOrLock(false);

            expect(currentBoard.getTetrimino().getPosition()).toEqual(
                initialPosition
            );
            expect(isTetriminoInLockStateSpy).not.toHaveBeenCalled();
        });

        it("should fall tetrimino if the space below is free", () => {
            currentBoard.handleTetriminoSpawn(1);
            const initialPosition = currentBoard.getTetrimino().getPosition();
            isTetriminoInLockStateSpy.mockReturnValue(false);

            currentBoard.handleFallOrLock(false);

            const finalPosition = currentBoard.getTetrimino().getPosition();
            expect(finalPosition[1]).toBe(initialPosition[1] + 1);
            expect(finalPosition[0]).toBe(initialPosition[0]);
            expect(currentBoard.getRemainingEPLInputs()).toBe(
                MAXIMUM_EPL_INPUTS
            );
        });

        it("should lock (and fall) if tetrimino is in lock state", () => {
            currentBoard.handleTetriminoSpawn(1);
            currentBoard.handleInput("ArrowDown");
            currentBoard.handleInput("ArrowDown");
            const lockTetriminoSpy = vi.spyOn(currentBoard, "lockTetrimino");
            isTetriminoInLockStateSpy.mockReturnValue(true);

            currentBoard.handleFallOrLock(false);

            expect(currentBoard.getTetrimino()).toBeNull();
            expect(lockTetriminoSpy).toHaveBeenCalled();
        });

        it("should not lock (and fall) if tetrimino is in lock state but just spawned", () => {
            currentBoard.handleTetriminoSpawn(1);
            const lockTetriminoSpy = vi.spyOn(currentBoard, "lockTetrimino");
            isTetriminoInLockStateSpy.mockReturnValue(true);

            currentBoard.handleFallOrLock(true);

            expect(currentBoard.getTetrimino()).not.toBeNull();
            expect(lockTetriminoSpy).not.toHaveBeenCalled();
        });
    });

    // TODO
    // - inputs
    // - wall-kicks (t-spin, etc.)
});
