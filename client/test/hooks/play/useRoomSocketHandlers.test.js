import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRoomSocketHandlers } from '../../../src/hooks/play/useRoomSocketHandlers.js';
import { socket } from '../../../src/socket.js';
import { useDispatch } from 'react-redux';
import {
    joinRoomSuccess,
    joinRoomFailed,
    updateGameData,
    roomLaunchSuccess,
} from '../../../src/store/gameSlice.js';

vi.mock('../../../src/socket.js', () => ({
    socket: {
        on: vi.fn(),
        off: vi.fn()
    }
}));

vi.mock('react-redux', () => ({
    useDispatch: vi.fn()
}));

const mockDispatch = vi.fn();

describe('useRoomSocketHandlers', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useDispatch.mockReturnValue(mockDispatch);
        vi.stubGlobal('localStorage', { setItem: vi.fn() });
    });

    it('should register and unregister all socket events', () => {
        const { unmount } = renderHook(() => useRoomSocketHandlers());

        expect(socket.on).toHaveBeenCalledWith('join_room_success', expect.any(Function));
        expect(socket.on).toHaveBeenCalledWith('join_room_failed', expect.any(Function));
        expect(socket.on).toHaveBeenCalledWith('update_game_data', expect.any(Function));
        expect(socket.on).toHaveBeenCalledWith('room_launch_failed', expect.any(Function));
        expect(socket.on).toHaveBeenCalledWith('room_launch_success', expect.any(Function));

        unmount();

        expect(socket.off).toHaveBeenCalledWith('join_room_success', expect.any(Function));
        expect(socket.off).toHaveBeenCalledWith('join_room_failed', expect.any(Function));
        expect(socket.off).toHaveBeenCalledWith('update_game_data', expect.any(Function));
        expect(socket.off).toHaveBeenCalledWith('room_launch_failed', expect.any(Function));
        expect(socket.off).toHaveBeenCalledWith('room_launch_success', expect.any(Function));
    });

    it('should handle join_room_success with token', () => {
        let handleJoinSuccess;
        socket.on.mockImplementation((event, callback) => {
            if (event === 'join_room_success') handleJoinSuccess = callback;
        });

        renderHook(() => useRoomSocketHandlers());

        const data = { username: 'sacha', roomName: 'room1', token: 'super-token' };
        handleJoinSuccess(data);

        expect(localStorage.setItem).toHaveBeenCalledWith('sacharoom1', 'super-token');
        expect(mockDispatch).toHaveBeenCalledWith(joinRoomSuccess(data));
    });

    it('should handle logic events correctly', () => {
        let failCallback, updateCallback, launchCallback;
        socket.on.mockImplementation((event, callback) => {
            if (event === 'join_room_failed') failCallback = callback;
            if (event === 'update_game_data') updateCallback = callback;
            if (event === 'room_launch_success') launchCallback = callback;
        });

        renderHook(() => useRoomSocketHandlers());

        const errorData = { error: 'Room is full' };
        failCallback(errorData);
        expect(mockDispatch).toHaveBeenCalledWith(joinRoomFailed(errorData));

        const updateData = { roomState: 'started' };
        updateCallback(updateData);
        expect(mockDispatch).toHaveBeenCalledWith(updateGameData(updateData));

        const launchData = { roomName: 'room1' };
        launchCallback(launchData);
        expect(mockDispatch).toHaveBeenCalledWith(roomLaunchSuccess(launchData));
    });
});