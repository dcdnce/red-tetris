import { describe, expect, it, vi, beforeEach } from 'vitest';
import Player from '../../../src/objects/player/player.js';

vi.mock('../../../src/services/token.js', () => ({
    default: { sign: () => 'mock-token' }
}));

vi.mock('../../../src/services/logger.js', () => ({
    default: { info: vi.fn(), success: vi.fn(), error: vi.fn() }
}));

const mockBoard = {
    isTetriminoNull: vi.fn(),
    handleTetriminoSpawn: vi.fn(),
    handleFallOrLock: vi.fn(),
    handleInput: vi.fn(),
    lockDelay: { isActive: vi.fn(), isExpired: vi.fn() },
    lockTetrimino: vi.fn(),
    addIndestructibleLines: vi.fn(),
    boardStats: { startTimer: vi.fn(), getPPS: vi.fn(), getLinesCleared: vi.fn() }
};

vi.mock('../../../src/objects/board/board.js', () => {
    return {
        default: vi.fn().mockImplementation(() => mockBoard)
    };
});


describe('Player', () => {
    let mockGame;
    
    beforeEach(() => {
        mockGame = {
            roomName: 'room1',
            players: new Map(),
            getPiecesSequence: vi.fn().mockReturnValue([0, 1, 2, 3]),
            leaderToken: null
        };
        vi.clearAllMocks();
    });

    it('should initialize correctly', () => {
        const player = new Player('sacha', mockGame);
        expect(player.username).toBe('sacha');
        expect(player.isConnected).toBe(false);
        expect(player.isOutOfPlay).toBe(false);
        expect(player.token).toBe('mock-token');
        expect(mockGame.players.has('sacha')).toBe(true);
        expect(mockGame.leaderToken).toBe('mock-token'); // First player is leader
    });

    it('refreshSocket should assign socket correctly', () => {
        const player = new Player('sacha', mockGame);
        const mockSocket = { join: vi.fn() };
        player.refreshSocket(mockSocket, 'room1');

        expect(player.socket).toBe(mockSocket);
        expect(mockSocket.player).toBe(player);
        expect(mockSocket.join).toHaveBeenCalledWith('room1');
    });

    it('decrementGraceTicks should reduce ticks', () => {
        const player = new Player('sacha', mockGame);
        player.setDisconnected(); // graceTicks = 10
        player.decrementGraceTicks();
        expect(player._graceTicks).toBe(9);
    });

    it('handleTetriminoSpawn should not spawn if out of play', () => {
        const player = new Player('sacha', mockGame);
        player.setOutOfPlay('reason');
        player.handleTetriminoSpawn();
        expect(mockBoard.handleTetriminoSpawn).not.toHaveBeenCalled();
    });

    it('handleTetriminoSpawn should spawn correctly', () => {
        mockBoard.isTetriminoNull.mockReturnValue(true); // ready to spawn
        const player = new Player('sacha', mockGame);
        
        player.handleTetriminoSpawn();

        expect(mockBoard.handleTetriminoSpawn).toHaveBeenCalledWith(0);
        expect(mockBoard.handleFallOrLock).toHaveBeenCalledWith(true);
        expect(player._piecesSequenceIndex).toBe(1);
    });

    it('setDisconnected and setConnected state changes', () => {
        const player = new Player('sacha', mockGame);
        
        player.setDisconnected();
        expect(player.isConnected).toBe(false);
        expect(player._graceTicks).toBe(10); // GRACE_TICK_AMOUNT

        player.setConnected();
        expect(player.isConnected).toBe(true);
        expect(player._graceTicks).toBeNull();
    });

    it('should get Board object', () => {
         const player = new Player('sacha', mockGame);
         expect(player.getBoardObject()).toBe(mockBoard);
    });

    it('handleEPLLockDelay handles lock correctly', () => {
         const player = new Player('sacha', mockGame);
         mockBoard.lockDelay.isActive.mockReturnValue(true);
         mockBoard.lockDelay.isExpired.mockReturnValue(true);

         player.handleEPLLockDelay();
         expect(mockBoard.lockTetrimino).toHaveBeenCalled();
    });
});