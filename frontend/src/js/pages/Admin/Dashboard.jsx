import { Eye, EyeOff, FileText, KeyRound, LogOut, Pencil, Plus, Settings, Tag, Trash2, Users, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import AppLogo from '@/components/app-logo';
import { useAuth } from '../../contexts/AuthContext';
import { authService, categorieService, pageService, userService } from '../../services/api';
import '../../../css/admin.css';

/* ─────────────────────────────────────────
   Utilitaires
───────────────────────────────────────── */
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const inputCls  = (err) => `admin-input${err ? ' admin-input--error' : ''}`;
const textaCls  = (err) => `admin-textarea${err ? ' admin-textarea--error' : ''}`;

/* ─────────────────────────────────────────
   Composants partagés
───────────────────────────────────────── */
const Feedback = ({ feedback }) => {
    if (!feedback) return null;
    return (
        <div className={`admin-feedback admin-feedback--${feedback.type}`}>
            {feedback.message}
        </div>
    );
};

const Spinner = () => (
    <div className="admin-spinner-wrap">
        <div className="admin-spinner" />
    </div>
);

const PaginationNav = ({ links, onNavigate }) => {
    if (!links || links.length <= 3) return null;
    return (
        <div className="admin-pagination">
            <nav className="admin-pagination-nav">
                {links.map((link, i) => (
                    <button
                        key={i}
                        onClick={() => link.url && onNavigate(link.url)}
                        disabled={!link.url}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        className={[
                            'admin-page-btn',
                            link.active ? 'admin-page-btn--active' : 'admin-page-btn--idle',
                            i === 0 ? 'admin-page-btn--first' : '',
                            i === links.length - 1 ? 'admin-page-btn--last' : '',
                        ].join(' ')}
                    />
                ))}
            </nav>
        </div>
    );
};

const Field = ({ label, error, children }) => (
    <div>
        <label className="admin-field-label">{label}</label>
        {children}
        {error && <p className="admin-field-error">{error}</p>}
    </div>
);

const StatutBadge = ({ statut }) => {
    const labels = { publie: 'Publié', brouillon: 'Brouillon', archive: 'Archivé' };
    return (
        <span className={`admin-badge admin-badge--${statut ?? 'brouillon'}`}>
            {labels[statut] ?? statut}
        </span>
    );
};

/* ─────────────────────────────────────────
   Modale de confirmation générique
───────────────────────────────────────── */
const ConfirmModal = ({ open, title, message, confirmLabel, confirmVariant = 'danger', onConfirm, onCancel }) => {
    if (!open) return null;
    return (
        <div className="admin-modal-overlay--plain">
            <div className="admin-confirm-box">
                <h3 className="admin-confirm-title">{title}</h3>
                <p className="admin-confirm-message">{message}</p>
                <div className="admin-confirm-actions">
                    <button onClick={onCancel} className="admin-confirm-btn-cancel">Annuler</button>
                    <button onClick={onConfirm} className={`admin-confirm-btn--${confirmVariant}`}>{confirmLabel}</button>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────
   Modale — Créer un utilisateur
───────────────────────────────────────── */
const EMPTY_USER = { name: '', email: '', password: '', password_confirmation: '', role: 'utilisateur' };

const CreateUserModal = ({ open, loading, onSubmit, onClose }) => {
    const [form, setForm] = useState(EMPTY_USER);
    const [errors, setErrors] = useState({});

    useEffect(() => { if (open) { setForm(EMPTY_USER); setErrors({}); } }, [open]);

    if (!open) return null;

    const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

    const validate = () => {
        const e = {};
        if (!form.name.trim())           e.name = 'Le nom est requis.';
        if (!form.email.trim())          e.email = "L'email est requis.";
        if (form.password.length < 8)    e.password = 'Minimum 8 caractères.';
        if (form.password !== form.password_confirmation)
                                         e.password_confirmation = 'Les mots de passe ne correspondent pas.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e) => { e.preventDefault(); if (validate()) onSubmit(form); };

    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal">
                <div className="admin-modal-header">
                    <h3 className="admin-modal-title">Ajouter un utilisateur</h3>
                    <button onClick={onClose} className="admin-modal-close"><X className="h-5 w-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="admin-modal-body">
                    <Field label="Nom complet" error={errors.name}>
                        <input type="text" value={form.name} onChange={set('name')} placeholder="Jean Dupont" className={inputCls(errors.name)} />
                    </Field>
                    <Field label="Adresse email" error={errors.email}>
                        <input type="email" value={form.email} onChange={set('email')} placeholder="jean@exemple.fr" className={inputCls(errors.email)} />
                    </Field>
                    <Field label="Rôle">
                        <select value={form.role} onChange={set('role')} className="admin-input">
                            <option value="utilisateur">Utilisateur</option>
                            <option value="administrateur">Administrateur</option>
                        </select>
                    </Field>
                    <Field label="Mot de passe" error={errors.password}>
                        <input type="password" value={form.password} onChange={set('password')} placeholder="Minimum 8 caractères" className={inputCls(errors.password)} />
                    </Field>
                    <Field label="Confirmer le mot de passe" error={errors.password_confirmation}>
                        <input type="password" value={form.password_confirmation} onChange={set('password_confirmation')} placeholder="Répétez le mot de passe" className={inputCls(errors.password_confirmation)} />
                    </Field>
                    <div className="admin-modal-footer">
                        <button type="button" onClick={onClose} className="admin-modal-btn-cancel">Annuler</button>
                        <button type="submit" disabled={loading} className="admin-modal-btn-submit">
                            {loading ? 'Création...' : "Créer l'utilisateur"}
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

    const showFeedback = (type, message) => { setFeedback({ type, message }); setTimeout(() => setFeedback(null), 5000); };

    const fetchUsers = async (url) => {
        setLoading(true);
        try {
            const page = url ? new URL(url).searchParams.get('page') : '1';
            const res = await userService.getAll({ page });
            setUsers(res.data.data);
        } catch {
            setError('Impossible de charger les utilisateurs.');
        } finally { setLoading(false); }
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
        } finally { setActionLoading(false); }
    };

    const handleCreate = async (formData) => {
        setActionLoading(true);
        try {
            await userService.create(formData);
            showFeedback('success', `L'utilisateur "${formData.name}" a été créé avec succès.`);
            setCreateModal(false);
            fetchUsers();
        } catch (err) {
            showFeedback('error', err.response?.data?.message || "Impossible de créer l'utilisateur.");
        } finally { setActionLoading(false); }
    };

    const handleResetPassword = async () => {
        if (!resetModal.user) return;
        setActionLoading(true);
        try {
            await userService.resetPassword(resetModal.user.id);
            showFeedback('success', `Email de réinitialisation envoyé à ${resetModal.user.email}.`);
            setResetModal({ open: false, user: null });
        } catch (err) {
            showFeedback('error', err.response?.data?.message ?? "Impossible d'envoyer l'email.");
        } finally { setActionLoading(false); }
    };

    return (
        <div>
            <div className="admin-panel-header">
                <h2 className="admin-panel-title">Gestion des Utilisateurs</h2>
                <button onClick={() => setCreateModal(true)} className="admin-btn-primary">
                    <Plus className="h-4 w-4" /> Ajouter un utilisateur
                </button>
            </div>

            <Feedback feedback={feedback} />

            {loading ? <Spinner /> : error ? (
                <div className="admin-error-banner">{error}</div>
            ) : users.data.length === 0 ? (
                <p className="text-center text-gray-500 py-20">Aucun utilisateur trouvé.</p>
            ) : (
                <>
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead className="admin-thead">
                                <tr>
                                    <th className="admin-th">Nom</th>
                                    <th className="admin-th">Email</th>
                                    <th className="admin-th">Rôle</th>
                                    <th className="admin-th">Inscrit le</th>
                                    <th className="admin-th admin-th--right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="admin-tbody">
                                {users.data.map(user => (
                                    <tr key={user.id} className="admin-tr">
                                        <td className="admin-td--bold">{user.name}</td>
                                        <td className="admin-td">{user.email}</td>
                                        <td className="admin-td">
                                            <span className={`admin-badge admin-badge--${user.role === 'administrateur' ? 'admin' : 'user'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="admin-td">{formatDate(user.created_at)}</td>
                                        <td className="admin-td--right">
                                            <div className="admin-td-actions">
                                                <button onClick={() => setResetModal({ open: true, user })} className="admin-btn-action admin-btn-action--warning">
                                                    <KeyRound className="h-3.5 w-3.5" /> Réinit. MDP
                                                </button>
                                                <button onClick={() => setDeleteModal({ open: true, user })} className="admin-btn-action admin-btn-action--delete">
                                                    <Trash2 className="h-3.5 w-3.5" /> Supprimer
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <PaginationNav links={users.links} onNavigate={fetchUsers} />
                </>
            )}

            <ConfirmModal open={deleteModal.open} title="Supprimer l'utilisateur"
                message={`Êtes-vous sûr de vouloir supprimer "${deleteModal.user?.name}" (${deleteModal.user?.email}) ? Cette action est irréversible.`}
                confirmLabel={actionLoading ? 'Suppression...' : 'Supprimer'} confirmVariant="danger"
                onConfirm={handleDelete} onCancel={() => setDeleteModal({ open: false, user: null })} />
            <ConfirmModal open={resetModal.open} title="Réinitialiser le mot de passe"
                message={`Un email de réinitialisation sera envoyé à "${resetModal.user?.email}".`}
                confirmLabel={actionLoading ? 'Envoi...' : "Envoyer l'email"} confirmVariant="warning"
                onConfirm={handleResetPassword} onCancel={() => setResetModal({ open: false, user: null })} />
            <CreateUserModal open={createModal} loading={actionLoading} onSubmit={handleCreate} onClose={() => setCreateModal(false)} />
        </div>
    );
};

/* ─────────────────────────────────────────
   Modale — Formulaire page
───────────────────────────────────────── */
const EMPTY_PAGE = { titre: '', description: '', categorie_information_id: '', statut: 'brouillon' };

const PageFormModal = ({ open, page, categories, loading, onSubmit, onClose }) => {
    const [form, setForm] = useState(EMPTY_PAGE);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (open) {
            setForm(page ? {
                titre: page.titre,
                description: page.description,
                categorie_information_id: page.categorie_information_id ?? '',
                statut: page.statut,
            } : EMPTY_PAGE);
            setErrors({});
        }
    }, [open, page]);

    if (!open) return null;

    const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

    const validate = () => {
        const e = {};
        if (!form.titre.trim())       e.titre = 'Le titre est requis.';
        if (!form.description.trim()) e.description = 'Le contenu est requis.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e) => { e.preventDefault(); if (validate()) onSubmit(form); };

    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal--lg">
                <div className="admin-modal-header">
                    <h3 className="admin-modal-title">{page ? 'Modifier la page' : 'Nouvelle page'}</h3>
                    <button onClick={onClose} className="admin-modal-close"><X className="h-5 w-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="admin-modal-body--scroll">
                    <Field label="Titre" error={errors.titre}>
                        <input type="text" value={form.titre} onChange={set('titre')} placeholder="Titre de la page" className={inputCls(errors.titre)} />
                    </Field>
                    <div className="admin-form-grid-2">
                        <Field label="Catégorie">
                            <select value={form.categorie_information_id} onChange={set('categorie_information_id')} className="admin-input">
                                <option value="">Sans catégorie</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.categorie}</option>)}
                            </select>
                        </Field>
                        <Field label="Statut">
                            <select value={form.statut} onChange={set('statut')} className="admin-input">
                                <option value="brouillon">Brouillon</option>
                                <option value="publie">Publié</option>
                                <option value="archive">Archivé</option>
                            </select>
                        </Field>
                    </div>
                    <Field label="Contenu" error={errors.description}>
                        <textarea value={form.description} onChange={set('description')} rows={8} placeholder="Contenu de la page..." className={textaCls(errors.description)} />
                    </Field>
                    <div className="admin-modal-footer">
                        <button type="button" onClick={onClose} className="admin-modal-btn-cancel">Annuler</button>
                        <button type="submit" disabled={loading} className="admin-modal-btn-submit">
                            {loading ? 'Enregistrement...' : (page ? 'Mettre à jour' : 'Créer la page')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────
   Panneau — Pages d'Information
───────────────────────────────────────── */
const InfoPanel = () => {
    const [pages, setPages] = useState({ data: [], links: [] });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ open: false, page: null });
    const [formModal, setFormModal] = useState({ open: false, page: null });
    const [actionLoading, setActionLoading] = useState(false);

    const showFeedback = (type, message) => { setFeedback({ type, message }); setTimeout(() => setFeedback(null), 5000); };

    const fetchPages = async (url) => {
        setLoading(true);
        try {
            const page = url ? new URL(url).searchParams.get('page') : '1';
            const res = await pageService.getAll({ page });
            setPages(res.data);
        } catch {
            setError('Impossible de charger les pages.');
        } finally { setLoading(false); }
    };

    useEffect(() => {
        fetchPages();
        categorieService.getAll()
            .then(res => setCategories(res.data?.categories ?? res.data ?? []))
            .catch(() => {});
    }, []);

    const handleDelete = async () => {
        if (!deleteModal.page) return;
        setActionLoading(true);
        try {
            await pageService.delete(deleteModal.page.id);
            showFeedback('success', `"${deleteModal.page.titre}" a été supprimée.`);
            setDeleteModal({ open: false, page: null });
            fetchPages();
        } catch {
            showFeedback('error', 'Impossible de supprimer cette page.');
        } finally { setActionLoading(false); }
    };

    const handleSubmit = async (formData) => {
        setActionLoading(true);
        try {
            if (formModal.page) {
                await pageService.update(formModal.page.id, formData);
                showFeedback('success', 'Page mise à jour avec succès.');
            } else {
                await pageService.create(formData);
                showFeedback('success', 'Page créée avec succès.');
            }
            setFormModal({ open: false, page: null });
            fetchPages();
        } catch (err) {
            showFeedback('error', err.response?.data?.message || "Impossible d'enregistrer la page.");
        } finally { setActionLoading(false); }
    };

    const pageList = Array.isArray(pages?.data) ? pages.data : Array.isArray(pages) ? pages : [];

    return (
        <div>
            <div className="admin-panel-header">
                <h2 className="admin-panel-title">Pages d'Information</h2>
                <button onClick={() => setFormModal({ open: true, page: null })} className="admin-btn-primary">
                    <Plus className="h-4 w-4" /> Nouvelle page
                </button>
            </div>

            <Feedback feedback={feedback} />

            {loading ? <Spinner /> : error ? (
                <div className="admin-error-banner">{error}</div>
            ) : pageList.length === 0 ? (
                <div className="admin-empty">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-40" />
                    <p className="admin-empty-title">Aucune page pour le moment</p>
                    <p className="admin-empty-desc">Cliquez sur "Nouvelle page" pour commencer.</p>
                </div>
            ) : (
                <>
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead className="admin-thead">
                                <tr>
                                    <th className="admin-th">Titre</th>
                                    <th className="admin-th">Catégorie</th>
                                    <th className="admin-th">Statut</th>
                                    <th className="admin-th">Date</th>
                                    <th className="admin-th admin-th--right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="admin-tbody">
                                {pageList.map(p => (
                                    <tr key={p.id} className="admin-tr">
                                        <td className="admin-td--title">
                                            <span className="admin-td-truncate">{p.titre}</span>
                                        </td>
                                        <td className="admin-td">{p.categorie?.categorie ?? '—'}</td>
                                        <td className="admin-td"><StatutBadge statut={p.statut} /></td>
                                        <td className="admin-td">{formatDate(p.created_at)}</td>
                                        <td className="admin-td--right">
                                            <div className="admin-td-actions">
                                                <button onClick={() => setFormModal({ open: true, page: p })} className="admin-btn-action admin-btn-action--edit">
                                                    <Pencil className="h-3.5 w-3.5" /> Modifier
                                                </button>
                                                <button onClick={() => setDeleteModal({ open: true, page: p })} className="admin-btn-action admin-btn-action--delete">
                                                    <Trash2 className="h-3.5 w-3.5" /> Supprimer
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <PaginationNav links={pages?.links} onNavigate={fetchPages} />
                </>
            )}

            <ConfirmModal open={deleteModal.open} title="Supprimer la page"
                message={`Êtes-vous sûr de vouloir supprimer "${deleteModal.page?.titre}" ? Cette action est irréversible.`}
                confirmLabel={actionLoading ? 'Suppression...' : 'Supprimer'} confirmVariant="danger"
                onConfirm={handleDelete} onCancel={() => setDeleteModal({ open: false, page: null })} />
            <PageFormModal open={formModal.open} page={formModal.page} categories={categories}
                loading={actionLoading} onSubmit={handleSubmit} onClose={() => setFormModal({ open: false, page: null })} />
        </div>
    );
};

/* ─────────────────────────────────────────
   Modale — Formulaire catégorie
───────────────────────────────────────── */
const CategoryFormModal = ({ open, category, loading, onSubmit, onClose }) => {
    const [nom, setNom] = useState('');
    const [error, setError] = useState('');

    useEffect(() => { if (open) { setNom(category?.categorie ?? ''); setError(''); } }, [open, category]);

    if (!open) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nom.trim()) { setError('Le nom est requis.'); return; }
        onSubmit({ categorie: nom.trim() });
    };

    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal--sm">
                <div className="admin-modal-header">
                    <h3 className="admin-modal-title">{category ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h3>
                    <button onClick={onClose} className="admin-modal-close"><X className="h-5 w-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="admin-modal-body">
                    <Field label="Nom de la catégorie" error={error}>
                        <input type="text" value={nom} onChange={e => setNom(e.target.value)} placeholder="Ex : Bien-être, Gestion du stress..." className={inputCls(error)} autoFocus />
                    </Field>
                    <div className="admin-modal-footer">
                        <button type="button" onClick={onClose} className="admin-modal-btn-cancel">Annuler</button>
                        <button type="submit" disabled={loading} className="admin-modal-btn-submit">
                            {loading ? 'Enregistrement...' : (category ? 'Mettre à jour' : 'Créer')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────
   Panneau — Catégories
───────────────────────────────────────── */
const CategoriesPanel = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ open: false, category: null });
    const [formModal, setFormModal] = useState({ open: false, category: null });
    const [actionLoading, setActionLoading] = useState(false);

    const showFeedback = (type, message) => { setFeedback({ type, message }); setTimeout(() => setFeedback(null), 5000); };

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await categorieService.getAll();
            setCategories(res.data?.categories ?? res.data ?? []);
        } catch {
            setError('Impossible de charger les catégories.');
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleDelete = async () => {
        if (!deleteModal.category) return;
        setActionLoading(true);
        try {
            await categorieService.delete(deleteModal.category.id);
            showFeedback('success', `"${deleteModal.category.categorie}" a été supprimée.`);
            setDeleteModal({ open: false, category: null });
            fetchCategories();
        } catch (err) {
            showFeedback('error', err.response?.data?.message || 'Impossible de supprimer cette catégorie.');
        } finally { setActionLoading(false); }
    };

    const handleSubmit = async (formData) => {
        setActionLoading(true);
        try {
            if (formModal.category) {
                await categorieService.update(formModal.category.id, formData);
                showFeedback('success', 'Catégorie mise à jour.');
            } else {
                await categorieService.create(formData);
                showFeedback('success', 'Catégorie créée.');
            }
            setFormModal({ open: false, category: null });
            fetchCategories();
        } catch (err) {
            showFeedback('error', err.response?.data?.message || "Impossible d'enregistrer la catégorie.");
        } finally { setActionLoading(false); }
    };

    return (
        <div>
            <div className="admin-panel-header">
                <h2 className="admin-panel-title">Catégories</h2>
                <button onClick={() => setFormModal({ open: true, category: null })} className="admin-btn-primary">
                    <Plus className="h-4 w-4" /> Nouvelle catégorie
                </button>
            </div>

            <Feedback feedback={feedback} />

            {loading ? <Spinner /> : error ? (
                <div className="admin-error-banner">{error}</div>
            ) : categories.length === 0 ? (
                <div className="admin-empty">
                    <Tag className="h-12 w-12 mx-auto mb-4 opacity-40" />
                    <p className="admin-empty-title">Aucune catégorie pour le moment</p>
                    <p className="admin-empty-desc">Cliquez sur "Nouvelle catégorie" pour commencer.</p>
                </div>
            ) : (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead className="admin-thead">
                            <tr>
                                <th className="admin-th">Nom</th>
                                <th className="admin-th">Pages totales</th>
                                <th className="admin-th">Pages publiées</th>
                                <th className="admin-th admin-th--right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="admin-tbody">
                            {categories.map(cat => (
                                <tr key={cat.id} className="admin-tr">
                                    <td className="admin-td--bold">{cat.categorie}</td>
                                    <td className="admin-td">{cat.nombre_pages ?? '—'}</td>
                                    <td className="admin-td">{cat.nombre_pages_publiees ?? '—'}</td>
                                    <td className="admin-td--right">
                                        <div className="admin-td-actions">
                                            <button onClick={() => setFormModal({ open: true, category: cat })} className="admin-btn-action admin-btn-action--edit">
                                                <Pencil className="h-3.5 w-3.5" /> Modifier
                                            </button>
                                            <button onClick={() => setDeleteModal({ open: true, category: cat })} className="admin-btn-action admin-btn-action--delete">
                                                <Trash2 className="h-3.5 w-3.5" /> Supprimer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ConfirmModal open={deleteModal.open} title="Supprimer la catégorie"
                message={`Êtes-vous sûr de vouloir supprimer "${deleteModal.category?.categorie}" ? Impossible si des pages y sont associées.`}
                confirmLabel={actionLoading ? 'Suppression...' : 'Supprimer'} confirmVariant="danger"
                onConfirm={handleDelete} onCancel={() => setDeleteModal({ open: false, category: null })} />
            <CategoryFormModal open={formModal.open} category={formModal.category}
                loading={actionLoading} onSubmit={handleSubmit} onClose={() => setFormModal({ open: false, category: null })} />
        </div>
    );
};

/* ─────────────────────────────────────────
   Panneau — Paramètres
───────────────────────────────────────── */
const SettingsPanel = ({ user }) => {
    const [form, setForm] = useState({ current_password: '', password: '', password_confirmation: '' });
    const [errors, setErrors] = useState({});
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState({ current: false, new: false, confirm: false });

    const showFeedback = (type, message) => {
        setFeedback({ type, message });
        setTimeout(() => setFeedback(null), 6000);
    };

    const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
    const toggleShow = (field) => setShow(s => ({ ...s, [field]: !s[field] }));

    const validate = () => {
        const e = {};
        if (!form.current_password)   e.current_password = 'Le mot de passe actuel est requis.';
        if (form.password.length < 8) e.password = 'Minimum 8 caractères.';
        if (form.password !== form.password_confirmation) e.password_confirmation = 'Les mots de passe ne correspondent pas.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await authService.changePassword(form);
            showFeedback('success', 'Mot de passe modifié avec succès.');
            setForm({ current_password: '', password: '', password_confirmation: '' });
            setErrors({});
        } catch (err) {
            const apiErrors = err.response?.data?.errors;
            if (apiErrors?.current_password) {
                setErrors({ current_password: apiErrors.current_password[0] });
            } else {
                showFeedback('error', err.response?.data?.message || 'Impossible de modifier le mot de passe.');
            }
        } finally { setLoading(false); }
    };

    const inputCls = (err) => `admin-input${err ? ' admin-input--error' : ''}`;

    return (
        <div>
            <div className="admin-panel-header">
                <h2 className="admin-panel-title">Paramètres du compte</h2>
            </div>

            {/* Carte profil */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-cesizen-green flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                </div>
                <div>
                    <p className="font-semibold text-gray-900 text-lg">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">Administrateur</span>
                </div>
            </div>

            {/* Formulaire mot de passe */}
            <div className="bg-white rounded-xl shadow-sm p-6 max-w-md">
                <h3 className="text-base font-semibold text-gray-800 mb-5">Changer le mot de passe</h3>

                {feedback && (
                    <div className={`admin-feedback admin-feedback--${feedback.type}`}>{feedback.message}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Field label="Mot de passe actuel" error={errors.current_password}>
                        <div className="relative">
                            <input
                                type={show.current ? 'text' : 'password'}
                                value={form.current_password}
                                onChange={set('current_password')}
                                placeholder="Votre mot de passe actuel"
                                className={inputCls(errors.current_password)}
                            />
                            <button type="button" onClick={() => toggleShow('current')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {show.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </Field>

                    <Field label="Nouveau mot de passe" error={errors.password}>
                        <div className="relative">
                            <input
                                type={show.new ? 'text' : 'password'}
                                value={form.password}
                                onChange={set('password')}
                                placeholder="Minimum 8 caractères"
                                className={inputCls(errors.password)}
                            />
                            <button type="button" onClick={() => toggleShow('new')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {show.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </Field>

                    <Field label="Confirmer le nouveau mot de passe" error={errors.password_confirmation}>
                        <div className="relative">
                            <input
                                type={show.confirm ? 'text' : 'password'}
                                value={form.password_confirmation}
                                onChange={set('password_confirmation')}
                                placeholder="Répétez le nouveau mot de passe"
                                className={inputCls(errors.password_confirmation)}
                            />
                            <button type="button" onClick={() => toggleShow('confirm')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {show.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </Field>

                    <div className="pt-2">
                        <button type="submit" disabled={loading} className="admin-btn-primary">
                            {loading ? 'Modification...' : 'Modifier le mot de passe'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────
   Sidebar
───────────────────────────────────────── */
const navItems = [
    { key: 'users',        label: 'Utilisateurs', icon: Users },
    { key: 'informations', label: 'Informations',  icon: FileText },
    { key: 'categories',   label: 'Catégories',    icon: Tag },
    { key: 'settings',     label: 'Paramètres',    icon: Settings },
];

const Sidebar = ({ active, onChange, user, onLogout }) => (
    <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
            <div className="admin-sidebar-logo-inner">
                <AppLogo />
                <span className="admin-sidebar-logo-text">Admin</span>
            </div>
        </div>
        <div className="admin-sidebar-user">
            <p className="admin-sidebar-user-label">Connecté en tant que</p>
            <p className="admin-sidebar-user-name">{user?.name}</p>
            <p className="admin-sidebar-user-email">{user?.email}</p>
        </div>
        <nav className="admin-sidebar-nav">
            {navItems.map(({ key, label, icon: Icon }) => (
                <button key={key} onClick={() => onChange(key)}
                    className={`admin-nav-item ${active === key ? 'admin-nav-item--active' : 'admin-nav-item--idle'}`}
                >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {label}
                    {active === key && <span className="admin-nav-dot" />}
                </button>
            ))}
        </nav>
        <div className="admin-sidebar-footer">
            <button onClick={onLogout} className="admin-logout-btn">
                <LogOut className="h-5 w-5" /> Déconnexion
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

    useEffect(() => { document.title = 'Tableau de bord Admin — CesiZen'; }, []);

    const renderPanel = () => {
        switch (activeSection) {
            case 'users':        return <UsersPanel />;
            case 'informations': return <InfoPanel />;
            case 'categories':   return <CategoriesPanel />;
            case 'settings':     return <SettingsPanel user={user} />;
            default:             return <UsersPanel />;
        }
    };

    return (
        <div className="admin-layout">
            <Sidebar active={activeSection} onChange={setActiveSection} user={user} onLogout={logout} />
            <main className="admin-main">
                <div className="admin-content">{renderPanel()}</div>
            </main>
        </div>
    );
};

export default AdminDashboard;
