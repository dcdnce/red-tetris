import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useOpponentConnectionToast } from '../../../src/hooks/play/usePlayToast.js';
import { showToast } from '../../../src/components/utils/Toast.jsx';

vi.mock('../../../src/components/utils/Toast.jsx', () => ({
    showToast: vi.fn()
}));

describe('useOpponentConnectionToast hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should show toast when opponent connects', () => {
        const opponents = [{ username: 'sacha', isConnected: true }];
        renderHook(() => useOpponentConnectionToast(opponents));

        expect(showToast).toHaveBeenCalledWith('', 'sacha is connected 🟢', 'info', { duration: 3000 });
    });

    it('should show toast when opponent disconnects (not in array anymore)', () => {
        // First render: connect
        const { rerender } = renderHook(({ opps }) => useOpponentConnectionToast(opps), {
            initialProps: { opps: [{ username: 'sacha', isConnected: true }] }
        });
        
        expect(showToast).toHaveBeenCalledWith('', 'sacha is connected 🟢', 'info', { duration: 3000 });
        vi.clearAllMocks();

        // Second render: disconnect (empty array)
        rerender({ opps: [] });

        expect(showToast).toHaveBeenCalledWith('', 'sacha is disconnected 🔴', 'info', { duration: 3000 });
    });
});