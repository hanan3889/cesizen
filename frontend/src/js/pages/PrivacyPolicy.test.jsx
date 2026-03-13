import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PrivacyPolicy from '@/pages/PrivacyPolicy';

describe('Page Politique de confidentialité', () => {
    it('définit le titre de la page', () => {
        render(<MemoryRouter><PrivacyPolicy /></MemoryRouter>);
        expect(document.title).toMatch(/politique de confidentialité/i);
    });

    it('affiche le titre principal', () => {
        render(<MemoryRouter><PrivacyPolicy /></MemoryRouter>);
        expect(screen.getByRole('heading', { name: /politique de confidentialité/i, level: 1 })).toBeInTheDocument();
    });

    it('affiche les sections RGPD obligatoires', () => {
        render(<MemoryRouter><PrivacyPolicy /></MemoryRouter>);
        expect(screen.getAllByText(/responsable du traitement/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/données collectées/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/vos droits/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/durée de conservation/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/sécurité des données/i).length).toBeGreaterThan(0);
    });

    it('contient un lien de retour à l\'accueil', () => {
        render(<MemoryRouter><PrivacyPolicy /></MemoryRouter>);
        const backLink = screen.getByRole('link', { name: /retour à l'accueil/i });
        expect(backLink.getAttribute('href')).toBe('/');
    });

    it('mentionne la CNIL', () => {
        render(<MemoryRouter><PrivacyPolicy /></MemoryRouter>);
        expect(screen.getAllByText(/CNIL/i).length).toBeGreaterThan(0);
    });

    it('mentionne le RGPD', () => {
        render(<MemoryRouter><PrivacyPolicy /></MemoryRouter>);
        expect(screen.getAllByText(/RGPD/i).length).toBeGreaterThan(0);
    });
});
