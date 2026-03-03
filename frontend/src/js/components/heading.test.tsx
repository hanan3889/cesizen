import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Heading from './heading';

describe('Heading Component', () => {
    it('should render the title correctly', () => {
        const titleText = 'Test Title';
        render(<Heading title={titleText} />);

        const headingElement = screen.getByRole('heading', { level: 2 });

        expect(headingElement).toBeInTheDocument();
        expect(headingElement).toHaveTextContent(titleText);
    });

    it('should not render the description if it is not provided', () => {
        const titleText = 'Test Title';
        render(<Heading title={titleText} />);

        const descriptionElement = screen.queryByText(/.+/); // Query for any text
        // The title is text, so we need to be more specific
        const titleElement = screen.queryByText(titleText);
        expect(titleElement).toBeInTheDocument();

        // A more robust way to check if ONLY the title is there
        const container = render(<Heading title={titleText} />).container;
        expect(container.querySelector('p')).toBeNull();
    });

    it('should render both the title and the description when provided', () => {
        const titleText = 'Test Title';
        const descriptionText = 'This is a test description.';
        render(<Heading title={titleText} description={descriptionText} />);

        const headingElement = screen.getByRole('heading', { level: 2 });
        const descriptionElement = screen.getByText(descriptionText);

        expect(headingElement).toBeInTheDocument();
        expect(headingElement).toHaveTextContent(titleText);
        expect(descriptionElement).toBeInTheDocument();
        expect(descriptionElement.tagName).toBe('P');
    });
});
