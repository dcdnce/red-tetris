import { describe, it, expect } from 'vitest';
import reducer, {
    joinRoomSuccess,
    joinRoomFailed,
    updateGameData,
    roomLaunchSuccess,
    selectRoomState,
    selectRoomError,
    selectPlayers,
    selectIsRoomLeader,
    selectWinnerUsername,
} from '../../src/store/gameSlice';
import {
    kErrorState,
    kPendingState,
    kStartedState,
} from '../../src/services/constants';

describe('gameSlice reducer', () => {
    const initialState = {
        rooms: {},
    };

    it('should handle initial state', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle joinRoomSuccess', () => {
        const payload = {
            roomName: 'room1',
            players: [{ username: 'player1' }],
        };
        const expectedState = {
            rooms: {
                room1: {
                    roomName: 'room1',
                    players: [{ username: 'player1' }],
                    roomState: kPendingState,
                    error: null,
                },
            },
        };
        expect(reducer(initialState, joinRoomSuccess(payload))).toEqual(expectedState);
    });

    it('should handle joinRoomFailed', () => {
        const payload = {
            roomName: 'room1',
            error: 'Connection failed',
        };
        const expectedState = {
            rooms: {
                room1: {
                    roomName: null,
                    players: null,
                    roomState: kErrorState,
                    error: 'Connection failed',
                },
            },
        };
        expect(reducer(initialState, joinRoomFailed(payload))).toEqual(expectedState);
    });

    it('should handle updateGameData', () => {
        const initialStateWithRoom = {
            rooms: {
                room1: {
                    roomName: 'room1',
                    players: [{ username: 'player1' }],
                    roomState: kPendingState,
                    error: null,
                },
            },
        };
        const payload = {
            roomName: 'room1',
            roomState: kStartedState,
            players: [{ username: 'player1', score: 100 }],
            winnerUsername: 'player1',
        };
        const expectedState = {
            rooms: {
                room1: {
                    roomName: 'room1',
                    players: [{ username: 'player1', score: 100 }],
                    roomState: kStartedState,
                    error: null,
                    winnerUsername: 'player1',
                },
            },
        };
        expect(reducer(initialStateWithRoom, updateGameData(payload))).toEqual(expectedState);
    });

    it('should handle roomLaunchSuccess', () => {
        const initialStateWithRoom = {
            rooms: {
                room1: {
                    roomName: 'room1',
                    players: [{ username: 'player1' }],
                    roomState: kPendingState,
                    error: null,
                },
            },
        };
        const payload = {
            roomName: 'room1',
        };
        const expectedState = {
            rooms: {
                room1: {
                    roomName: 'room1',
                    players: [{ username: 'player1' }],
                    roomState: kStartedState,
                    error: null,
                },
            },
        };
        expect(reducer(initialStateWithRoom, roomLaunchSuccess(payload))).toEqual(expectedState);
    });
});

describe('gameSlice selectors', () => {
    const state = {
        roomsHandler: {
            rooms: {
                room1: {
                    roomState: kStartedState,
                    error: null,
                    players: [
                        { username: 'player1', isLeader: true },
                        { username: 'player2', isLeader: false },
                    ],
                    winnerUsername: 'player1',
                },
                roomWithError: {
                    roomState: kErrorState,
                    error: 'Some error',
                },
            },
        },
    };

    it('selectRoomState should return the correct room state', () => {
        expect(selectRoomState('room1')(state)).toEqual(kStartedState);
        expect(selectRoomState('unknownRoom')(state)).toBeNull();
    });

    it('selectRoomError should return the correct room error', () => {
        expect(selectRoomError('roomWithError')(state)).toEqual('Some error');
        expect(selectRoomError('room1')(state)).toBeNull();
    });

    it('selectPlayers should return the players', () => {
        expect(selectPlayers('room1')(state)).toEqual([
            { username: 'player1', isLeader: true },
            { username: 'player2', isLeader: false },
        ]);
        expect(selectPlayers('unknownRoom')(state)).toBeNull();
    });

    it('selectIsRoomLeader should return correctly if the given user is leader', () => {
        expect(selectIsRoomLeader('room1', 'player1')(state)).toBe(true);
        expect(selectIsRoomLeader('room1', 'player2')(state)).toBe(false);
        expect(selectIsRoomLeader('unknownRoom', 'player1')(state)).toBe(false);
    });

    it('selectWinnerUsername should return the winner username', () => {
        expect(selectWinnerUsername('room1')(state)).toEqual('player1');
        expect(selectWinnerUsername('unknownRoom')(state)).toBeNull();
    });
});