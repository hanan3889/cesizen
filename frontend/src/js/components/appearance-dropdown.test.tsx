import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import AppearanceToggleDropdown from './appearance-dropdown';
import { useAppearance } from '@/hooks/use-appearance';

// Mock the useAppearance hook
vi.mock('@/hooks/use-appearance', () => ({
    useAppearance: vi.fn(),
}));

describe('AppearanceToggleDropdown Component', () => {
    it('should render the correct icon for the current theme', () => {
        // Arrange
        (useAppearance as jest.Mock).mockReturnValue({
            appearance: 'dark',
            updateAppearance: vi.fn(),
        });

        // Act
        render(<AppearanceToggleDropdown />);

        // Assert: The trigger button should be in the document
        const triggerButton = screen.getByRole('button', { name: /toggle theme/i });
        expect(triggerButton).toBeInTheDocument();
        // The Moon icon is rendered as an SVG, we can check for its parent
        expect(triggerButton.querySelector('svg')).toBeInTheDocument();
    });

    it('should open the dropdown menu on click', async () => {
        // Arrange
        const user = userEvent.setup();
        (useAppearance as jest.Mock).mockReturnValue({
            appearance: 'system',
            updateAppearance: vi.fn(),
        });
        render(<AppearanceToggleDropdown />);
        const triggerButton = screen.getByRole('button', { name: /toggle theme/i });

        // Act
        await user.click(triggerButton);

        // Assert
        const lightOption = await screen.findByRole('menuitem', { name: /light/i });
        const darkOption = screen.getByRole('menuitem', { name: /dark/i });
        const systemOption = screen.getByRole('menuitem', { name: /system/i });

        expect(lightOption).toBeInTheDocument();
        expect(darkOption).toBeInTheDocument();
        expect(systemOption).toBeInTheDocument();
    });

    it('should call updateAppearance with the correct theme when an option is clicked', async () => {
        // Arrange
        const user = userEvent.setup();
        const mockUpdateAppearance = vi.fn();
        (useAppearance as jest.Mock).mockReturnValue({
            appearance: 'system',
            updateAppearance: mockUpdateAppearance,
        });
        render(<AppearanceToggleDropdown />);
        const triggerButton = screen.getByRole('button', { name: /toggle theme/i });

        // Act
        await user.click(triggerButton);
        const darkOption = await screen.findByRole('menuitem', { name: /dark/i });
        await user.click(darkOption);

        // Assert
        expect(mockUpdateAppearance).toHaveBeenCalledTimes(1);
        expect(mockUpdateAppearance).toHaveBeenCalledWith('dark');
    });
});
