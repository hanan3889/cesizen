import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { evenementService, diagnosticService } from '@/services/api';

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
    const key   = NIVEAU_KEY(result.score);
    const label = NIVEAU_LABEL[key];
    const pct   = Math.min((result.score / 450) * 100, 100);
    const isSaved = !!savedId;

    return (
        <div className="diag-page">
            <div className="diag-wrapper">

                {/* Card résultats */}
                <div className={`diag-card diag-card--${key}`}>

                    <h1 className="text-xl font-bold text-gray-900 text-center mb-5">
                        Résultats du diagnostic
                    </h1>

                    {/* Score */}
                    <div className="text-center mb-5">
                        <p className="text-6xl font-extrabold text-gray-900 leading-none">{result.score}</p>
                        <p className="text-sm text-gray-400 mt-1 mb-3">points Holmes &amp; Rahe</p>
                        <span className={`diag-badge diag-badge--${key}`}>
                            Niveau : {label}
                        </span>
                    </div>

                    {/* Barre */}
                    <div className="mb-5">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>0</span><span>150</span><span>300</span><span>450+</span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 diag-bar--${key}`}
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>Faible</span><span>Modéré</span><span>Élevé</span>
                        </div>
                    </div>

                    {/* Recommandation */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-3">
                        <p className="text-sm text-gray-700 leading-relaxed">{result.recommandation}</p>
                    </div>

                    <p className="text-xs text-gray-400 text-center mb-4">
                        {result.nombre_evenements} événement{result.nombre_evenements !== 1 ? 's' : ''} sélectionné{result.nombre_evenements !== 1 ? 's' : ''}
                    </p>

                    {/* Disclaimer */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5">
                        <p className="text-xs text-amber-800 leading-relaxed">
                            ⚠️ Outil d'auto-évaluation (échelle Holmes &amp; Rahe). Ne remplace pas un avis médical.
                        </p>
                    </div>

                    {/* Erreur */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    {isSaved ? (
                        <div className="space-y-3">
                            {/* Statut sauvegardé */}
                            <div className="flex items-center justify-center gap-2 py-2.5 bg-green-50 border border-green-200 rounded-xl text-sm font-semibold text-green-700">
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Diagnostic sauvegardé
                            </div>
                            {/* Modifier / Supprimer */}
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={onEdit} className="diag-btn diag-btn--outline">
                                    ✏️ Modifier
                                </button>
                                <button onClick={onDelete} disabled={deleting} className="diag-btn diag-btn--danger">
                                    {deleting ? '...' : '🗑️ Supprimer'}
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
                        <div className="space-y-3">
                            <button onClick={onSave} disabled={saving} className="diag-btn diag-btn--primary w-full">
                                {saving ? 'Sauvegarde en cours...' : isAuthenticated ? '💾 Sauvegarder mon diagnostic' : '🔒 Sauvegarder (connexion requise)'}
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

                <div className="text-center mt-4">
                    <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
};

/* ── Composant principal ─────────────────────────────────────── */
const DiagnosticQuestionnaire = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [evenements, setEvenements] = useState([]);
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
                            const k = NIVEAU_KEY(sc);
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

    const handleReset = () => { setStep('form'); setLocalResult(null); setSavedId(null); setSelected(new Set()); setError(null); setHasPending(false); };

    /* ── Chargement ── */
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
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

                {/* Card : titre */}
                <div className="diag-card mb-4">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Questionnaire Holmes &amp; Rahe</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Cochez les événements vécus durant les <strong>12 derniers mois</strong>.
                            </p>
                        </div>
                        {isAuthenticated && (
                            <Link to="/diagnostic/history" className="flex-shrink-0 text-sm text-green-600 hover:underline mt-0.5">
                                Mon historique
                            </Link>
                        )}
                    </div>

                    {/* Bandeaux */}
                    {!isAuthenticated && (
                        <div className="mt-4 flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
                            <span className="flex-shrink-0">ℹ️</span>
                            <span>
                                Mode visiteur — résultats non sauvegardés.{' '}
                                <Link to="/login" className="font-semibold underline">Se connecter</Link>
                            </span>
                        </div>
                    )}
                    {hasPending && (
                        <div className="mt-4 flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-800">
                            <span className="flex-shrink-0">✅</span>
                            <span>Sélections restaurées. Cliquez sur "Sauvegarder" pour les enregistrer.</span>
                        </div>
                    )}
                    {error && (
                        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                </div>

                {/* Card : score sticky */}
                <div className={`sticky top-16 z-20 diag-card diag-card--${key} mb-4 !py-3`}>
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Score actuel</p>
                            <p className="text-3xl font-extrabold text-gray-900 leading-none mt-0.5">
                                {score} <span className="text-base font-normal text-gray-400">pts</span>
                            </p>
                        </div>
                        <div className="text-right">
                            <span className={`diag-badge diag-badge--${key}`}>{NIVEAU_LABEL[key]}</span>
                            <p className="text-xs text-gray-400 mt-1.5">
                                {selected.size} / {evenements.length} cochés
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card : liste des événements */}
                <div className="diag-card !p-0 overflow-hidden mb-4">
                    {evenements.map((evt, i) => (
                        <label
                            key={evt.id}
                            className={[
                                'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors',
                                i !== 0 ? 'border-t border-gray-100' : '',
                                selected.has(evt.id) ? 'bg-green-50' : 'hover:bg-gray-50',
                            ].join(' ')}
                        >
                            <input
                                type="checkbox"
                                checked={selected.has(evt.id)}
                                onChange={() => toggle(evt.id)}
                                className="w-4 h-4 flex-shrink-0 accent-green-600 cursor-pointer"
                            />
                            <span className="flex-1 text-sm text-gray-800 leading-snug">{evt.type_evenement}</span>
                            <span className={[
                                'text-sm font-semibold tabular-nums flex-shrink-0',
                                evt.points > 50 ? 'text-red-500' : evt.points >= 20 ? 'text-amber-500' : 'text-green-600',
                            ].join(' ')}>
                                {evt.points} pts
                            </span>
                        </label>
                    ))}
                </div>

                {/* Card : actions */}
                <div className="diag-card space-y-3">
                    <button
                        onClick={handleCalculate}
                        disabled={selected.size === 0}
                        className="diag-btn diag-btn--primary w-full"
                    >
                        {selected.size === 0
                            ? 'Sélectionnez au moins un événement'
                            : `Calculer mon score (${selected.size} événement${selected.size !== 1 ? 's' : ''})`
                        }
                    </button>
                    <Link to="/" className="diag-btn diag-btn--ghost block w-full text-center">
                        Annuler
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default DiagnosticQuestionnaire;
