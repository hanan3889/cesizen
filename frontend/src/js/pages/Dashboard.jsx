import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { diagnosticService } from '../services/api';
import '../../css/dashboard.css';

/* ── Helpers ────────────────────────────────────────────── */
const NIVEAU_KEY = { 'Faible': 'faible', 'Modéré': 'modere', 'Élevé': 'eleve' };

const formatDate = (d) =>
    new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

/* ── Carte statistique ──────────────────────────────────── */
const StatCard = ({ label, value, sub, iconVariant, icon }) => (
    <div className="dash-stat-card">
        <div className="dash-stat-inner">
            <div>
                <p className="dash-stat-label">{label}</p>
                <p className="dash-stat-value">{value}</p>
                {sub && <p className="dash-stat-sub">{sub}</p>}
            </div>
            <div className={`dash-stat-icon dash-stat-icon--${iconVariant}`}>
                {icon}
            </div>
        </div>
    </div>
);

/* ── Composant principal ────────────────────────────────── */
const Dashboard = () => {
    const { user, isAdmin } = useAuth();

    if (isAdmin()) return <Navigate to="/admin/dashboard" replace />;

    const [stats, setStats] = useState(null);
    const [recentDiagnostics, setRecentDiagnostics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        Promise.all([
            diagnosticService.getStats(),
            diagnosticService.getRecents(),
        ])
            .then(([statsRes, diagsRes]) => {
                setStats(statsRes.data.statistiques ?? null);
                setRecentDiagnostics(diagsRes.data.diagnostics || []);
            })
            .catch(() => setError('Impossible de charger les données du tableau de bord.'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="dash-loading">
                <div className="dash-spinner" />
            </div>
        );
    }

    const total    = stats?.nombre_total ?? 0;
    const moyen    = stats?.score_moyen  != null ? Math.round(stats.score_moyen) : null;
    const min      = stats?.score_min    ?? null;
    const max      = stats?.score_max    ?? null;
    const hasStats = total > 0;

    return (
        <div className="dash-page">
            <div className="dash-container">

                {/* En-tête */}
                <div className="dash-header">
                    <h1 className="dash-title">Bonjour, {user.name}</h1>
                    <p className="dash-subtitle">Votre tableau de bord CesiZen</p>
                </div>

                {error && <div className="dash-error">{error}</div>}

                {/* Cartes statistiques */}
                <div className="dash-stats-grid">
                    <StatCard
                        label="Total diagnostics"
                        value={total}
                        sub={total === 1 ? '1 diagnostic effectué' : `${total} diagnostics effectués`}
                        iconVariant="green"
                        icon={
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        }
                    />
                    <StatCard
                        label="Score moyen"
                        value={hasStats ? moyen : '—'}
                        sub="points Holmes & Rahe"
                        iconVariant="yellow"
                        icon={
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        }
                    />
                    <StatCard
                        label="Score minimum"
                        value={hasStats ? min : '—'}
                        sub="meilleur résultat"
                        iconVariant="blue"
                        icon={
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        }
                    />
                    <StatCard
                        label="Score maximum"
                        value={hasStats ? max : '—'}
                        sub="pic de stress"
                        iconVariant="red"
                        icon={
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                        }
                    />
                </div>

                {/* CTA */}
                <div className="dash-cta">
                    <div className="dash-cta-inner">
                        <div>
                            <h2 className="dash-cta-title">Comment vous sentez-vous aujourd'hui ?</h2>
                            <p className="dash-cta-desc">Faites un nouveau test pour évaluer votre niveau de stress actuel</p>
                        </div>
                        <Link to="/diagnostic" className="dash-cta-btn">
                            Faire un test
                        </Link>
                    </div>
                </div>

                {/* Diagnostics récents */}
                <div className="dash-recents-card">
                    <div className="dash-recents-header">
                        <h2 className="dash-recents-title">Diagnostics récents</h2>
                        <Link to="/diagnostic/history" className="dash-recents-link">
                            Voir tout
                        </Link>
                    </div>

                    {recentDiagnostics.length === 0 ? (
                        <div className="dash-empty">
                            <div className="dash-empty-icon">
                                <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <p className="dash-empty-title">Aucun diagnostic pour le moment</p>
                            <p className="dash-empty-desc">Commencez par faire votre premier test de stress</p>
                            <Link to="/diagnostic" className="btn-primary inline-block">
                                Faire mon premier test
                            </Link>
                        </div>
                    ) : (
                        <div className="dash-diag-list">
                            {recentDiagnostics.map((diagnostic) => {
                                const key = NIVEAU_KEY[diagnostic.niveau_stress] || 'faible';
                                return (
                                    <div key={diagnostic.id} className="dash-diag-row">
                                        <div className="dash-diag-info">
                                            <p className="dash-diag-date">
                                                {formatDate(diagnostic.created_at || diagnostic.date)}
                                            </p>
                                            <p className="dash-diag-events">
                                                {diagnostic.nombre_evenements} événement{diagnostic.nombre_evenements !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                        <div className="dash-diag-right">
                                            <span className="dash-diag-score">{diagnostic.score}</span>
                                            <span className={`dash-diag-badge dash-diag-badge--${key}`}>
                                                {diagnostic.niveau_stress}
                                            </span>
                                            <Link to="/diagnostic/history" className="dash-diag-arrow">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Recommandations */}
                {hasStats && moyen != null && (
                    <div className="dash-reco-card">
                        <h3 className="dash-reco-title">Recommandations</h3>
                        <div className="dash-reco-body">
                            {moyen < 150 && (
                                <p>Votre niveau de stress moyen est faible. Continuez vos bonnes habitudes !</p>
                            )}
                            {moyen >= 150 && moyen < 300 && (
                                <>
                                    <p className="dash-reco-label">Votre stress moyen est modéré. Pensez à :</p>
                                    <ul className="dash-reco-list">
                                        <li>Pratiquer une activité physique régulière</li>
                                        <li>Maintenir un sommeil de qualité (7-8h)</li>
                                        <li>Prendre des pauses régulières</li>
                                    </ul>
                                </>
                            )}
                            {moyen >= 300 && (
                                <>
                                    <p className="dash-reco-label">Votre stress moyen est élevé. Il est recommandé de :</p>
                                    <ul className="dash-reco-list">
                                        <li>Consulter un professionnel de santé</li>
                                        <li>Apprendre des techniques de relaxation</li>
                                        <li>Identifier et gérer les sources de stress</li>
                                        <li>Ne pas rester seul(e) face à cette situation</li>
                                    </ul>
                                </>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Dashboard;
