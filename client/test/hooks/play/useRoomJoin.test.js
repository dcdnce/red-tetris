import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRoomJoin } from '../../../src/hooks/play/useRoomJoin.js';
import { socket } from '../../../src/socket.js';

vi.mock('../../../src/socket.js', () => ({
    socket: {
        emit: vi.fn()
    }
}));

describe('useRoomJoin hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubGlobal('localStorage', { getItem: vi.fn(() => 'mocked-token') });
    });

    it('should join on mount and exit on unmount', () => {
        const { unmount } = renderHook(() => useRoomJoin('room1', 'sacha'));

        expect(localStorage.getItem).toHaveBeenCalledWith('sacharoom1');
        expect(socket.emit).toHaveBeenCalledWith('room_join', { roomName: 'room1', username: 'sacha', token: 'mocked-token' });

        unmount();

        expect(socket.emit).toHaveBeenCalledWith('room_exit');
    });

    it('should pass null token if not found', () => {
        vi.stubGlobal('localStorage', { getItem: vi.fn(() => null) });
        
        renderHook(() => useRoomJoin('room1', 'sacha'));

        expect(socket.emit).toHaveBeenCalledWith('room_join', { roomName: 'room1', username: 'sacha', token: null });
    });
});