import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// On importe l'instance api et les services
import api, {
    authService,
    diagnosticService,
    evenementService,
    diagnosticConfigService,
    categorieService,
    userService,
} from '@/services/api';

const mockAxios = new MockAdapter(api);

describe('Services API', () => {
    beforeEach(() => {
        mockAxios.reset();
        localStorage.clear();
    });

    afterAll(() => mockAxios.restore());

    describe('Intercepteur de requête', () => {
        it('ajoute le header Authorization si un token est présent', async () => {
            localStorage.setItem('token', 'mon-token-test');
            mockAxios.onGet('/me').reply(200, { user: {} });

            await api.get('/me');

            const lastRequest = mockAxios.history.get[0];
            expect(lastRequest.headers['Authorization']).toBe('Bearer mon-token-test');
        });

        it('n\'ajoute pas le header Authorization si aucun token', async () => {
            mockAxios.onGet('/me').reply(200, {});

            await api.get('/me');

            const lastRequest = mockAxios.history.get[0];
            expect(lastRequest.headers['Authorization']).toBeUndefined();
        });
    });

    describe('authService', () => {
        it('login envoie POST /login avec les credentials', async () => {
            mockAxios.onPost('/login').reply(200, { user: {}, token: 'tok' });
            await authService.login({ email: 'a@b.fr', password: 'mdp' });
            expect(mockAxios.history.post[0].url).toBe('/login');
        });

        it('register envoie POST /register', async () => {
            mockAxios.onPost('/register').reply(201, {});
            await authService.register({ name: 'Jean', email: 'j@j.fr', password: 'mdp', password_confirmation: 'mdp' });
            expect(mockAxios.history.post[0].url).toBe('/register');
        });

        it('exportData envoie GET /me/export', async () => {
            mockAxios.onGet('/me/export').reply(200, { profil: {}, diagnostics: [] });
            const res = await authService.exportData();
            expect(res.data).toHaveProperty('diagnostics');
        });

        it('deleteAccount envoie DELETE /me', async () => {
            mockAxios.onDelete('/me').reply(200, { message: 'Compte supprimé.' });
            await authService.deleteAccount({ password: 'mdp' });
            expect(mockAxios.history.delete[0].url).toBe('/me');
        });
    });

    describe('diagnosticService', () => {
        it('getAll envoie GET /diagnostics', async () => {
            mockAxios.onGet(/\/diagnostics/).reply(200, { data: [] });
            await diagnosticService.getAll();
            expect(mockAxios.history.get[0].url).toContain('/diagnostics');
        });

        it('create envoie POST /diagnostics', async () => {
            mockAxios.onPost('/diagnostics').reply(201, { diagnostic: {} });
            await diagnosticService.create({ evenements: [1, 2] });
            expect(mockAxios.history.post[0].url).toBe('/diagnostics');
        });

        it('delete envoie DELETE /diagnostics/{id}', async () => {
            mockAxios.onDelete('/diagnostics/5').reply(200, {});
            await diagnosticService.delete(5);
            expect(mockAxios.history.delete[0].url).toBe('/diagnostics/5');
        });
    });

    describe('evenementService', () => {
        it('getAll envoie GET /evenements', async () => {
            mockAxios.onGet(/\/evenements/).reply(200, { evenements: [] });
            await evenementService.getAll();
            expect(mockAxios.history.get[0].url).toContain('/evenements');
        });

        it('create envoie POST /evenements', async () => {
            mockAxios.onPost('/evenements').reply(201, { evenement: {} });
            await evenementService.create({ type_evenement: 'Test', points: 50 });
            expect(mockAxios.history.post[0].url).toBe('/evenements');
        });

        it('update envoie PUT /evenements/{id}', async () => {
            mockAxios.onPut('/evenements/3').reply(200, {});
            await evenementService.update(3, { type_evenement: 'Modifié', points: 60 });
            expect(mockAxios.history.put[0].url).toBe('/evenements/3');
        });

        it('delete envoie DELETE /evenements/{id}', async () => {
            mockAxios.onDelete('/evenements/3').reply(200, {});
            await evenementService.delete(3);
            expect(mockAxios.history.delete[0].url).toBe('/evenements/3');
        });
    });

    describe('diagnosticConfigService', () => {
        it('getAll envoie GET /diagnostic-config', async () => {
            mockAxios.onGet('/diagnostic-config').reply(200, { config: {} });
            await diagnosticConfigService.getAll();
            expect(mockAxios.history.get[0].url).toBe('/diagnostic-config');
        });

        it('update envoie PUT /diagnostic-config/{niveau}', async () => {
            mockAxios.onPut('/diagnostic-config/faible').reply(200, {});
            await diagnosticConfigService.update('faible', { message: 'Test', seuil_min: 0, seuil_max: 150 });
            expect(mockAxios.history.put[0].url).toBe('/diagnostic-config/faible');
        });

        it('delete envoie DELETE /diagnostic-config/{niveau}', async () => {
            mockAxios.onDelete('/diagnostic-config/eleve').reply(200, {});
            await diagnosticConfigService.delete('eleve');
            expect(mockAxios.history.delete[0].url).toBe('/diagnostic-config/eleve');
        });
    });

    describe('categorieService', () => {
        it('getAll envoie GET /categories', async () => {
            mockAxios.onGet('/categories').reply(200, []);
            await categorieService.getAll();
            expect(mockAxios.history.get[0].url).toBe('/categories');
        });
    });

    describe('userService', () => {
        it('getAll envoie GET /users', async () => {
            mockAxios.onGet(/\/users/).reply(200, { data: [] });
            await userService.getAll();
            expect(mockAxios.history.get[0].url).toContain('/users');
        });

        it('delete envoie DELETE /users/{id}', async () => {
            mockAxios.onDelete('/users/2').reply(200, {});
            await userService.delete(2);
            expect(mockAxios.history.delete[0].url).toBe('/users/2');
        });
    });
});
