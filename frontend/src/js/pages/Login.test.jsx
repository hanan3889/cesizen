import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from '@/pages/Login';

vi.mock('@/components/app-logo', () => ({ default: () => <div data-testid="app-logo" /> }));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('@/contexts/AuthContext', () => ({ useAuth: vi.fn() }));
import { useAuth } from '@/contexts/AuthContext';

const renderLogin = (loginFn = vi.fn()) => {
    vi.mocked(useAuth).mockReturnValue({ login: loginFn });
    return render(<MemoryRouter><Login /></MemoryRouter>);
};

describe('Page Login', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockNavigate.mockClear();
    });

    it('affiche le formulaire de connexion', () => {
        renderLogin();
        expect(screen.getByPlaceholderText(/votre@email\.com/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
    });

    it('affiche le lien vers la page d\'inscription', () => {
        renderLogin();
        expect(screen.getByRole('link', { name: /inscrivez-vous/i })).toBeInTheDocument();
    });

    it('affiche une erreur si la connexion échoue', async () => {
        const user = userEvent.setup();
        const mockLogin = vi.fn().mockResolvedValue({ success: false, error: 'Identifiants incorrects.' });
        renderLogin(mockLogin);

        await user.type(screen.getByPlaceholderText(/votre@email\.com/i), 'test@test.fr');
        await user.type(screen.getByPlaceholderText(/••••••••/i), 'motdepasse');
        await user.click(screen.getByRole('button', { name: /se connecter/i }));

        await waitFor(() => {
            expect(screen.getByText(/identifiants incorrects/i)).toBeInTheDocument();
        });
    });

    it('redirige vers /dashboard pour un utilisateur standard', async () => {
        const user = userEvent.setup();
        const mockLogin = vi.fn().mockResolvedValue({ success: true, user: { role: 'utilisateur' } });
        renderLogin(mockLogin);

        await user.type(screen.getByPlaceholderText(/votre@email\.com/i), 'user@test.fr');
        await user.type(screen.getByPlaceholderText(/••••••••/i), 'motdepasse');
        await user.click(screen.getByRole('button', { name: /se connecter/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('redirige vers /admin/dashboard pour un administrateur', async () => {
        const user = userEvent.setup();
        const mockLogin = vi.fn().mockResolvedValue({ success: true, user: { role: 'administrateur' } });
        renderLogin(mockLogin);

        await user.type(screen.getByPlaceholderText(/votre@email\.com/i), 'admin@test.fr');
        await user.type(screen.getByPlaceholderText(/••••••••/i), 'motdepasse');
        await user.click(screen.getByRole('button', { name: /se connecter/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard');
        });
    });
});
