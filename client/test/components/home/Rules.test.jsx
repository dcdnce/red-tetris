import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Rules } from '../../../src/components/home/Rules.jsx';

describe('Rules component', () => {
    it('should render the rules heading', () => {
        render(<Rules />);
        const heading = screen.getByText('rules');
        expect(heading).toBeInTheDocument();
    });

    it('should display the specific list of rules', () => {
        render(<Rules />);
        
        expect(screen.getByText('Use arrow keys to move and rotate tetriminos')).toBeInTheDocument();
        expect(screen.getByText('Complete horizontal lines to clear them and earn points')).toBeInTheDocument();
        expect(screen.getByText('The game ends when blocks reach the top')).toBeInTheDocument();
        expect(screen.getByText('In multiplayer, cleared lines add penalty rows to opponents')).toBeInTheDocument();
        expect(screen.getByText('The last player standing wins')).toBeInTheDocument();
    });
});