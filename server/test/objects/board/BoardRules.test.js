import { describe, expect, it } from 'vitest';
import { BoardRules } from '../../../src/objects/board/BoardRules.js';
import {
    BOARD_HEIGHT,
    BOARD_WIDTH,
    kEmptyBlock,
    kIndestructibleBlock,
} from '../../../src/constants/board_constants.js';

describe('BoardRules', () => {
    describe('coordsAreOutOfBound', () => {
        it('should return true if x < 0', () => {
            expect(BoardRules.coordsAreOutOfBound(-1, 5)).toBeTruthy();
        });

        it('should return true if y < 0', () => {
            expect(BoardRules.coordsAreOutOfBound(5, -1)).toBeTruthy();
        });

        it('should return true if x >= BOARD_WIDTH', () => {
            expect(BoardRules.coordsAreOutOfBound(BOARD_WIDTH, 5)).toBeTruthy();
        });

        it('should return true if y >= BOARD_HEIGHT', () => {
            expect(BoardRules.coordsAreOutOfBound(5, BOARD_HEIGHT)).toBeTruthy();
        });

        it('should return false if within bounds', () => {
            expect(BoardRules.coordsAreOutOfBound(5, 5)).toBeFalsy();
        });
    });

    describe('coordsAreBelowSkyline', () => {
        it('should return true if y >= 2', () => {
            expect(BoardRules.coordsAreBelowSkyline(5, 2)).toBeTruthy();
            expect(BoardRules.coordsAreBelowSkyline(5, 10)).toBeTruthy();
        });

        it('should return false if y < 2', () => {
            expect(BoardRules.coordsAreBelowSkyline(5, 0)).toBeFalsy();
            expect(BoardRules.coordsAreBelowSkyline(5, 1)).toBeFalsy();
        });
    });

    describe('isLineFullAndDestructible', () => {
        it('should return true for a full and destructible line', () => {
            const line = new Array(BOARD_WIDTH).fill(1); // Locked block 1
            expect(BoardRules.isLineFullAndDestructible(line)).toBeTruthy();
        });

        it('should return false if the line contains an empty block', () => {
            const line = new Array(BOARD_WIDTH).fill(1);
            line[5] = kEmptyBlock;
            expect(BoardRules.isLineFullAndDestructible(line)).toBeFalsy();
        });

        it('should return false if the line contains an indestructible block', () => {
            const line = new Array(BOARD_WIDTH).fill(1);
            line[5] = kIndestructibleBlock;
            expect(BoardRules.isLineFullAndDestructible(line)).toBeFalsy();
        });

        it('should throw an error if the line is null or has incorrect length', () => {
            expect(() => BoardRules.isLineFullAndDestructible(null)).toThrow('isLineFullAndDestructible called without valid line array');
            expect(() => BoardRules.isLineFullAndDestructible(new Array(5))).toThrow('isLineFullAndDestructible called without valid line array');
        });
    });

    describe('isLineEmpty', () => {
        it('should return true if line is fully empty', () => {
            const line = new Array(BOARD_WIDTH).fill(kEmptyBlock);
            expect(BoardRules.isLineEmpty(line)).toBeTruthy();
        });

        it('should return false if line contains non-empty blocks', () => {
            const line = new Array(BOARD_WIDTH).fill(kEmptyBlock);
            line[5] = 1;
            expect(BoardRules.isLineEmpty(line)).toBeFalsy();
        });

        it('should throw an error if the line is null or has incorrect length', () => {
            expect(() => BoardRules.isLineEmpty(null)).toThrow('isLineEmpty called without valid line array');
            expect(() => BoardRules.isLineEmpty(new Array(5))).toThrow('isLineEmpty called without valid line array');
        });
    });
});
    describe('isBlockedOut', () => {
        it('should return undefined if tetrimino is null', () => {
            const mockBoard = { getTetrimino: () => null, getBoard: () => [] };
            expect(BoardRules.isBlockedOut(mockBoard)).toBeUndefined();
        });

        it('should return true if tetrimino touches locked piece at spawn', () => {
            const mockTetrimino = {
                getAbsoluteBlocksPositionArray: () => [[5, 2]]
            };
            const innerBoard = new Array(BOARD_HEIGHT).fill(0).map(() => new Array(BOARD_WIDTH).fill(kEmptyBlock));
            innerBoard[2][5] = 1; // Locked block

            const mockBoard = {
                getTetrimino: () => mockTetrimino,
                getBoard: () => innerBoard
            };
            
            expect(BoardRules.isBlockedOut(mockBoard)).toBeTruthy();
        });

        it('should return false if tetrimino does not touch locked piece at spawn', () => {
            const mockTetrimino = {
                getAbsoluteBlocksPositionArray: () => [[5, 2]]
            };
            const innerBoard = new Array(BOARD_HEIGHT).fill(0).map(() => new Array(BOARD_WIDTH).fill(kEmptyBlock));

            const mockBoard = {
                getTetrimino: () => mockTetrimino,
                getBoard: () => innerBoard
            };
            
            expect(BoardRules.isBlockedOut(mockBoard)).toBeFalsy();
        });
    });

    describe('isTetriminoInLockState', () => {
        it('should return true if vertically out of bounds bottom', () => {
            const mockTetrimino = {
                getAbsoluteBlocksPositionArray: () => [[5, BOARD_HEIGHT]],
                isVerticallyOutOfBoundsBottom: () => true
            };
            const mockBoard = { getBoard: () => [] };
            
            expect(BoardRules.isTetriminoInLockState(mockBoard, mockTetrimino)).toBeTruthy();
        });

        it('should return true if touching locked piece', () => {
             const mockTetrimino = {
                getAbsoluteBlocksPositionArray: () => [[5, 10]],
                isVerticallyOutOfBoundsBottom: () => false
            };
            const innerBoard = new Array(BOARD_HEIGHT).fill(0).map(() => new Array(BOARD_WIDTH).fill(kEmptyBlock));
            innerBoard[10][5] = 1;

            const mockBoard = { getBoard: () => innerBoard };
            
            expect(BoardRules.isTetriminoInLockState(mockBoard, mockTetrimino)).toBeTruthy();
        });

        it('should return false if neither', () => {
            const mockTetrimino = {
                getAbsoluteBlocksPositionArray: () => [[5, 10]],
                isVerticallyOutOfBoundsBottom: () => false
            };
            const innerBoard = new Array(BOARD_HEIGHT).fill(0).map(() => new Array(BOARD_WIDTH).fill(kEmptyBlock));
            const mockBoard = { getBoard: () => innerBoard };
            
            expect(BoardRules.isTetriminoInLockState(mockBoard, mockTetrimino)).toBeFalsy();
        });
    });

    describe('isTetriminoInCollisionState', () => {
        it('should return true if vertically out of bounds', () => {
            const mockTetrimino = {
                getAbsoluteBlocksPositionArray: () => [[5, -1]],
                isVerticallyOutOfBounds: () => true,
                isHorizontallyOutOfBounds: () => false
            };
            const mockBoard = { getBoard: () => [] };
            expect(BoardRules.isTetriminoInCollisionState(mockBoard, mockTetrimino)).toBe(1); // 1 = true due to bitwise logic
        });

        it('should return true if horizontally out of bounds', () => {
            const mockTetrimino = {
                getAbsoluteBlocksPositionArray: () => [[-1, 5]],
                isVerticallyOutOfBounds: () => false,
                isHorizontallyOutOfBounds: () => true
            };
            const mockBoard = { getBoard: () => [] };
            expect(BoardRules.isTetriminoInCollisionState(mockBoard, mockTetrimino)).toBe(1);
        });

        it('should return true if colliding with a locked piece', () => {
             const mockTetrimino = {
                getAbsoluteBlocksPositionArray: () => [[5, 10]],
                isVerticallyOutOfBounds: () => false,
                isHorizontallyOutOfBounds: () => false
            };
            const innerBoard = new Array(BOARD_HEIGHT).fill(0).map(() => new Array(BOARD_WIDTH).fill(kEmptyBlock));
            innerBoard[10][5] = 1;
            const mockBoard = { getBoard: () => innerBoard };
            expect(BoardRules.isTetriminoInCollisionState(mockBoard, mockTetrimino)).toBe(1);
        });

        it('should return false if no collision', () => {
            const mockTetrimino = {
                getAbsoluteBlocksPositionArray: () => [[5, 10]],
                isVerticallyOutOfBounds: () => false,
                isHorizontallyOutOfBounds: () => false
            };
            const innerBoard = new Array(BOARD_HEIGHT).fill(0).map(() => new Array(BOARD_WIDTH).fill(kEmptyBlock));
            const mockBoard = { getBoard: () => innerBoard };
            expect(BoardRules.isTetriminoInCollisionState(mockBoard, mockTetrimino)).toBe(0);
        });
    });

    describe('isTetriminoInSurfaceState', () => {
        it('should clone tetrimino, move down, and check collision', () => {
            const movedMock = {
                getAbsoluteBlocksPositionArray: () => [[5, 11]],
                isVerticallyOutOfBounds: () => false,
                isHorizontallyOutOfBounds: () => false
            };
            const mockTetrimino = {
                clone: () => ({ moveDown: () => {}, ...movedMock })
            };
            const mockBoard = { getBoard: () => new Array(BOARD_HEIGHT).fill(0).map(() => new Array(BOARD_WIDTH).fill(kEmptyBlock)) };
            expect(BoardRules.isTetriminoInSurfaceState(mockBoard, mockTetrimino)).toBe(0);
        });
    });

    describe('handleWallKick', () => {
        it('should throw error if kick transition not found', () => {
            const mockOriginal = { getOrientation: () => "INVALID", getType: () => "T" };
            const mockRotated = { getOrientation: () => "STATE", getType: () => "T" };
            expect(() => BoardRules.handleWallKick(null, mockRotated, mockOriginal)).toThrow("No kicks available.");
        });

        it('should return a kicked tetrimino if one succeeds', () => {
            const mockOriginal = { getOrientation: () => 0, getType: () => "T" };
            const mockRotated = { 
                getOrientation: () => 1, 
                getType: () => "T",
                clone: () => ({ offset: (dx, dy) => {}, getAbsoluteBlocksPositionArray: () => [[5, 10]], isVerticallyOutOfBounds: () => false, isHorizontallyOutOfBounds: () => false })
            };
            const innerBoard = new Array(BOARD_HEIGHT).fill(0).map(() => new Array(BOARD_WIDTH).fill(kEmptyBlock));
            const mockBoard = { getBoard: () => innerBoard };

            const kicked = BoardRules.handleWallKick(mockBoard, mockRotated, mockOriginal);
            expect(kicked).not.toBeNull();
        });

        it('should return null if all kicks fail', () => {
            const mockOriginal = { getOrientation: () => 0, getType: () => "T" };
            
            // A rotated tetrimino that always results in collision when cloned and tested
            const mockRotated = { 
                getOrientation: () => 1, 
                getType: () => "T",
                clone: () => ({ offset: (dx, dy) => {}, getAbsoluteBlocksPositionArray: () => [[5, 10]], isVerticallyOutOfBounds: () => true, isHorizontallyOutOfBounds: () => false })
            };
            
            // isVerticallyOutOfBounds = true forces collision to true for every test

            const mockBoard = { getBoard: () => [] };

            const kicked = BoardRules.handleWallKick(mockBoard, mockRotated, mockOriginal);
            expect(kicked).toBeNull();
        });
    });
