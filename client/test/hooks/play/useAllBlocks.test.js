import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAllBlocks } from '../../../src/hooks/play/useAllBlocks.js';

describe('useAllBlocks hook', () => {
    it('should return empty array if player is missing', () => {
        const { result } = renderHook(() => useAllBlocks(true, null));
        expect(result.current).toEqual([]);
    });

    it('should return blocks for local player', () => {
        // Create 20x10 board filled with 0s, and a few 1s
        const boardFull = Array.from({ length: 20 }, () => Array(10).fill(0));
        boardFull[19][5] = 1;

        const player = { boardFull };
        const { result } = renderHook(() => useAllBlocks(true, player));

        expect(result.current.length).toBe(200); // 20 * 10
        
        // Find the block we set
        const block = result.current.find(b => b.row === 19 && b.col === 5);
        expect(block.id).toBe(1);

        // Find an empty block
        const emptyBlock = result.current.find(b => b.row === 0 && b.col === 0);
        expect(emptyBlock.id).toBe(0);
    });

    it('should return blocks for opponent player with shadow skyline logic', () => {
        const board = Array.from({ length: 20 }, () => Array(10).fill(0));
        board[18][5] = 1;

        const player = { board };
        const { result } = renderHook(() => useAllBlocks(false, player));

        expect(result.current.length).toBe(200);

        // Under or at the highest block -> should mask with ID 8
        const hiddenBlock1 = result.current.find(b => b.row === 18 && b.col === 5);
        const hiddenBlock2 = result.current.find(b => b.row === 19 && b.col === 5);
        expect(hiddenBlock1.id).toBe(8);
        expect(hiddenBlock2.id).toBe(8);

        // Above the highest block -> should be empty (0)
        const emptyBlock = result.current.find(b => b.row === 17 && b.col === 5);
        expect(emptyBlock.id).toBe(0);
    });
});