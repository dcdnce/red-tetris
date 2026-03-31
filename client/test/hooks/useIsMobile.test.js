import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '../../src/hooks/useIsMobile.js';
import * as chakra from '@chakra-ui/react';

vi.mock('@chakra-ui/react', () => ({
    useBreakpointValue: vi.fn(),
}));

describe('useIsMobile', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock default window height
        Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 800 });
    });

    it('should return true if small width', () => {
        chakra.useBreakpointValue.mockReturnValue(true);
        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(true);
    });

    it('should return true if small height (< 700)', () => {
        chakra.useBreakpointValue.mockReturnValue(false);
        Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 600 });
        
        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(true);
    });

    it('should return false if large width and height', () => {
        chakra.useBreakpointValue.mockReturnValue(false);
        Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 800 });
        
        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(false);
    });

    it('should listen to resize event and update', () => {
        chakra.useBreakpointValue.mockReturnValue(false);
        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(false);

        act(() => {
            Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 500 });
            window.dispatchEvent(new Event('resize'));
        });

        expect(result.current).toBe(true);
    });
});