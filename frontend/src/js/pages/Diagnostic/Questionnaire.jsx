import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { evenementService, diagnosticService } from '@/services/api';
import '../../../css/diagnostic.css';

/* ── Helpers ─────────────────────────────────────────────────── */
const NIVEAU_KEY   = (score) => score >= 300 ? 'eleve' : score >= 150 ? 'modere' : 'faible';
const NIVEAU_LABEL = { faible: 'Faible', modere: 'Modéré', eleve: 'Élevé' };
const RECOMMANDATIONS = {
    faible: 'Votre niveau de stress est faible. Continuez à prendre soin de vous avec une activité physique régulière et un sommeil de qualité.',
    modere: 'Votre niveau de stress est modéré. Pensez à pratiquer des techniques de relaxation (méditation, respiration profonde) et à parler de vos préoccupations à un proche.',
    eleve:  'Votre niveau de stress est élevé. Il est conseillé de consulter un professionnel de santé et de mettre en place des stratégies de gestion du stress adaptées.',
};
const SESSION_KEY = 'cesizen_pending_diagnostic';

/* ── Écran de résultats ──────────────────────────────────────── */
const Results = ({ result, savedId, saving, deleting, error, isAuthenticated, onSave, onEdit, onDelete, onReset }) => {
    const key     = NIVEAU_KEY(result.score);
    const label   = NIVEAU_LABEL[key];
    const pct     = Math.min((result.score / 450) * 100, 100);
    const isSaved = !!savedId;

    return (
        <div className="diag-page">
            <div className="diag-wrapper">

                <div className="diag-card !p-0 overflow-hidden">

                    {/* En-tête coloré */}
                    <div className={`diag-result-header diag-result-header--${key}`}>
                        <p className={`diag-result-header-label diag-result-header-label--${key}`}>
                            Niveau de stress
                        </p>
                        <p className="diag-result-score">{result.score}</p>
                        <p className="diag-result-unit">points Holmes &amp; Rahe</p>
                        <div className="diag-result-pill">
                            <span className="diag-result-pill-text">{label}</span>
                        </div>
                    </div>

                    <div className="diag-result-body">

                        {/* Barre de progression */}
                        <div>
                            <div className="diag-progress-labels">
                                <span>0</span><span>150</span><span>300</span><span>450+</span>
                            </div>
                            <div className={`diag-progress-track diag-progress-track--${key}`}>
                                <div
                                    className={`diag-progress-fill diag-progress-fill--${key}`}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                            <div className="diag-progress-labels">
                                <span>Faible</span><span>Modéré</span><span>Élevé</span>
                            </div>
                        </div>

                        {/* Recommandation */}
                        <div className={`diag-reco diag-reco--${key}`}>
                            <p className="diag-reco-text">{result.recommandation}</p>
                        </div>

                        <p className="diag-result-count">
                            {result.nombre_evenements} événement{result.nombre_evenements !== 1 ? 's' : ''} sélectionné{result.nombre_evenements !== 1 ? 's' : ''}
                        </p>

                        {/* Disclaimer */}
                        <div className="diag-disclaimer">
                            <p className="diag-disclaimer-text">
                                Outil d'auto-évaluation (échelle Holmes &amp; Rahe). Ne remplace pas un avis médical.
                            </p>
                        </div>

                        {/* Erreur */}
                        {error && <div className="diag-error-box">{error}</div>}

                        {/* Actions */}
                        {isSaved ? (
                            <div className="diag-actions">
                                <div className="diag-saved-banner">
                                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Diagnostic sauvegardé
                                </div>
                                <div className="diag-actions-2col">
                                    <button onClick={onEdit} className="diag-btn diag-btn--outline">Modifier</button>
                                    <button onClick={onDelete} disabled={deleting} className="diag-btn diag-btn--danger">
                                        {deleting ? '...' : 'Supprimer'}
                                    </button>
                                </div>
                                <Link to="/diagnostic/history" className="diag-btn diag-btn--secondary block text-center">
                                    Voir mon historique
                                </Link>
                                <button onClick={onReset} className="diag-btn diag-btn--ghost w-full">
                                    Nouveau questionnaire
                                </button>
                            </div>
                        ) : (
                            <div className="diag-actions">
                                <button onClick={onSave} disabled={saving} className="diag-btn diag-btn--primary w-full">
                                    {saving ? 'Sauvegarde en cours...' : isAuthenticated ? 'Sauvegarder mon diagnostic' : 'Sauvegarder (connexion requise)'}
                                </button>
                                {!isAuthenticated && (
                                    <p className="text-xs text-center text-gray-400">
                                        Vous serez redirigé vers la page de connexion
                                    </p>
                                )}
                                <button onClick={onReset} className="diag-btn diag-btn--ghost w-full">
                                    Refaire le questionnaire
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-center mt-4">
                    <Link to="/" className="diag-back-link">Retour à l'accueil</Link>
                </div>
            </div>
        </div>
    );
};

/* ── Composant principal ─────────────────────────────────────── */
const DiagnosticQuestionnaire = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [evenements, setEvenements]   = useState([]);
    const [selected, setSelected]       = useState(new Set());
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState(null);
    const [step, setStep]               = useState('form');
    const [localResult, setLocalResult] = useState(null);
    const [savedId, setSavedId]         = useState(null);
    const [saving, setSaving]           = useState(false);
    const [deleting, setDeleting]       = useState(false);
    const [hasPending, setHasPending]   = useState(false);

    useEffect(() => {
        document.title = 'Questionnaire Holmes & Rahe — CesiZen';
        evenementService.getAll()
            .then(res => {
                const evts = res.data.evenements || [];
                setEvenements(evts);

                if (isAuthenticated) {
                    const raw = sessionStorage.getItem(SESSION_KEY);
                    if (raw) {
                        try {
                            const { selectedIds } = JSON.parse(raw);
                            const ids = new Set(selectedIds);
                            setSelected(ids);
                            sessionStorage.removeItem(SESSION_KEY);
                            setHasPending(true);
                            const sc = evts.filter(e => ids.has(e.id)).reduce((s, e) => s + e.points, 0);
                            const k  = NIVEAU_KEY(sc);
                            setLocalResult({ score: sc, niveau_stress: NIVEAU_LABEL[k], recommandation: RECOMMANDATIONS[k], nombre_evenements: ids.size });
                            setStep('results');
                        } catch { sessionStorage.removeItem(SESSION_KEY); }
                    }
                }
            })
            .catch(() => setError('Impossible de charger le questionnaire.'))
            .finally(() => setLoading(false));
    }, [isAuthenticated]);

    const toggle = (id) => setSelected(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });

    const score = evenements.filter(e => selected.has(e.id)).reduce((s, e) => s + e.points, 0);
    const key   = NIVEAU_KEY(score);

    const handleCalculate = () => {
        const k = NIVEAU_KEY(score);
        setLocalResult({ score, niveau_stress: NIVEAU_LABEL[k], recommandation: RECOMMANDATIONS[k], nombre_evenements: selected.size });
        setError(null);
        setStep('results');
    };

    const handleSave = async () => {
        if (!isAuthenticated) {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify({ selectedIds: [...selected] }));
            navigate('/login?redirect=/diagnostic');
            return;
        }
        setSaving(true);
        setError(null);
        try {
            if (savedId) await diagnosticService.delete(savedId);
            const res = await diagnosticService.create({ evenements: [...selected] });
            setSavedId(res.data.diagnostic.id);
            setLocalResult(res.data.diagnostic);
        } catch {
            setError('Impossible de sauvegarder. Veuillez réessayer.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!savedId || !window.confirm('Supprimer définitivement ce diagnostic ?')) return;
        setDeleting(true);
        try {
            await diagnosticService.delete(savedId);
            handleReset();
        } catch {
            setError('Impossible de supprimer le diagnostic.');
        } finally {
            setDeleting(false);
        }
    };

    const handleReset = () => {
        setStep('form'); setLocalResult(null); setSavedId(null);
        setSelected(new Set()); setError(null); setHasPending(false);
    };

    /* ── Chargement ── */
    if (loading) return (
        <div className="diag-loading-screen">
            <div className="text-center">
                <div className="diag-spinner" />
                <p className="text-sm text-gray-500">Chargement...</p>
            </div>
        </div>
    );

    /* ── Résultats ── */
    if (step === 'results' && localResult) return (
        <Results
            result={localResult} savedId={savedId} saving={saving} deleting={deleting}
            error={error} isAuthenticated={isAuthenticated}
            onSave={handleSave} onEdit={() => { setStep('form'); setError(null); }}
            onDelete={handleDelete} onReset={handleReset}
        />
    );

    /* ── Formulaire ── */
    return (
        <div className="diag-page">
            <div className="diag-wrapper">

                {/* Card titre */}
                <div className="diag-form-header">
                    <div className="diag-form-title-row">
                        <div>
                            <h1 className="diag-form-title">Questionnaire Holmes &amp; Rahe</h1>
                            <p className="diag-form-subtitle">
                                Cochez les événements vécus durant les <strong>12 derniers mois</strong>.
                            </p>
                        </div>
                        {isAuthenticated && (
                            <Link to="/diagnostic/history" className="diag-form-history-link">
                                Mon historique
                            </Link>
                        )}
                    </div>

                    {!isAuthenticated && (
                        <div className={`diag-notice diag-notice--guest`}>
                            <span className="flex-shrink-0"></span>
                            <span>
                                Mode visiteur — résultats non sauvegardés.{' '}
                                <Link to="/login" className="font-semibold underline">Se connecter</Link>
                            </span>
                        </div>
                    )}
                    {hasPending && (
                        <div className={`diag-notice diag-notice--pending`}>
                            <span className="flex-shrink-0"></span>
                            <span>Sélections restaurées. Cliquez sur "Sauvegarder" pour les enregistrer.</span>
                        </div>
                    )}
                    {error && (
                        <div className={`diag-notice diag-notice--error`}>
                            <span className="flex-shrink-0"></span>
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                {/* Score sticky */}
                <div className={`diag-score-card diag-card--${key}`}>
                    <div className="diag-score-inner">
                        <div>
                            <p className="diag-score-label">Score actuel</p>
                            <p className="diag-score-value">
                                {score} <span className="diag-score-unit">pts</span>
                            </p>
                        </div>
                        <div className="text-right">
                            <span className={`diag-badge diag-badge--${key}`}>{NIVEAU_LABEL[key]}</span>
                            <p className="diag-score-count">{selected.size} / {evenements.length} cochés</p>
                        </div>
                    </div>
                </div>

                {/* Liste des événements */}
                <div className="diag-events-card">
                    {evenements.map((evt, i) => {
                        const ptsClass = evt.points > 50 ? 'diag-event-pts--high' : evt.points >= 20 ? 'diag-event-pts--medium' : 'diag-event-pts--low';
                        const rowClass = [
                            'diag-event-row',
                            i !== 0 ? 'diag-event-row--border' : '',
                            selected.has(evt.id) ? 'diag-event-row--selected' : 'diag-event-row--idle',
                        ].join(' ');
                        return (
                            <label key={evt.id} className={rowClass}>
                                <input
                                    type="checkbox"
                                    checked={selected.has(evt.id)}
                                    onChange={() => toggle(evt.id)}
                                    className="diag-event-checkbox"
                                />
                                <span className="diag-event-name">{evt.type_evenement}</span>
                                <span className={`diag-event-pts ${ptsClass}`}>{evt.points}</span>
                            </label>
                        );
                    })}
                </div>

                {/* Section Calculer */}
                <div className="diag-cta-section">
                    <div className="diag-cta-top">
                        <button
                            onClick={handleCalculate}
                            disabled={selected.size === 0}
                            className="diag-cta-btn"
                        >
                            {selected.size === 0
                                ? 'Sélectionnez au moins un événement'
                                : `Calculer mon score (${selected.size} événement${selected.size !== 1 ? 's' : ''})`
                            }
                        </button>
                        {selected.size > 0 && (
                            <p className="diag-cta-hint">Votre résultat sera calculé instantanément</p>
                        )}
                    </div>
                    <div className="diag-cta-footer">
                        <Link to="/" className="diag-cta-cancel">Annuler et retourner à l'accueil</Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DiagnosticQuestionnaire;
