import React, { useState, useEffect, useCallback } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ClipboardList, Settings, LogOut, Plus, Pencil, Trash2, X, Eye, EyeOff, Download, ShieldAlert } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { useAuth } from '../contexts/AuthContext';
import { diagnosticService, authService, evenementService } from '../services/api';
import '../../css/admin.css';

/* ─── Helpers ─────────────────────────────────────────────── */
const NIVEAU_KEY = { Faible: 'faible', Modéré: 'modere', Élevé: 'eleve' };

const formatDate = (d) =>
    new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

/* ─── Composants partagés ─────────────────────────────────── */
const Feedback = ({ feedback }) => {
    if (!feedback) return null;
    return <div className={`admin-feedback admin-feedback--${feedback.type}`}>{feedback.message}</div>;
};

const Spinner = () => (
    <div className="admin-spinner-wrap">
        <div className="admin-spinner" />
    </div>
);

const Field = ({ label, error, children }) => (
    <div>
        <label className="admin-field-label">{label}</label>
        {children}
        {error && <p className="admin-field-error">{error}</p>}
    </div>
);

/* ─── Modale de confirmation ──────────────────────────────── */
const ConfirmModal = ({ open, title, message, onConfirm, onCancel, loading }) => {
    if (!open) return null;
    return (
        <div className="admin-modal-overlay--plain">
            <div className="admin-confirm-box">
                <h3 className="admin-confirm-title">{title}</h3>
                <p className="admin-confirm-message">{message}</p>
                <div className="admin-confirm-actions">
                    <button onClick={onCancel} className="admin-confirm-btn-cancel">Annuler</button>
                    <button onClick={onConfirm} disabled={loading} className="admin-confirm-btn--danger">
                        {loading ? 'Suppression...' : 'Supprimer'}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── Badge niveau de stress ──────────────────────────────── */
const NiveauBadge = ({ niveau }) => {
    const map = {
        Faible:  'admin-badge--publie',
        Modéré:  'admin-badge--brouillon',
        Élevé:   'admin-badge--archive',
    };
    return <span className={`admin-badge ${map[niveau] ?? 'admin-badge--brouillon'}`}>{niveau}</span>;
};

/* ─── Modale édition diagnostic ──────────────────────────── */
const EditDiagnosticModal = ({ open, diagnostic, onSubmit, onClose, loading }) => {
    const [allEvents, setAllEvents] = useState([]);
    const [selected, setSelected] = useState(new Set());
    const [eventsLoading, setEventsLoading] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!open) return;
        setSearch('');
        setSelected(new Set((diagnostic?.evenements ?? []).map(e => e.id)));
        setEventsLoading(true);
        evenementService.getAll()
            .then(res => {
                const data = res.data?.evenements ?? [];
                setAllEvents(data);
            })
            .finally(() => setEventsLoading(false));
    }, [open, diagnostic]);

    if (!open) return null;

    const toggle = (id) => setSelected(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });

    const filtered = allEvents.filter(e =>
        e.type_evenement?.toLowerCase().includes(search.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selected.size === 0) return;
        onSubmit({ evenements: [...selected] });
    };

    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal--lg">
                <div className="admin-modal-header">
                    <h3 className="admin-modal-title">Modifier le diagnostic</h3>
                    <button onClick={onClose} className="admin-modal-close"><X className="h-5 w-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="admin-modal-body--scroll">
                    <p className="text-sm text-gray-500 -mt-2">
                        Sélectionnez les événements vécus —{' '}
                        <span className="font-semibold text-gray-700">{selected.size} sélectionné{selected.size > 1 ? 's' : ''}</span>
                    </p>

                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Rechercher un événement..."
                        className="admin-input"
                    />

                    {eventsLoading ? <Spinner /> : (
                        <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-64 overflow-y-auto">
                            {filtered.map(ev => (
                                <label key={ev.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selected.has(ev.id)}
                                        onChange={() => toggle(ev.id)}
                                        className="w-4 h-4 accent-cesizen-green flex-shrink-0"
                                    />
                                    <span className="text-sm text-gray-700 flex-1">{ev.type_evenement}</span>
                                    <span className="text-xs font-semibold text-gray-400 flex-shrink-0">{ev.points} pts</span>
                                </label>
                            ))}
                            {filtered.length === 0 && (
                                <p className="text-center text-sm text-gray-400 py-6">Aucun événement trouvé.</p>
                            )}
                        </div>
                    )}

                    <div className="admin-modal-footer">
                        <button type="button" onClick={onClose} className="admin-modal-btn-cancel">Annuler</button>
                        <button type="submit" disabled={loading || selected.size === 0} className="admin-modal-btn-submit">
                            {loading ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ─── Panneau — Diagnostics ───────────────────────────────── */
const DiagnosticsPanel = () => {
    const [diagnostics, setDiagnostics] = useState([]);
    const [stats, setStats] = useState(null);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, links: [] });
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ open: false, diag: null });
    const [editModal, setEditModal] = useState({ open: false, diag: null });
    const [actionLoading, setActionLoading] = useState(false);

    const showFeedback = (type, message) => {
        setFeedback({ type, message });
        setTimeout(() => setFeedback(null), 5000);
    };

    const fetchData = useCallback(async (p) => {
        setLoading(true);
        setError(null);
        try {
            const [diagRes, statsRes] = await Promise.all([
                diagnosticService.getAll(p),
                diagnosticService.getStats(),
            ]);
            const d = diagRes.data;
            setDiagnostics(d.data ?? []);
            setMeta({ current_page: d.current_page ?? 1, last_page: d.last_page ?? 1, links: d.links ?? [] });
            setStats(statsRes.data?.statistiques ?? null);
        } catch {
            setError('Impossible de charger les diagnostics.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(page); }, [page]);

    const handleDelete = async () => {
        setActionLoading(true);
        try {
            await diagnosticService.delete(deleteModal.diag.id);
            showFeedback('success', 'Diagnostic supprimé avec succès.');
            setDeleteModal({ open: false, diag: null });
            fetchData(page);
        } catch {
            showFeedback('error', 'Impossible de supprimer ce diagnostic.');
        } finally { setActionLoading(false); }
    };

    const handleEdit = async (formData) => {
        setActionLoading(true);
        try {
            await diagnosticService.update(editModal.diag.id, formData);
            showFeedback('success', 'Diagnostic mis à jour avec succès.');
            setEditModal({ open: false, diag: null });
            fetchData(page);
        } catch (err) {
            showFeedback('error', err.response?.data?.message || 'Impossible de modifier ce diagnostic.');
        } finally { setActionLoading(false); }
    };

    const total = stats?.nombre_total ?? 0;
    const moyen = stats?.score_moyen != null ? Math.round(stats.score_moyen) : null;

    return (
        <div>
            {/* En-tête */}
            <div className="admin-panel-header">
                <h2 className="admin-panel-title">Mes diagnostics</h2>
                <Link to="/diagnostic" className="admin-btn-primary">
                    <Plus className="h-4 w-4" /> Nouveau test
                </Link>
            </div>

            <Feedback feedback={feedback} />

            {/* Statistiques */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total diagnostics', value: total, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Score moyen',        value: moyen ?? '—', color: 'text-yellow-600', bg: 'bg-yellow-50' },
                    { label: 'Score minimum',      value: stats?.score_min ?? '—', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Score maximum',      value: stats?.score_max ?? '—', color: 'text-red-600', bg: 'bg-red-50' },
                ].map(({ label, value, color, bg }) => (
                    <div key={label} className={`${bg} rounded-xl p-4 border border-white/80`}>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
                        <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-cesizen-green-dark to-cesizen-green rounded-xl p-5 mb-6 text-white">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <p className="font-bold">Comment vous sentez-vous aujourd'hui ?</p>
                        <p className="text-green-100 text-sm mt-0.5">Faites un nouveau test pour évaluer votre niveau de stress actuel</p>
                    </div>
                    <Link to="/diagnostic" className="flex-shrink-0 bg-white text-cesizen-green-dark px-5 py-2 rounded-lg font-semibold hover:bg-gray-100 transition text-sm">
                        Faire un test
                    </Link>
                </div>
            </div>

            {/* Tableau */}
            {loading ? <Spinner /> : error ? (
                <div className="admin-error-banner">{error}</div>
            ) : diagnostics.length === 0 ? (
                <div className="admin-empty">
                    <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-40" />
                    <p className="admin-empty-title">Aucun diagnostic pour le moment</p>
                    <p className="admin-empty-desc">Cliquez sur "Nouveau test" pour commencer.</p>
                </div>
            ) : (
                <>
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead className="admin-thead">
                                <tr>
                                    <th className="admin-th">Date</th>
                                    <th className="admin-th">Score</th>
                                    <th className="admin-th">Niveau</th>
                                    <th className="admin-th">Événements</th>
                                    <th className="admin-th admin-th--right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="admin-tbody">
                                {diagnostics.map(diag => (
                                    <tr key={diag.id} className="admin-tr">
                                        <td className="admin-td">{formatDate(diag.date ?? diag.created_at)}</td>
                                        <td className="admin-td--bold">{diag.score} pts</td>
                                        <td className="admin-td"><NiveauBadge niveau={diag.niveau_stress} /></td>
                                        <td className="admin-td">{diag.nombre_evenements} événement{diag.nombre_evenements !== 1 ? 's' : ''}</td>
                                        <td className="admin-td--right">
                                            <div className="admin-td-actions">
                                                <button onClick={() => setEditModal({ open: true, diag })} className="admin-btn-action admin-btn-action--edit">
                                                    <Pencil className="h-3.5 w-3.5" /> Modifier
                                                </button>
                                                <button onClick={() => setDeleteModal({ open: true, diag })} className="admin-btn-action admin-btn-action--delete">
                                                    <Trash2 className="h-3.5 w-3.5" /> Supprimer
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {meta.last_page > 1 && (
                        <div className="admin-pagination">
                            <nav className="admin-pagination-nav">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={meta.current_page === 1}
                                    className="admin-page-btn admin-page-btn--idle admin-page-btn--first"
                                >
                                    ←
                                </button>
                                {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`admin-page-btn ${p === meta.current_page ? 'admin-page-btn--active' : 'admin-page-btn--idle'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                                    disabled={meta.current_page === meta.last_page}
                                    className="admin-page-btn admin-page-btn--idle admin-page-btn--last"
                                >
                                    →
                                </button>
                            </nav>
                        </div>
                    )}
                </>
            )}

            <ConfirmModal
                open={deleteModal.open}
                title="Supprimer le diagnostic"
                message={`Êtes-vous sûr de vouloir supprimer le diagnostic du ${deleteModal.diag ? formatDate(deleteModal.diag.date ?? deleteModal.diag.created_at) : ''} ? Cette action est irréversible.`}
                loading={actionLoading}
                onConfirm={handleDelete}
                onCancel={() => setDeleteModal({ open: false, diag: null })}
            />
            <EditDiagnosticModal
                open={editModal.open}
                diagnostic={editModal.diag}
                loading={actionLoading}
                onSubmit={handleEdit}
                onClose={() => setEditModal({ open: false, diag: null })}
            />
        </div>
    );
};

/* ─── Modale suppression de compte (double confirmation) ─── */
const DeleteAccountModal = ({ open, onClose, onConfirm, loading }) => {
    const [step, setStep] = useState(1);
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open) { setStep(1); setPassword(''); setError(''); setShow(false); }
    }, [open]);

    if (!open) return null;

    const handleConfirm = async () => {
        if (!password.trim()) { setError('Le mot de passe est requis.'); return; }
        setError('');
        const result = await onConfirm(password);
        if (result?.error) setError(result.error);
    };

    return (
        <div className="admin-modal-overlay--plain">
            <div className="admin-confirm-box" style={{ maxWidth: '420px' }}>
                {step === 1 ? (
                    <>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                <ShieldAlert className="h-5 w-5 text-red-600" />
                            </div>
                            <h3 className="admin-confirm-title mb-0">Supprimer mon compte</h3>
                        </div>
                        <p className="admin-confirm-message">
                            Cette action est <strong>irréversible</strong>. Votre compte, votre historique de diagnostics et toutes vos données personnelles seront définitivement supprimés.
                        </p>
                        <div className="admin-confirm-actions">
                            <button onClick={onClose} className="admin-confirm-btn-cancel">Annuler</button>
                            <button onClick={() => setStep(2)} className="admin-confirm-btn--danger">Continuer</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h3 className="admin-confirm-title">Confirmer la suppression</h3>
                        <p className="admin-confirm-message">Entrez votre mot de passe pour confirmer la suppression définitive de votre compte.</p>
                        {error && <p className="text-sm text-red-600 mt-2 mb-1">{error}</p>}
                        <div className="relative mt-3 mb-4">
                            <input
                                type={show ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleConfirm()}
                                placeholder="Votre mot de passe"
                                className="admin-input pr-10"
                                autoFocus
                            />
                            <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        <div className="admin-confirm-actions">
                            <button onClick={onClose} className="admin-confirm-btn-cancel">Annuler</button>
                            <button onClick={handleConfirm} disabled={loading} className="admin-confirm-btn--danger">
                                {loading ? 'Suppression...' : 'Supprimer définitivement'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

/* ─── Panneau — Paramètres ────────────────────────────────── */
const SettingsPanel = ({ user }) => {
    const { logout } = useAuth();
    const [form, setForm] = useState({ current_password: '', password: '', password_confirmation: '' });
    const [errors, setErrors] = useState({});
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
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

    const handleExport = async () => {
        setExporting(true);
        try {
            const res = await authService.exportData();
            const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement('a');
            a.href     = url;
            a.download = `cesizen-donnees-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            showFeedback('error', "Impossible d'exporter les données. Veuillez réessayer.");
        } finally { setExporting(false); }
    };

    const handleDeleteAccount = async (password) => {
        setDeleteLoading(true);
        try {
            await authService.deleteAccount({ password });
            // Nettoyage local puis déconnexion
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.assign('/');
        } catch (err) {
            const msg = err.response?.data?.errors?.password?.[0]
                ?? err.response?.data?.message
                ?? 'Impossible de supprimer le compte.';
            setDeleteLoading(false);
            return { error: msg };
        }
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
                    <span className="inline-block mt-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-sky-100 text-sky-800">Utilisateur</span>
                </div>
            </div>

            <Feedback feedback={feedback} />

            {/* Formulaire mot de passe */}
            <div className="bg-white rounded-xl shadow-sm p-6 max-w-md mb-6">
                <h3 className="text-base font-semibold text-gray-800 mb-5">Changer le mot de passe</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Field label="Mot de passe actuel" error={errors.current_password}>
                        <div className="relative">
                            <input type={show.current ? 'text' : 'password'} value={form.current_password} onChange={set('current_password')} placeholder="Votre mot de passe actuel" className={inputCls(errors.current_password)} />
                            <button type="button" onClick={() => toggleShow('current')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {show.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </Field>
                    <Field label="Nouveau mot de passe" error={errors.password}>
                        <div className="relative">
                            <input type={show.new ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Minimum 8 caractères" className={inputCls(errors.password)} />
                            <button type="button" onClick={() => toggleShow('new')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {show.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </Field>
                    <Field label="Confirmer le nouveau mot de passe" error={errors.password_confirmation}>
                        <div className="relative">
                            <input type={show.confirm ? 'text' : 'password'} value={form.password_confirmation} onChange={set('password_confirmation')} placeholder="Répétez le nouveau mot de passe" className={inputCls(errors.password_confirmation)} />
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

            {/* Données personnelles (RGPD) */}
            <div className="bg-white rounded-xl shadow-sm p-6 max-w-md mb-6">
                <h3 className="text-base font-semibold text-gray-800 mb-1">Mes données personnelles</h3>
                <p className="text-xs text-gray-500 mb-4">
                    Conformément au RGPD, vous pouvez exporter l'ensemble de vos données.{' '}
                    <Link to="/privacy" className="text-cesizen-green hover:underline">Politique de confidentialité →</Link>
                </p>
                <button onClick={handleExport} disabled={exporting} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-cesizen-green border border-cesizen-green rounded-lg hover:bg-green-50 transition disabled:opacity-50">
                    <Download className="h-4 w-4" />
                    {exporting ? 'Export en cours...' : 'Exporter mes données (JSON)'}
                </button>
            </div>

            {/* Zone danger */}
            <div className="bg-white rounded-xl shadow-sm p-6 max-w-md border border-red-100">
                <h3 className="text-base font-semibold text-red-700 mb-1 flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4" /> Zone dangereuse
                </h3>
                <p className="text-xs text-gray-500 mb-4">La suppression de votre compte est définitive et irréversible. Toutes vos données seront perdues.</p>
                <button onClick={() => setDeleteModal(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition">
                    <Trash2 className="h-4 w-4" /> Supprimer mon compte
                </button>
            </div>

            <DeleteAccountModal
                open={deleteModal}
                loading={deleteLoading}
                onConfirm={handleDeleteAccount}
                onClose={() => setDeleteModal(false)}
            />
        </div>
    );
};

/* ─── Sidebar ─────────────────────────────────────────────── */
const navItems = [
    { key: 'diagnostics', label: 'Mes diagnostics', icon: ClipboardList },
    { key: 'settings',    label: 'Paramètres',      icon: Settings },
];

const Sidebar = ({ active, onChange, user, onLogout }) => (
    <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
            <div className="admin-sidebar-logo-inner">
                <AppLogo />
                <span className="admin-sidebar-logo-text">Mon espace</span>
            </div>
        </div>
        <div className="admin-sidebar-user">
            <p className="admin-sidebar-user-label">Connecté en tant que</p>
            <p className="admin-sidebar-user-name">{user?.name}</p>
            <p className="admin-sidebar-user-email">{user?.email}</p>
        </div>
        <nav className="admin-sidebar-nav">
            {navItems.map(({ key, label, icon: Icon }) => (
                <button
                    key={key}
                    onClick={() => onChange(key)}
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

/* ─── Dashboard principal ─────────────────────────────────── */
const Dashboard = () => {
    const { user, isAdmin, logout } = useAuth();
    const [active, setActive] = useState('diagnostics');

    useEffect(() => { document.title = 'Mon espace — CesiZen'; }, []);

    if (isAdmin()) return <Navigate to="/admin/dashboard" replace />;

    return (
        <div className="admin-layout">
            <Sidebar active={active} onChange={setActive} user={user} onLogout={logout} />
            <main className="admin-main">
                <div className="admin-content">
                    {active === 'diagnostics' && <DiagnosticsPanel />}
                    {active === 'settings'    && <SettingsPanel user={user} />}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
