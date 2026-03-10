import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { evenementService, diagnosticService } from '@/services/api';

const NIVEAU = (score) => score >= 300 ? 'eleve' : score >= 150 ? 'modere' : 'faible';
const NIVEAU_LABEL = { faible: 'Faible', modere: 'Modéré', eleve: 'Élevé' };

const RECOMMANDATIONS = {
    faible:  'Votre niveau de stress est faible. Continuez à prendre soin de vous avec une activité physique régulière et un sommeil de qualité.',
    modere:  'Votre niveau de stress est modéré. Pensez à pratiquer des techniques de relaxation (méditation, respiration profonde) et à parler de vos préoccupations à un proche.',
    eleve:   'Votre niveau de stress est élevé. Il est conseillé de consulter un professionnel de santé et de mettre en place des stratégies de gestion du stress adaptées.',
};

const Results = ({ result, saved, onReset }) => {
    const key = NIVEAU(result.score);
    const label = NIVEAU_LABEL[key];
    const pct = Math.min((result.score / 450) * 100, 100);

    return (
        <div className="diag-page">
            <div className="diag-container--narrow">
                <div className={`diag-result-card diag-card--${key}`}>
                    <h1 className="diag-title text-center mb-6">Résultats du diagnostic</h1>

                    <div className="text-center mb-6">
                        <p className="diag-result-score">{result.score}</p>
                        <p className="diag-result-unit">points Holmes &amp; Rahe</p>
                        <span className={`diag-badge diag-badge--${key}`}>
                            Niveau de stress : {label}
                        </span>
                    </div>

                    {/* Barre de progression */}
                    <div className="mb-6">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>0</span><span>150</span><span>300</span><span>450+</span>
                        </div>
                        <div className="diag-progress-track">
                            <div
                                className={`diag-progress-fill diag-progress-fill--${key}`}
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>Faible</span><span>Modéré</span><span>Élevé</span>
                        </div>
                    </div>

                    <div className="diag-result-recommandation">
                        <p>{result.recommandation}</p>
                    </div>

                    <p className="text-xs text-gray-400 text-center mb-6">
                        {result.nombre_evenements} événement{result.nombre_evenements !== 1 ? 's' : ''} sélectionné{result.nombre_evenements !== 1 ? 's' : ''}
                    </p>

                    <div className="diag-result-disclaimer">
                        <p>
                            ⚠️ Ce questionnaire est un outil d'auto-évaluation (échelle Holmes &amp; Rahe).
                            Il ne remplace pas un avis médical professionnel.
                        </p>
                    </div>

                    {/* CTA selon statut de connexion */}
                    {saved ? (
                        /* Utilisateur connecté — résultat sauvegardé */
                        <div className="flex flex-col gap-3">
                            <button onClick={onReset} className="diag-btn-primary">
                                Refaire le questionnaire
                            </button>
                            <Link to="/diagnostic/history" className="diag-btn-secondary">
                                Voir mon historique
                            </Link>
                            <Link to="/dashboard" className="diag-btn-ghost">
                                Retour au tableau de bord
                            </Link>
                        </div>
                    ) : (
                        /* Visiteur anonyme — invitation à créer un compte */
                        <div className="flex flex-col gap-3">
                            <div className="diag-guest-cta">
                                <p className="diag-guest-cta__text">
                                    Créez un compte gratuit pour sauvegarder vos résultats et suivre l'évolution de votre stress dans le temps.
                                </p>
                                <Link to="/register" className="diag-btn-primary block text-center">
                                    Créer un compte gratuitement
                                </Link>
                                <Link to="/login" className="diag-btn-secondary block">
                                    J'ai déjà un compte
                                </Link>
                            </div>
                            <button onClick={onReset} className="diag-btn-ghost">
                                Refaire le questionnaire
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const DiagnosticQuestionnaire = () => {
    const { isAuthenticated } = useAuth();
    const [evenements, setEvenements] = useState([]);
    const [selected, setSelected] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        document.title = 'Questionnaire Holmes & Rahe — CesiZen';
        evenementService.getAll()
            .then(res => setEvenements(res.data.evenements || []))
            .catch(() => setError('Impossible de charger le questionnaire.'))
            .finally(() => setLoading(false));
    }, []);

    const toggle = (id) => {
        setSelected(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const score = evenements.filter(e => selected.has(e.id)).reduce((s, e) => s + e.points, 0);
    const key = NIVEAU(score);

    const handleSubmit = async () => {
        setError(null);
        setSubmitting(true);

        if (!isAuthenticated) {
            // Calcul local pour les visiteurs anonymes
            const key = NIVEAU(score);
            setResult({
                score,
                niveau_stress: NIVEAU_LABEL[key],
                recommandation: RECOMMANDATIONS[key],
                nombre_evenements: selected.size,
            });
            setSaved(false);
            setSubmitting(false);
            return;
        }

        try {
            const res = await diagnosticService.create({ evenements: [...selected] });
            setResult(res.data.diagnostic);
            setSaved(true);
        } catch {
            setError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReset = () => {
        setResult(null);
        setSaved(false);
        setSelected(new Set());
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Chargement du questionnaire...</p>
            </div>
        );
    }

    if (result) {
        return <Results result={result} saved={saved} onReset={handleReset} />;
    }

    return (
        <div className="diag-page">
            <div className="diag-container">

                <div className="diag-header">
                    <div>
                        <h1 className="diag-title">Questionnaire Holmes &amp; Rahe</h1>
                        <p className="text-gray-600 mt-1 text-sm">
                            Cochez les événements vécus au cours des <strong>12 derniers mois</strong>.
                        </p>
                    </div>
                    {isAuthenticated && (
                        <Link to="/diagnostic/history" className="text-sm text-green-600 hover:underline whitespace-nowrap ml-4">
                            Mon historique
                        </Link>
                    )}
                </div>

                {!isAuthenticated && (
                    <div className="diag-guest-notice">
                        Vous consultez en tant que visiteur.{' '}
                        <Link to="/login" className="font-medium text-green-700 hover:underline">Connectez-vous</Link>
                        {' '}pour sauvegarder vos résultats.
                    </div>
                )}

                {error && <div className="diag-error">{error}</div>}

                {/* Score sticky */}
                <div className={`diag-score-bar diag-card--${key}`}>
                    <div>
                        <p className="diag-score-label">Score actuel</p>
                        <p className="diag-score-value">{score} pts</p>
                    </div>
                    <div className="text-right">
                        <span className={`diag-badge diag-badge--${key}`}>
                            {NIVEAU_LABEL[key]}
                        </span>
                        <p className="diag-score-meta">
                            {selected.size} / {evenements.length} sélectionné{selected.size !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                {/* Événements */}
                <div className="diag-events-list">
                    {evenements.map(evt => (
                        <label
                            key={evt.id}
                            className={`diag-event-item ${selected.has(evt.id) ? 'diag-event-item--selected' : ''}`}
                        >
                            <input
                                type="checkbox"
                                checked={selected.has(evt.id)}
                                onChange={() => toggle(evt.id)}
                                className="diag-event-checkbox"
                            />
                            <span className="diag-event-label">{evt.type_evenement}</span>
                            <span className={`diag-event-points ${evt.points > 50 ? 'diag-event-points--high' : evt.points >= 20 ? 'diag-event-points--medium' : 'diag-event-points--low'}`}>
                                {evt.points} pts
                            </span>
                        </label>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleSubmit}
                        disabled={selected.size === 0 || submitting}
                        className="diag-btn-primary"
                    >
                        {submitting
                            ? 'Calcul en cours...'
                            : `Calculer mon score${selected.size > 0 ? ` (${selected.size} événement${selected.size !== 1 ? 's' : ''})` : ''}`
                        }
                    </button>
                    <Link to="/" className="diag-btn-ghost">
                        Annuler
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default DiagnosticQuestionnaire;
