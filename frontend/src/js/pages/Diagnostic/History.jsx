import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { diagnosticService } from '@/services/api';

const NIVEAU_KEY = { Faible: 'faible', Modéré: 'modere', Élevé: 'eleve' };

const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const DiagnosticHistory = () => {
    const [diagnostics, setDiagnostics] = useState([]);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        document.title = 'Historique des diagnostics — CesiZen';
    }, []);

    useEffect(() => {
        setLoading(true);
        setError(null);
        diagnosticService.getAll(page)
            .then(res => {
                const payload = res.data;
                setDiagnostics(payload.data || []);
                setMeta({
                    current_page: payload.current_page ?? 1,
                    last_page: payload.last_page ?? 1,
                });
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
            <div className="diag-container">

                <div className="diag-header">
                    <div>
                        <h1 className="diag-title">Historique des diagnostics</h1>
                        <p className="diag-subtitle">Vos auto-évaluations passées</p>
                    </div>
                    <Link to="/diagnostic" className="diag-btn-new">
                        Nouveau diagnostic
                    </Link>
                </div>

                {error && <div className="diag-error">{error}</div>}

                {loading ? (
                    <div className="diag-loading">Chargement...</div>
                ) : diagnostics.length === 0 ? (
                    <div className="diag-empty">
                        <p className="text-gray-500 mb-4">Vous n'avez pas encore de diagnostic.</p>
                        <Link to="/diagnostic" className="text-green-600 font-medium hover:underline">
                            Faire mon premier diagnostic
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="diag-history-list">
                            {diagnostics.map(diag => {
                                const key = NIVEAU_KEY[diag.niveau_stress] || 'faible';
                                return (
                                    <div key={diag.id} className="diag-history-row">
                                        <div className="flex-1 min-w-0">
                                            <p className="diag-history-date">{formatDate(diag.created_at)}</p>
                                            <p className="diag-history-meta">
                                                {diag.nombre_evenements} événement{diag.nombre_evenements !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <span className="diag-history-score">{diag.score} pts</span>
                                            <span className={`diag-badge diag-badge--${key}`}>
                                                {diag.niveau_stress}
                                            </span>
                                            <button
                                                onClick={() => handleDelete(diag.id)}
                                                disabled={deleting === diag.id}
                                                className="diag-delete-btn"
                                                title="Supprimer"
                                            >
                                                {deleting === diag.id ? <span className="text-xs">...</span> : <TrashIcon />}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {meta.last_page > 1 && (
                            <div className="diag-pagination">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={meta.current_page === 1}
                                    className="diag-pagination-btn"
                                >
                                    Précédent
                                </button>
                                <span className="diag-pagination-info">
                                    Page {meta.current_page} / {meta.last_page}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                                    disabled={meta.current_page === meta.last_page}
                                    className="diag-pagination-btn"
                                >
                                    Suivant
                                </button>
                            </div>
                        )}
                    </>
                )}

                <div className="mt-6 text-center">
                    <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                        Retour au tableau de bord
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default DiagnosticHistory;
