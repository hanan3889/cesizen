import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock axios pour que axios.create() retourne un objet valide avec interceptors
vi.mock('axios', () => {
    const mockInstance = {
        interceptors: {
            request: { use: vi.fn() },
            response: { use: vi.fn() },
        },
        get:    vi.fn(),
        post:   vi.fn(),
        put:    vi.fn(),
        delete: vi.fn(),
        patch:  vi.fn(),
    };
    return { default: { create: vi.fn(() => mockInstance) } };
});

vi.mock('@/components/Navbar', () => ({ default: () => null }));
vi.mock('@/contexts/AuthContext', () => ({ useAuth: vi.fn() }));

import Home from '@/pages/Home';
import { useAuth } from '@/contexts/AuthContext';
import { pageService } from '@/services/api';

const renderHome = (isAuthenticated = false) => {
    vi.mocked(useAuth).mockReturnValue({
        isAuthenticated,
        user: isAuthenticated ? { name: 'Jean' } : null,
    });
    vi.spyOn(pageService, 'getAll').mockResolvedValue({ data: { data: [] } });
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

    it('affiche les boutons Commencer et En savoir plus pour un visiteur', async () => {
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

    it("appelle pageService.getAll avec statut publie pour charger les pages", async () => {
        renderHome();
        await waitFor(() => {
            expect(pageService.getAll).toHaveBeenCalledWith({ statut: 'publie' });
        });
    });

    it("affiche les articles récupérés depuis l'API", async () => {
        vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false, user: null });
        vi.spyOn(pageService, 'getAll').mockResolvedValue({
            data: {
                data: [
                    {
                        id: 1, titre: 'Article RGPD', slug: 'rgpd', statut: 'publie',
                        description: 'Test description suffisamment longue pour le substring',
                        categorie: { categorie: 'RGPD' }, updated_at: '2024-01-01',
                    },
                    {
                        id: 2, titre: 'Gestion du stress', slug: 'stress', statut: 'publie',
                        description: 'Test description suffisamment longue pour le substring',
                        categorie: { categorie: 'Bien-être' }, updated_at: '2024-01-01',
                    },
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
