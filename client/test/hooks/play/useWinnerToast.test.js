import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useWinnerToast } from '../../../src/hooks/play/useWinnerToast.js';
import { useSelector } from 'react-redux';
import { showToast } from '../../../src/components/utils/Toast.jsx';

vi.mock('react-redux', () => ({
    useSelector: vi.fn()
}));

vi.mock('../../../src/components/utils/Toast.jsx', () => ({
    showToast: vi.fn()
}));

describe('useWinnerToast hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should show toast if missing username is provided out of bounds', () => {
        useSelector.mockReturnValue('sacha');
        renderHook(() => useWinnerToast('room1'));

        expect(showToast).toHaveBeenCalledWith('', 'sacha won.', 'success', { duration: 10000 });
    });

    it('should not show toast if there is no winner username yet', () => {
        useSelector.mockReturnValue(null);
        renderHook(() => useWinnerToast('room1'));

        expect(showToast).not.toHaveBeenCalled();
    });
});