import { describe, expect, it, vi, beforeEach } from 'vitest';
import handleUserInput from '../../../src/socket-events/handlers/handleUserInput.js';
import GameMapSingleton from '../../../src/services/gameMapSingleton.js';
import Token from '../../../src/services/token.js';
import Logger from '../../../src/services/logger.js';
import { kStartedState } from '../../../src/objects/GameState.js';

vi.mock('../../../src/services/logger.js', () => ({
    default: { warning: vi.fn(), error: vi.fn() }
}));

vi.mock('../../../src/services/token.js', () => ({
    default: { verify: vi.fn() }
}));

vi.mock('../../../src/services/gameMapSingleton.js', () => {
    return {
        default: {
            get: vi.fn()
        }
    };
});

describe('handleUserInput', () => {
    let mockSocket;
    let registeredCallback;

    beforeEach(() => {
        mockSocket = {
            on: vi.fn((event, callback) => {
                if (event === 'user_input') {
                    registeredCallback = callback;
                }
            })
        };
        handleUserInput(mockSocket);
    });

    it('registers user_input event', () => {
        expect(mockSocket.on).toHaveBeenCalledWith('user_input', expect.any(Function));
    });

    it('warns if parameters are missing', () => {
        registeredCallback({ roomName: null });
        expect(Logger.warning).toHaveBeenCalledWith(false, null, 'user_input called with invalid parameters');
    });

    it('does nothing if game or player is invalid or game not started', () => {
        GameMapSingleton.get.mockReturnValue(null); // No game
        registeredCallback({ roomName: 'room1', username: 'sacha', key: 'left', token: 'token' });
        
        const mockPlayer = { isOutOfPlay: true };
        const mockGame = { players: new Map([['sacha', mockPlayer]]), getState: () => kStartedState, handleInput: vi.fn() };
        GameMapSingleton.get.mockReturnValue(mockGame);
        registeredCallback({ roomName: 'room1', username: 'sacha', key: 'left', token: 'token' });

        expect(mockGame.handleInput).not.toHaveBeenCalled();
    });

    it('verifies token and handles input if all valid', () => {
        const mockPlayer = { isOutOfPlay: false };
        const mockGame = { 
            players: new Map([['sacha', mockPlayer]]), 
            getState: () => kStartedState, 
            handleInput: vi.fn() 
        };
        GameMapSingleton.get.mockReturnValue(mockGame);

        registeredCallback({ roomName: 'room1', username: 'sacha', key: 'ArrowLeft', token: 'valid-token' });

        expect(Token.verify).toHaveBeenCalledWith('valid-token', mockPlayer);
        expect(mockGame.handleInput).toHaveBeenCalledWith(mockPlayer, 'ArrowLeft');
    });

    it('catches and logs error if any throws', () => {
        GameMapSingleton.get.mockImplementation(() => { throw new Error('Some error'); });
        registeredCallback({ roomName: 'room1', username: 'sacha', key: 'left', token: 'token' });
        expect(Logger.error).toHaveBeenCalled();
    });
});