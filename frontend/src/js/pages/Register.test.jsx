import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Register from '@/pages/Register';

vi.mock('@/components/app-logo', () => ({ default: () => <div data-testid="app-logo" /> }));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('@/contexts/AuthContext', () => ({ useAuth: vi.fn() }));
import { useAuth } from '@/contexts/AuthContext';

const renderRegister = (registerFn = vi.fn()) => {
    vi.mocked(useAuth).mockReturnValue({ register: registerFn });
    return render(<MemoryRouter><Register /></MemoryRouter>);
};

const fillForm = async (user, overrides = {}) => {
    const fields = {
        name: 'Jean Dupont',
        email: 'jean@test.fr',
        password: 'motdepasse123',
        confirm: 'motdepasse123',
        ...overrides,
    };
    await user.type(screen.getByPlaceholderText(/jean dupont/i), fields.name);
    await user.type(screen.getByPlaceholderText(/votre@email\.com/i), fields.email);
    const passwords = screen.getAllByPlaceholderText(/••••••••/i);
    await user.type(passwords[0], fields.password);
    await user.type(passwords[1], fields.confirm);
};

describe('Page Register', () => {
    beforeEach(() => vi.clearAllMocks());

    it('affiche tous les champs du formulaire', () => {
        renderRegister();
        expect(screen.getByPlaceholderText(/jean dupont/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/votre@email\.com/i)).toBeInTheDocument();
        expect(screen.getAllByPlaceholderText(/••••••••/i)).toHaveLength(2);
        expect(screen.getByLabelText(/politique de confidentialité/i)).toBeInTheDocument();
    });

    it('affiche une erreur si le consentement RGPD n\'est pas coché', async () => {
        const user = userEvent.setup();
        renderRegister();

        await fillForm(user);
        await user.click(screen.getByRole('button', { name: /créer mon compte/i }));

        await waitFor(() => {
            expect(screen.getByText(/politique de confidentialité/i, { selector: 'div' })).toBeInTheDocument();
        });
    });

    it('affiche une erreur si les mots de passe ne correspondent pas', async () => {
        const user = userEvent.setup();
        renderRegister();

        await fillForm(user, { confirm: 'autremotdepasse' });
        await user.click(screen.getByRole('button', { name: /créer mon compte/i }));

        await waitFor(() => {
            expect(screen.getByText(/mots de passe ne correspondent pas/i)).toBeInTheDocument();
        });
    });

    it('affiche une erreur si le mot de passe est trop court', async () => {
        const user = userEvent.setup();
        renderRegister();

        await fillForm(user, { password: 'court', confirm: 'court' });
        await user.click(screen.getByRole('button', { name: /créer mon compte/i }));

        await waitFor(() => {
            expect(screen.getByText(/au moins 8 caractères/i)).toBeInTheDocument();
        });
    });

    it('redirige vers /dashboard après inscription réussie', async () => {
        const user = userEvent.setup();
        const mockRegister = vi.fn().mockResolvedValue({ success: true });
        renderRegister(mockRegister);

        await fillForm(user);
        await user.click(screen.getByLabelText(/politique de confidentialité/i));
        await user.click(screen.getByRole('button', { name: /créer mon compte/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });
});
