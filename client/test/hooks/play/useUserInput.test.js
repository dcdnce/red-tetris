import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useUserInput } from '../../../src/hooks/play/useUserInput.js';
import { socket } from '../../../src/socket.js';
import { useDispatch } from 'react-redux';
import { kStartedState, kPendingState } from '../../../src/services/constants.js';

vi.mock('../../../src/socket.js', () => ({
    socket: {
        emit: vi.fn()
    }
}));

vi.mock('react-redux', () => ({
    useDispatch: vi.fn()
}));

const mockDispatch = vi.fn();

describe('useUserInput hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubGlobal('localStorage', { getItem: vi.fn(() => 'mocked-token') });
        useDispatch.mockReturnValue(mockDispatch);
    });

    it('should add event listener on mount, and remove on unmount', () => {
        const addSpy = vi.spyOn(window, 'addEventListener');
        const removeSpy = vi.spyOn(window, 'removeEventListener');

        const { unmount } = renderHook(() => useUserInput('room1', 'sacha', kStartedState));

        expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
        
        unmount();
        
        expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
        
        addSpy.mockRestore();
        removeSpy.mockRestore();
    });

    it('should emit user_input on valid keydown if game is started', () => {
        renderHook(() => useUserInput('room1', 'sacha', kStartedState));

        // Simulate key press
        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        window.dispatchEvent(event);

        expect(socket.emit).toHaveBeenCalledWith('user_input', {
            roomName: 'room1',
            username: 'sacha',
            token: 'mocked-token',
            key: 'ArrowLeft'
        });
    });

    it('should NOT emit user_input if game is not started', () => {
        renderHook(() => useUserInput('room1', 'sacha', kPendingState));

        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        window.dispatchEvent(event);

        expect(socket.emit).not.toHaveBeenCalled();
    });

    it('should dispatch hardDropEffect on spacebar', () => {
        renderHook(() => useUserInput('room1', 'sacha', kStartedState));

        const event = new KeyboardEvent('keydown', { key: ' ' });
        window.dispatchEvent(event);

        expect(mockDispatch).toHaveBeenCalled();
        expect(socket.emit).toHaveBeenCalledWith('user_input', {
            roomName: 'room1',
            username: 'sacha',
            token: 'mocked-token',
            key: ' '
        });
    });
});
