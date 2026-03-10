import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { diagnosticService } from '@/services/api';

const NIVEAU_KEY = { Faible: 'faible', Modéré: 'modere', Élevé: 'eleve' };

const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

const DiagnosticHistory = () => {
    const [diagnostics, setDiagnostics] = useState([]);
    const [meta, setMeta]       = useState({ current_page: 1, last_page: 1 });
    const [page, setPage]       = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => { document.title = 'Historique des diagnostics — CesiZen'; }, []);

    useEffect(() => {
        setLoading(true);
        setError(null);
        diagnosticService.getAll(page)
            .then(res => {
                const p = res.data;
                setDiagnostics(p.data || []);
                setMeta({ current_page: p.current_page ?? 1, last_page: p.last_page ?? 1 });
            })
            .catch(() => setError("Impossible de charger l'historique."))
            .finally(() => setLoading(false));
    }, [page]);

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer ce diagnostic ?')) return;
        setDeleting(id);
        try {
            await diagnosticService.delete(id);
            setDiagnostics(prev => prev.filter(d => d.id !== id));
        } catch {
            setError('Impossible de supprimer ce diagnostic.');
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="diag-page">
            <div className="diag-wrapper">

                {/* Card : en-tête */}
                <div className="diag-card mb-4">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Mes diagnostics</h1>
                            <p className="text-sm text-gray-500 mt-0.5">Historique de vos auto-évaluations</p>
                        </div>
                        <Link to="/diagnostic" className="diag-btn diag-btn--primary flex-shrink-0 !w-auto !py-2 !px-4">
                            + Nouveau
                        </Link>
                    </div>

                    {error && (
                        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                </div>

                {/* Contenu */}
                {loading ? (
                    <div className="diag-card flex items-center justify-center py-16">
                        <div className="text-center">
                            <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                            <p className="text-sm text-gray-400">Chargement...</p>
                        </div>
                    </div>
                ) : diagnostics.length === 0 ? (
                    <div className="diag-card text-center py-16">
                        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <p className="text-gray-500 font-medium mb-1">Aucun diagnostic pour l'instant</p>
                        <p className="text-sm text-gray-400 mb-5">Faites votre premier test de stress</p>
                        <Link to="/diagnostic" className="diag-btn diag-btn--primary inline-block !w-auto !px-6">
                            Commencer le questionnaire
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Cards diagnostics */}
                        <div className="space-y-3 mb-4">
                            {diagnostics.map(diag => {
                                const key = NIVEAU_KEY[diag.niveau_stress] || 'faible';
                                return (
                                    <div key={diag.id} className={`diag-card diag-card--${key} !border-l-4`}>
                                        <div className="flex items-center justify-between gap-3">
                                            {/* Infos */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-2xl font-extrabold text-gray-900 tabular-nums leading-none">
                                                        {diag.score}
                                                    </span>
                                                    <span className="text-sm text-gray-400 font-normal">pts</span>
                                                    <span className={`diag-badge diag-badge--${key}`}>
                                                        {diag.niveau_stress}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1.5">
                                                    {formatDate(diag.created_at)}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {diag.nombre_evenements} événement{diag.nombre_evenements !== 1 ? 's' : ''}
                                                </p>
                                            </div>

                                            {/* Supprimer */}
                                            <button
                                                onClick={() => handleDelete(diag.id)}
                                                disabled={deleting === diag.id}
                                                className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                                                title="Supprimer"
                                            >
                                                {deleting === diag.id ? (
                                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {meta.last_page > 1 && (
                            <div className="diag-card">
                                <div className="flex items-center justify-between gap-3">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={meta.current_page === 1}
                                        className="diag-btn diag-btn--outline !w-auto !py-2 !px-4 disabled:opacity-40"
                                    >
                                        ← Précédent
                                    </button>
                                    <span className="text-sm text-gray-500 font-medium">
                                        {meta.current_page} / {meta.last_page}
                                    </span>
                                    <button
                                        onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                                        disabled={meta.current_page === meta.last_page}
                                        className="diag-btn diag-btn--outline !w-auto !py-2 !px-4 disabled:opacity-40"
                                    >
                                        Suivant →
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                <div className="text-center mt-4 pb-6">
                    <Link to="/dashboard" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                        ← Retour au tableau de bord
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default DiagnosticHistory;
