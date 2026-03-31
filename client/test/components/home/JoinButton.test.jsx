import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import JoinButton from '../../../src/components/home/JoinButton.jsx';
import * as ToastModule from '../../../src/components/utils/Toast.jsx';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../src/components/utils/Toast.jsx', () => ({
    showToast: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('JoinButton component', () => {
    beforeEach(() => {
        vi.stubGlobal('localStorage', {
            setItem: vi.fn(),
            getItem: vi.fn(() => 'Alice')
        });
    });

    it('shows error if username is empty', () => {
        render(
            <MemoryRouter>
                <JoinButton />
            </MemoryRouter>
        );

        const playButton = screen.getByText('PLAY');
        
        // No username typed, click PLAY
        fireEvent.click(playButton);

        expect(ToastModule.showToast).toHaveBeenCalledWith("Error", "Enter an username please", "error");
    });

    it('shows error if room name is empty', () => {
        render(
            <MemoryRouter>
                <JoinButton />
            </MemoryRouter>
        );

        const usernameInput = screen.getByPlaceholderText('Type your username');
        fireEvent.change(usernameInput, { target: { value: 'Alice' } });

        const playButton = screen.getByText('PLAY');
        
        // No room name typed, click PLAY
        fireEvent.click(playButton);

        expect(ToastModule.showToast).toHaveBeenCalledWith("Erreur", "Please enter a room name", "error");
    });

    it('navigates to the room on successful join', () => {
        render(
            <MemoryRouter>
                <JoinButton />
            </MemoryRouter>
        );

        const usernameInput = screen.getByPlaceholderText('Type your username');
        fireEvent.change(usernameInput, { target: { value: 'Alice' } });

        const roomInput = screen.getByPlaceholderText('Room');
        fireEvent.change(roomInput, { target: { value: 'Lobby' } });

        const playButton = screen.getByText('PLAY');
        fireEvent.click(playButton);

        expect(localStorage.setItem).toHaveBeenCalledWith('username', 'Alice');
        expect(mockNavigate).toHaveBeenCalledWith('/Lobby/Alice');
    });
});
