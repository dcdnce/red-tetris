import { describe, it, expect, vi } from 'vitest';
import reducer, { hardDropEffect, selectLastHardDrop } from '../../src/store/uiSlice';

describe('uiSlice reducer', () => {
    it('should handle initial state', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual({
            lastHardDrop: {
                username: null,
                timestamp: null,
            },
        });
    });

    it('should handle hardDropEffect', () => {
        const mockDate = 100000000;
        vi.spyOn(Date, 'now').mockReturnValue(mockDate);

        const initialState = {
            lastHardDrop: {
                username: null,
                timestamp: null,
            },
        };
        const payload = {
            username: 'player1',
        };
        const expectedState = {
            lastHardDrop: {
                username: 'player1',
                timestamp: mockDate,
            },
        };

        expect(reducer(initialState, hardDropEffect(payload))).toEqual(expectedState);

        vi.restoreAllMocks();
    });
});

describe('uiSlice selectors', () => {
    it('selectLastHardDrop should return the last hard drop state', () => {
        const state = {
            ui: {
                lastHardDrop: {
                    username: 'player1',
                    timestamp: 100000000,
                },
            },
        };

        expect(selectLastHardDrop(state)).toEqual({
            username: 'player1',
            timestamp: 100000000,
        });
    });
});