import { FileText, KeyRound, LogOut, Plus, Settings, Tag, Trash2, Users, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import AppLogo from '@/components/app-logo';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/api';

/* ─────────────────────────────────────────
   Utilitaires
───────────────────────────────────────── */
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
    });
};

/* ─────────────────────────────────────────
   Modale de confirmation générique
───────────────────────────────────────── */
const ConfirmModal = ({ open, title, message, confirmLabel, confirmClass, onConfirm, onCancel }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${confirmClass}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────
   Modale — Créer un utilisateur
───────────────────────────────────────── */
const EMPTY_FORM = { name: '', email: '', password: '', password_confirmation: '', role: 'utilisateur' };

const CreateUserModal = ({ open, loading, onSubmit, onClose }) => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});

    // Réinitialise le formulaire à chaque ouverture
    useEffect(() => {
        if (open) { setForm(EMPTY_FORM); setErrors({}); }
    }, [open]);

    if (!open) return null;

    const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

    const validate = () => {
        const e = {};
        if (!form.name.trim())            e.name = 'Le nom est requis.';
        if (!form.email.trim())           e.email = "L'email est requis.";
        if (form.password.length < 8)     e.password = 'Minimum 8 caractères.';
        if (form.password !== form.password_confirmation)
                                          e.password_confirmation = 'Les mots de passe ne correspondent pas.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) onSubmit(form);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">Ajouter un utilisateur</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {/* Nom */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={set('name')}
                            placeholder="Jean Dupont"
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-cesizen-green focus:border-transparent outline-none ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={set('email')}
                            placeholder="jean@exemple.fr"
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-cesizen-green focus:border-transparent outline-none ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                    </div>

                    {/* Rôle */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                        <select
                            value={form.role}
                            onChange={set('role')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cesizen-green focus:border-transparent outline-none"
                        >
                            <option value="utilisateur">Utilisateur</option>
                            <option value="administrateur">Administrateur</option>
                        </select>
                    </div>

                    {/* Mot de passe */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={set('password')}
                            placeholder="Minimum 8 caractères"
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-cesizen-green focus:border-transparent outline-none ${errors.password ? 'border-red-400' : 'border-gray-300'}`}
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                    </div>

                    {/* Confirmation */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                        <input
                            type="password"
                            value={form.password_confirmation}
                            onChange={set('password_confirmation')}
                            placeholder="Répétez le mot de passe"
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-cesizen-green focus:border-transparent outline-none ${errors.password_confirmation ? 'border-red-400' : 'border-gray-300'}`}
                        />
                        {errors.password_confirmation && <p className="mt-1 text-xs text-red-600">{errors.password_confirmation}</p>}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-cesizen-green hover:bg-cesizen-green-dark rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Création...' : 'Créer l\'utilisateur'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────
   Panneau — Utilisateurs
───────────────────────────────────────── */
const UsersPanel = () => {
    const [users, setUsers] = useState({ data: [], links: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
    const [resetModal, setResetModal] = useState({ open: false, user: null });
    const [createModal, setCreateModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const showFeedback = (type, message) => {
        setFeedback({ type, message });
        setTimeout(() => setFeedback(null), 5000);
    };

    const fetchUsers = async (url) => {
        setLoading(true);
        try {
            const page = url ? new URL(url).searchParams.get('page') : '1';
            const response = await userService.getAll({ page });
            // response.data = { data: <paginator> }
            // paginator = { data: [...users], links: [...], ... }
            setUsers(response.data.data);
        } catch (err) {
            setError('Impossible de charger les utilisateurs.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleDelete = async () => {
        if (!deleteModal.user) return;
        setActionLoading(true);
        try {
            await userService.delete(deleteModal.user.id);
            showFeedback('success', `"${deleteModal.user.name}" a été supprimé.`);
            setDeleteModal({ open: false, user: null });
            fetchUsers();
        } catch {
            showFeedback('error', 'Impossible de supprimer cet utilisateur.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCreate = async (formData) => {
        setActionLoading(true);
        try {
            await userService.create(formData);
            showFeedback('success', `L'utilisateur "${formData.name}" a été créé avec succès.`);
            setCreateModal(false);
            fetchUsers();
        } catch (err) {
            const msg = err.response?.data?.message || 'Impossible de créer l\'utilisateur.';
            showFeedback('error', msg);
        } finally {
            setActionLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!resetModal.user) return;
        setActionLoading(true);
        try {
            await userService.resetPassword(resetModal.user.id);
            showFeedback('success', `Email de réinitialisation envoyé à ${resetModal.user.email}.`);
            setResetModal({ open: false, user: null });
        } catch (err) {
            const msg = err.response?.data?.message ?? "Impossible d'envoyer l'email de réinitialisation.";
            showFeedback('error', msg);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Gestion des Utilisateurs</h2>
                <button
                    onClick={() => setCreateModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-cesizen-green hover:bg-cesizen-green-dark rounded-lg transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Ajouter un utilisateur
                </button>
            </div>

            {/* Feedback */}
            {feedback && (
                <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium border ${
                    feedback.type === 'success'
                        ? 'bg-green-50 text-green-800 border-green-200'
                        : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                    {feedback.message}
                </div>
            )}

            {/* Contenu */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cesizen-green" />
                </div>
            ) : error ? (
                <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
            ) : users.data.length === 0 ? (
                <p className="text-center text-gray-500 py-20">Aucun utilisateur trouvé.</p>
            ) : (
                <>
                    <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['Nom', 'Email', 'Rôle', 'Inscrit le', 'Actions'].map((h) => (
                                        <th
                                            key={h}
                                            className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${h === 'Actions' ? 'text-right' : 'text-left'}`}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${
                                                user.role === 'administrateur'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-sky-100 text-sky-800'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.created_at)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setResetModal({ open: true, user })}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors"
                                                >
                                                    <KeyRound className="h-3.5 w-3.5" />
                                                    Réinit. MDP
                                                </button>
                                                <button
                                                    onClick={() => setDeleteModal({ open: true, user })}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    Supprimer
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.links?.length > 3 && (
                        <div className="mt-4 flex justify-end">
                            <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                                {users.links.map((link, i) => (
                                    <button
                                        key={i}
                                        onClick={() => link.url && fetchUsers(link.url)}
                                        disabled={!link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium ${
                                            link.active
                                                ? 'z-10 bg-cesizen-green border-cesizen-green text-white'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40'
                                        } ${i === 0 ? 'rounded-l-md' : ''} ${i === users.links.length - 1 ? 'rounded-r-md' : ''}`}
                                    />
                                ))}
                            </nav>
                        </div>
                    )}
                </>
            )}

            {/* Modales */}
            <ConfirmModal
                open={deleteModal.open}
                title="Supprimer l'utilisateur"
                message={`Êtes-vous sûr de vouloir supprimer "${deleteModal.user?.name}" (${deleteModal.user?.email}) ? Cette action est irréversible.`}
                confirmLabel={actionLoading ? 'Suppression...' : 'Supprimer'}
                confirmClass="bg-red-600 hover:bg-red-700"
                onConfirm={handleDelete}
                onCancel={() => setDeleteModal({ open: false, user: null })}
            />
            <ConfirmModal
                open={resetModal.open}
                title="Réinitialiser le mot de passe"
                message={`Un email de réinitialisation sera envoyé à "${resetModal.user?.email}". L'utilisateur devra choisir un nouveau mot de passe via le lien reçu.`}
                confirmLabel={actionLoading ? 'Envoi...' : "Envoyer l'email"}
                confirmClass="bg-amber-500 hover:bg-amber-600"
                onConfirm={handleResetPassword}
                onCancel={() => setResetModal({ open: false, user: null })}
            />

            {/* Modale création utilisateur */}
            <CreateUserModal
                open={createModal}
                loading={actionLoading}
                onSubmit={handleCreate}
                onClose={() => setCreateModal(false)}
            />
        </div>
    );
};

/* ─────────────────────────────────────────
   Panneau — Informations (placeholder)
───────────────────────────────────────── */
const InfoPanel = () => (
    <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Pages d'Information</h2>
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">Gestion des pages — bientôt disponible</p>
        </div>
    </div>
);

/* ─────────────────────────────────────────
   Panneau — Catégories (placeholder)
───────────────────────────────────────── */
const CategoriesPanel = () => (
    <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Catégories</h2>
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400">
            <Tag className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">Gestion des catégories — bientôt disponible</p>
        </div>
    </div>
);

/* ─────────────────────────────────────────
   Panneau — Paramètres (placeholder)
───────────────────────────────────────── */
const SettingsPanel = () => (
    <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Paramètres</h2>
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400">
            <Settings className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">Paramètres de l'application — bientôt disponible</p>
        </div>
    </div>
);

/* ─────────────────────────────────────────
   Sidebar
───────────────────────────────────────── */
const navItems = [
    { key: 'users',       label: 'Utilisateurs', icon: Users },
    { key: 'informations',label: 'Informations',  icon: FileText },
    { key: 'categories',  label: 'Catégories',    icon: Tag },
    { key: 'settings',    label: 'Paramètres',    icon: Settings },
];

const Sidebar = ({ active, onChange, user, onLogout }) => (
    <aside className="w-64 flex-shrink-0 bg-cesizen-green-dark flex flex-col min-h-screen">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center px-4 border-b border-cesizen-green/40">
            <div className="flex items-center gap-3">
                <AppLogo />
                <span className="text-white text-xl font-bold">Admin</span>
            </div>
        </div>

        {/* Infos admin */}
        <div className="px-4 py-4 border-b border-cesizen-green/20">
            <p className="text-green-100 text-xs uppercase tracking-wider mb-1">Connecté en tant que</p>
            <p className="text-white font-semibold truncate">{user?.name}</p>
            <p className="text-green-200 text-xs truncate">{user?.email}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1">
            {navItems.map(({ key, label, icon: Icon }) => (
                <button
                    key={key}
                    onClick={() => onChange(key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                        active === key
                            ? 'bg-white/20 text-white shadow-sm'
                            : 'text-green-100 hover:bg-white/10 hover:text-white'
                    }`}
                >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {label}
                    {active === key && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                </button>
            ))}
        </nav>

        {/* Déconnexion */}
        <div className="px-3 py-4 border-t border-cesizen-green/20">
            <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-green-200 hover:bg-red-500/20 hover:text-red-200 transition-colors"
            >
                <LogOut className="h-5 w-5" />
                Déconnexion
            </button>
        </div>
    </aside>
);

/* ─────────────────────────────────────────
   Page principale — Admin Dashboard
───────────────────────────────────────── */
const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [activeSection, setActiveSection] = useState('users');

    useEffect(() => {
        document.title = 'Tableau de bord Admin — CesiZen';
    }, []);

    const renderPanel = () => {
        switch (activeSection) {
            case 'users':        return <UsersPanel />;
            case 'informations': return <InfoPanel />;
            case 'categories':   return <CategoriesPanel />;
            case 'settings':     return <SettingsPanel />;
            default:             return <UsersPanel />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Sidebar
                active={activeSection}
                onChange={setActiveSection}
                user={user}
                onLogout={logout}
            />
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {renderPanel()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
