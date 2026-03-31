import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Header from '../../../src/components/home/Header.jsx';

const mockedNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockedNavigate,
    };
});

describe('Header component', () => {
    it('should render the .redtetris button', () => {
        render(
            <MemoryRouter>
                <Header isHome={true} />
            </MemoryRouter>
        );

        const button = screen.getByRole('button', { name: /\.redtetris/i });
        expect(button).toBeInTheDocument();
    });

    it('should navigate to home when clicked', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <Header isHome={false} />
            </MemoryRouter>
        );

        const button = screen.getByRole('button', { name: /\.redtetris/i });
        await user.click(button);

        expect(mockedNavigate).toHaveBeenCalledWith('/');
    });
});