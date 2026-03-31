import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Keys } from '../../../../../src/components/play/board/layout/Keys.jsx';

describe('Keys component', () => {
    it('renders the tooltip badge', () => {
        render(<Keys />);

        const badge = screen.getByText('?');
        expect(badge).toBeInTheDocument();
    });
});
