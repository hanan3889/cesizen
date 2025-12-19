import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { diagnosticService } from '../services/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentDiagnostics, setRecentDiagnostics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [statsRes, diagsRes] = await Promise.all([
                diagnosticService.getStats(),
                diagnosticService.getRecents(),
            ]);

            setStats(statsRes.data);
            setRecentDiagnostics(diagsRes.data.diagnostics || []);
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStressLevelColor = (niveau) => {
        switch (niveau) {
            case 'Faible':
                return 'bg-green-100 text-green-800';
            case 'Modéré':
                return 'bg-yellow-100 text-yellow-800';
            case 'Élevé':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStressIcon = (niveau) => {
        switch (niveau) {
            case 'Faible':
                return '😊';
            case 'Modéré':
                return '😐';
            case 'Élevé':
                return '😰';
            default:
                return '❓';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cesizen-green"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Bonjour, {user.name} 👋
                    </h1>
                    <p className="text-gray-600">
                        Bienvenue sur votre tableau de bord CesiZen
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Total diagnostics</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {stats?.total || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-cesizen-green rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Score moyen</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {stats?.score_moyen ? Math.round(stats.score_moyen) : 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Score minimum</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {stats?.score_minimum || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl">
                                😊
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Score maximum</p>
                                <p className="text-3xl font-bold text-red-600">
                                    {stats?.score_maximum || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl">
                                😰
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA pour nouveau test */}
                <div className="bg-gradient-to-r from-cesizen-green to-green-600 rounded-lg p-8 mb-8 text-white">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="mb-4 md:mb-0">
                            <h2 className="text-2xl font-bold mb-2">
                                Comment vous sentez-vous aujourd'hui ?
                            </h2>
                            <p className="text-green-100">
                                Faites un nouveau test pour évaluer votre niveau de stress actuel
                            </p>
                        </div>
                        <Link to="/diagnostic" className="bg-white text-cesizen-green px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                            Faire un test maintenant
                        </Link>
                    </div>
                </div>

                {/* Diagnostics récents */}
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Diagnostics récents
                        </h2>
                        <Link to="/diagnostics" className="text-cesizen-green hover:text-cesizen-green-dark font-medium">
                            Voir tout →
                        </Link>
                    </div>

                    {recentDiagnostics.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📊</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Aucun diagnostic pour le moment
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Commencez par faire votre premier test de stress
                            </p>
                            <Link to="/diagnostic" className="btn-primary inline-block">
                                Faire mon premier test
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentDiagnostics.map((diagnostic) => (
                                <div
                                    key={diagnostic.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:border-cesizen-green transition"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className="text-2xl">
                                                    {getStressIcon(diagnostic.niveau_stress)}
                                                </span>
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {new Date(diagnostic.date).toLocaleDateString('fr-FR', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                        })}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {diagnostic.nombre_evenements} événement(s) sélectionné(s)
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {diagnostic.score}
                                                </p>
                                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStressLevelColor(diagnostic.niveau_stress)}`}>
                                                    {diagnostic.niveau_stress}
                                                </span>
                                            </div>
                                            <Link
                                                to={`/diagnostics/${diagnostic.id}`}
                                                className="text-cesizen-green hover:text-cesizen-green-dark"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recommandations */}
                {stats?.score_moyen && (
                    <div className="mt-8 card bg-blue-50 border border-blue-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            💡 Recommandations
                        </h3>
                        <div className="space-y-2 text-gray-700">
                            {stats.score_moyen < 150 && (
                                <p>✓ Votre niveau de stress est faible. Continuez vos bonnes habitudes !</p>
                            )}
                            {stats.score_moyen >= 150 && stats.score_moyen < 300 && (
                                <>
                                    <p>⚠️ Votre stress est modéré. Pensez à :</p>
                                    <ul className="list-disc list-inside ml-4 space-y-1">
                                        <li>Pratiquer une activité physique régulière</li>
                                        <li>Maintenir un sommeil de qualité (7-8h)</li>
                                        <li>Prendre des pauses régulières</li>
                                    </ul>
                                </>
                            )}
                            {stats.score_moyen >= 300 && (
                                <>
                                    <p>Votre stress est élevé. Il est recommandé de :</p>
                                    <ul className="list-disc list-inside ml-4 space-y-1">
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