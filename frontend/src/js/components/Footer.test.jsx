import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from '@/components/Footer';

describe('Footer', () => {
    it('affiche l\'année en cours', () => {
        render(<MemoryRouter><Footer /></MemoryRouter>);
        expect(screen.getByText(new RegExp(new Date().getFullYear().toString()))).toBeInTheDocument();
    });

    it('affiche le lien vers la politique de confidentialité', () => {
        render(<MemoryRouter><Footer /></MemoryRouter>);
        const link = screen.getByRole('link', { name: /politique de confidentialité/i });
        expect(link).toBeInTheDocument();
        expect(link.getAttribute('href')).toBe('/privacy');
    });

    it('affiche le nom CesiZen', () => {
        render(<MemoryRouter><Footer /></MemoryRouter>);
        expect(screen.getByText(/CesiZen/)).toBeInTheDocument();
    });
});
