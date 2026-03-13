import { render, screen, waitFor, act } from '@testing-library/react';
import { useAuth, AuthProvider } from '@/contexts/AuthContext';
import { authService } from '@/services/api';

vi.mock('@/services/api', () => ({
    authService: {
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        me: vi.fn(),
    },
}));

// Composant helper pour exposer le contexte
const TestConsumer = () => {
    const auth = useAuth();
    return (
        <div>
            <span data-testid="authenticated">{String(auth.isAuthenticated)}</span>
            <span data-testid="user-name">{auth.user?.name ?? 'aucun'}</span>
            <span data-testid="is-admin">{String(auth.isAdmin())}</span>
            <button onClick={() => auth.login('test@test.fr', 'mdp')}>Login</button>
            <button onClick={() => auth.register('Jean', 'j@j.fr', 'mdp12345', 'mdp12345')}>Register</button>
            <button onClick={() => auth.logout()}>Logout</button>
        </div>
    );
};

const renderWithProvider = () =>
    render(<AuthProvider><TestConsumer /></AuthProvider>);

describe('AuthContext', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
        delete window.location;
        window.location = { assign: vi.fn(), href: '' };
    });

    it('est non authentifié par défaut', () => {
        renderWithProvider();
        expect(screen.getByTestId('authenticated').textContent).toBe('false');
        expect(screen.getByTestId('user-name').textContent).toBe('aucun');
    });

    it('charge l\'utilisateur depuis localStorage au démarrage', () => {
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('user', JSON.stringify({ name: 'Jean', role: 'utilisateur' }));
        renderWithProvider();
        expect(screen.getByTestId('authenticated').textContent).toBe('true');
        expect(screen.getByTestId('user-name').textContent).toBe('Jean');
    });

    it('isAdmin() retourne false pour un utilisateur standard', () => {
        localStorage.setItem('token', 'tok');
        localStorage.setItem('user', JSON.stringify({ name: 'Jean', role: 'utilisateur' }));
        renderWithProvider();
        expect(screen.getByTestId('is-admin').textContent).toBe('false');
    });

    it('isAdmin() retourne true pour un administrateur', () => {
        localStorage.setItem('token', 'tok');
        localStorage.setItem('user', JSON.stringify({ name: 'Admin', role: 'administrateur' }));
        renderWithProvider();
        expect(screen.getByTestId('is-admin').textContent).toBe('true');
    });

    it('login() succès met à jour l\'état et le localStorage', async () => {
        const mockUser = { name: 'Jean', role: 'utilisateur' };
        vi.mocked(authService.login).mockResolvedValue({ data: { user: mockUser, token: 'tok123' } });

        renderWithProvider();
        await act(async () => {
            screen.getByRole('button', { name: 'Login' }).click();
        });

        await waitFor(() => {
            expect(screen.getByTestId('authenticated').textContent).toBe('true');
            expect(localStorage.getItem('token')).toBe('tok123');
        });
    });

    it('login() échec retourne une erreur', async () => {
        vi.mocked(authService.login).mockRejectedValue({
            response: { data: { message: 'Identifiants incorrects.' } },
        });

        renderWithProvider();
        // La fonction login retourne {success: false, error: ...} sans modifier l'état
        await act(async () => {
            screen.getByRole('button', { name: 'Login' }).click();
        });

        await waitFor(() => {
            expect(screen.getByTestId('authenticated').textContent).toBe('false');
        });
    });

    it('logout() vide localStorage et l\'état utilisateur', async () => {
        localStorage.setItem('token', 'tok');
        localStorage.setItem('user', JSON.stringify({ name: 'Jean', role: 'utilisateur' }));
        vi.mocked(authService.logout).mockResolvedValue({});

        renderWithProvider();

        await act(async () => {
            screen.getByRole('button', { name: 'Logout' }).click();
        });

        await waitFor(() => {
            expect(localStorage.getItem('token')).toBeNull();
            expect(localStorage.getItem('user')).toBeNull();
        });
    });

    it('useAuth() lève une erreur si utilisé hors du Provider', () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const Broken = () => { useAuth(); return null; };
        expect(() => render(<Broken />)).toThrow();
        errorSpy.mockRestore();
    });
});
