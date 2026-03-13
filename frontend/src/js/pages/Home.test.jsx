import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Home from '@/pages/Home';

vi.mock('axios');
vi.mock('@/components/Navbar', () => ({ default: () => null }));
vi.mock('@/contexts/AuthContext', () => ({ useAuth: vi.fn() }));
import { useAuth } from '@/contexts/AuthContext';

const renderHome = (isAuthenticated = false) => {
    vi.mocked(useAuth).mockReturnValue({
        isAuthenticated,
        user: isAuthenticated ? { name: 'Jean' } : null,
    });
    vi.mocked(axios.get).mockResolvedValue({ data: { data: [] } });
    return render(<MemoryRouter><Home /></MemoryRouter>);
};

describe('Page Home', () => {
    beforeEach(() => vi.clearAllMocks());

    it('affiche le titre CesiZen', async () => {
        renderHome();
        await waitFor(() => {
            expect(screen.getAllByText(/CesiZen/i).length).toBeGreaterThan(0);
        });
    });

    it('affiche le lien vers le diagnostic', async () => {
        renderHome();
        await waitFor(() => {
            expect(screen.getByRole('link', { name: /commencer/i })).toBeInTheDocument();
        });
    });

    it('affiche les boutons Connexion et Inscription pour un visiteur', async () => {
        renderHome(false);
        await waitFor(() => {
            expect(screen.getByRole('link', { name: /commencer/i })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /en savoir plus/i })).toBeInTheDocument();
        });
    });

    it('affiche les boutons Mon tableau de bord et Faire un test pour un connecté', async () => {
        renderHome(true);
        await waitFor(() => {
            expect(screen.getByRole('link', { name: /faire un test de stress/i })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /mon tableau de bord/i })).toBeInTheDocument();
        });
    });

    it('appelle l\'API pour charger les pages', async () => {
        renderHome();
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith('/api/v1/pages');
        });
    });

    it('affiche les articles récupérés depuis l\'API', async () => {
        vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false, user: null });
        vi.mocked(axios.get).mockResolvedValue({
            data: {
                data: [
                    { id: 1, titre: 'Article RGPD', slug: 'rgpd', statut: 'publie', description: 'Test description suffisamment longue pour le substring', categorie: { categorie: 'RGPD' }, updated_at: '2024-01-01' },
                    { id: 2, titre: 'Gestion du stress', slug: 'stress', statut: 'publie', description: 'Test description suffisamment longue pour le substring', categorie: { categorie: 'Bien-être' }, updated_at: '2024-01-01' },
                ],
            },
        });
        render(<MemoryRouter><Home /></MemoryRouter>);

        await waitFor(() => {
            expect(screen.getByText('Article RGPD')).toBeInTheDocument();
            expect(screen.getByText('Gestion du stress')).toBeInTheDocument();
        });
    });
});
