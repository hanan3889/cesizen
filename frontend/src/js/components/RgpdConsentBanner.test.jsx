import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RgpdConsentBanner from '@/components/RgpdConsentBanner';

const CONSENT_KEY = 'cesizen_rgpd_consent';

describe('RgpdConsentBanner', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('affiche la bannière si aucun consentement stocké', () => {
        render(<MemoryRouter><RgpdConsentBanner /></MemoryRouter>);
        expect(screen.getByText(/vos données et votre vie privée/i)).toBeInTheDocument();
    });

    it('n\'affiche pas la bannière si consentement déjà accepté', () => {
        localStorage.setItem(CONSENT_KEY, 'accepted');
        render(<MemoryRouter><RgpdConsentBanner /></MemoryRouter>);
        expect(screen.queryByText(/vos données et votre vie privée/i)).not.toBeInTheDocument();
    });

    it('n\'affiche pas la bannière si consentement déjà refusé', () => {
        localStorage.setItem(CONSENT_KEY, 'refused');
        render(<MemoryRouter><RgpdConsentBanner /></MemoryRouter>);
        expect(screen.queryByText(/vos données et votre vie privée/i)).not.toBeInTheDocument();
    });

    it('masque la bannière et enregistre "accepted" au clic sur Accepter', async () => {
        const user = userEvent.setup();
        render(<MemoryRouter><RgpdConsentBanner /></MemoryRouter>);

        await user.click(screen.getByRole('button', { name: /accepter/i }));

        expect(localStorage.getItem(CONSENT_KEY)).toBe('accepted');
        expect(screen.queryByText(/vos données et votre vie privée/i)).not.toBeInTheDocument();
    });

    it('masque la bannière et enregistre "refused" au clic sur Refuser', async () => {
        const user = userEvent.setup();
        render(<MemoryRouter><RgpdConsentBanner /></MemoryRouter>);

        await user.click(screen.getByRole('button', { name: /refuser/i }));

        expect(localStorage.getItem(CONSENT_KEY)).toBe('refused');
        expect(screen.queryByText(/vos données et votre vie privée/i)).not.toBeInTheDocument();
    });

    it('contient un lien vers la politique de confidentialité', () => {
        render(<MemoryRouter><RgpdConsentBanner /></MemoryRouter>);
        const link = screen.getByRole('link', { name: /politique de confidentialité/i });
        expect(link.getAttribute('href')).toBe('/privacy');
    });
});
