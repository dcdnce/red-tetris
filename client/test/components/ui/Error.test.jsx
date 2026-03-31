import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Error } from '../../../src/components/ui/Error.jsx';

describe('Error component', () => {
    it('should render the error title and message correctly', () => {
        const title = 'Test Error 404';
        const message = 'Something went wrong';

        render(<Error errorTitle={title} errorMessage={message} />);

        // Verify title is rendered
        const titleElement = screen.getByText(title);
        expect(titleElement).toBeInTheDocument();

        // Verify message is rendered
        const messageElement = screen.getByText(message);
        expect(messageElement).toBeInTheDocument();
    });
});