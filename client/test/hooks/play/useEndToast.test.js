import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEndToast } from '../../../src/hooks/play/useEndToast.js';
import { useSelector } from 'react-redux';
import { showToast } from '../../../src/components/utils/Toast.jsx';
import { kFinishedState, kStartedState } from '../../../src/services/constants.js';

vi.mock('react-redux', () => ({
    useSelector: vi.fn()
}));

vi.mock('../../../src/components/utils/Toast.jsx', () => ({
    showToast: vi.fn()
}));

describe('useEndToast hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should show toast if room state is finished', () => {
        useSelector.mockReturnValue(kFinishedState);
        renderHook(() => useEndToast('room1'));

        expect(showToast).toHaveBeenCalledWith('', 'Game over.', 'info', { duration: 10000 });
    });

    it('should not show toast if room state is not finished', () => {
        useSelector.mockReturnValue(kStartedState);
        renderHook(() => useEndToast('room1'));

        expect(showToast).not.toHaveBeenCalled();
    });
});