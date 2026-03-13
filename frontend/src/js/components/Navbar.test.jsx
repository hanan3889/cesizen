import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '@/components/Navbar';

vi.mock('@/components/app-logo', () => ({ default: () => <div data-testid="app-logo" /> }));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('@/contexts/AuthContext', () => ({ useAuth: vi.fn() }));
import { useAuth } from '@/contexts/AuthContext';

const renderNavbar = (overrides = {}) => {
    vi.mocked(useAuth).mockReturnValue({
        user: null,
        isAuthenticated: false,
        isAdmin: vi.fn(() => false),
        logout: vi.fn(),
        ...overrides,
    });
    return render(<MemoryRouter><Navbar /></MemoryRouter>);
};

describe('Navbar', () => {
    beforeEach(() => vi.clearAllMocks());

    it('affiche le logo', () => {
        renderNavbar();
        expect(screen.getByTestId('app-logo')).toBeInTheDocument();
    });

    it('affiche les liens Connexion et Créer un compte pour un visiteur', () => {
        renderNavbar();
        expect(screen.getByRole('link', { name: /connexion/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /crée un compte/i })).toBeInTheDocument();
    });

    it('affiche le nom de l\'utilisateur connecté', () => {
        renderNavbar({
            user: { name: 'Jean Dupont', role: 'utilisateur' },
            isAuthenticated: true,
        });
        expect(screen.getByText(/Jean Dupont/i)).toBeInTheDocument();
    });

    it('affiche le lien "Mon espace" pour un utilisateur standard', () => {
        renderNavbar({
            user: { name: 'Jean', role: 'utilisateur' },
            isAuthenticated: true,
            isAdmin: vi.fn(() => false),
        });
        expect(screen.getByRole('link', { name: /mon espace/i })).toBeInTheDocument();
    });

    it('affiche le lien "Administration" pour un administrateur', () => {
        renderNavbar({
            user: { name: 'Admin', role: 'administrateur' },
            isAuthenticated: true,
            isAdmin: vi.fn(() => true),
        });
        expect(screen.getByRole('link', { name: /administration/i })).toBeInTheDocument();
    });

    it('appelle logout au clic sur Déconnexion', async () => {
        const mockLogout = vi.fn();
        const user = userEvent.setup();
        renderNavbar({
            user: { name: 'Jean', role: 'utilisateur' },
            isAuthenticated: true,
            logout: mockLogout,
        });

        await user.click(screen.getByRole('button', { name: /déconnexion/i }));
        expect(mockLogout).toHaveBeenCalledOnce();
    });
});
