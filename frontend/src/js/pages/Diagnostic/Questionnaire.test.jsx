import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import DiagnosticQuestionnaire from '@/pages/Diagnostic/Questionnaire';

vi.mock('@/contexts/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('@/services/api', () => ({
    evenementService: { getAll: vi.fn() },
    diagnosticService: {
        create: vi.fn(),
        delete: vi.fn(),
    },
    diagnosticConfigService: { getAll: vi.fn() },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

import { useAuth } from '@/contexts/AuthContext';
import { evenementService, diagnosticConfigService } from '@/services/api';

const MOCK_EVENEMENTS = [
    { id: 1, type_evenement: 'Décès du conjoint', points: 100 },
    { id: 2, type_evenement: 'Divorce', points: 73 },
    { id: 3, type_evenement: 'Maladie', points: 53 },
];

const MOCK_CONFIG = {
    config: {
        faible: { message: 'Niveau faible.' },
        modere: { message: 'Niveau modéré.' },
        eleve:  { message: 'Niveau élevé.' },
    },
};

const setupMocks = (isAuthenticated = false) => {
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated });
    vi.mocked(evenementService.getAll).mockResolvedValue({ data: { evenements: MOCK_EVENEMENTS } });
    vi.mocked(diagnosticConfigService.getAll).mockResolvedValue({ data: MOCK_CONFIG });
};

describe('Page DiagnosticQuestionnaire', () => {
    beforeEach(() => vi.clearAllMocks());

    it('affiche un spinner pendant le chargement', () => {
        setupMocks();
        render(<MemoryRouter><DiagnosticQuestionnaire /></MemoryRouter>);
        expect(screen.getByText(/chargement/i)).toBeInTheDocument();
    });

    it('affiche les événements après chargement', async () => {
        setupMocks();
        render(<MemoryRouter><DiagnosticQuestionnaire /></MemoryRouter>);

        await waitFor(() => {
            expect(screen.getByText('Décès du conjoint')).toBeInTheDocument();
            expect(screen.getByText('Divorce')).toBeInTheDocument();
        });
    });

    it('affiche un avertissement mode visiteur si non connecté', async () => {
        setupMocks(false);
        render(<MemoryRouter><DiagnosticQuestionnaire /></MemoryRouter>);

        await waitFor(() => {
            expect(screen.getByText(/mode visiteur/i)).toBeInTheDocument();
        });
    });

    it('n\'affiche pas l\'avertissement visiteur si connecté', async () => {
        setupMocks(true);
        render(<MemoryRouter><DiagnosticQuestionnaire /></MemoryRouter>);

        await waitFor(() => {
            expect(screen.queryByText(/mode visiteur/i)).not.toBeInTheDocument();
        });
    });

    it('le score augmente quand on coche un événement', async () => {
        const user = userEvent.setup();
        setupMocks();
        render(<MemoryRouter><DiagnosticQuestionnaire /></MemoryRouter>);

        await waitFor(() => screen.getByText('Décès du conjoint'));

        const checkbox = screen.getAllByRole('checkbox')[0];
        await user.click(checkbox);

        expect(screen.getAllByText(/100/).length).toBeGreaterThan(0);
    });

    it('le bouton calculer est désactivé si aucun événement sélectionné', async () => {
        setupMocks();
        render(<MemoryRouter><DiagnosticQuestionnaire /></MemoryRouter>);

        await waitFor(() => screen.getByText('Décès du conjoint'));

        const btn = screen.getByRole('button', { name: /sélectionnez au moins/i });
        expect(btn).toBeDisabled();
    });

    it('affiche les résultats après calcul', async () => {
        const user = userEvent.setup();
        setupMocks();
        render(<MemoryRouter><DiagnosticQuestionnaire /></MemoryRouter>);

        await waitFor(() => screen.getByText('Décès du conjoint'));

        await user.click(screen.getAllByRole('checkbox')[0]);

        const btn = screen.getByRole('button', { name: /calculer mon score/i });
        await user.click(btn);

        await waitFor(() => {
            expect(screen.getByText(/niveau de stress/i)).toBeInTheDocument();
        });
    });

    it('affiche une erreur si le chargement échoue', async () => {
        vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false });
        vi.mocked(evenementService.getAll).mockRejectedValue(new Error('Network error'));
        vi.mocked(diagnosticConfigService.getAll).mockRejectedValue(new Error('Network error'));

        render(<MemoryRouter><DiagnosticQuestionnaire /></MemoryRouter>);

        await waitFor(() => {
            expect(screen.getByText(/impossible de charger/i)).toBeInTheDocument();
        });
    });
});
