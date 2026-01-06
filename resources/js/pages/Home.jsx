import React from 'react';
import { Link } from '@inertiajs/react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="bg-gradient-to-b from-green-50 to-white">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-16 md:py-24">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Bienvenue sur <span className="text-cesizen-green">CesiZen</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Votre compagnon pour la gestion du stress et le bien-être mental
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {isAuthenticated ? (
                            <>
                                <Link href="/diagnostic" className="btn-primary text-lg">
                                    Faire un test de stress
                                </Link>
                                <Link href="/dashboard" className="btn-outline text-lg">
                                    Mon tableau de bord
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/register" className="btn-primary text-lg">
                                    Commencer
                                </Link>
                                <Link href="/informations" className="btn-outline text-lg">
                                    En savoir plus
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

                {/* Features Section */}
                <section className="bg-white py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                            Pourquoi choisir CesiZen ?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="card text-center">
                                <div className="w-16 h-16 bg-cesizen-green rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Test de stress validé
                                </h3>
                                <p className="text-gray-600">
                                    Basé sur l'échelle Holmes-Rahe, reconnue scientifiquement avec 43 événements de vie
                                </p>
                            </div>

                            <div className="card text-center">
                                <div className="w-16 h-16 bg-cesizen-green rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Suivi personnalisé
                                </h3>
                                <p className="text-gray-600">
                                    Visualisez l'évolution de votre niveau de stress et recevez des recommandations adaptées
                                </p>
                            </div>

                            <div className="card text-center">
                                <div className="w-16 h-16 bg-cesizen-green rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Données sécurisées
                                </h3>
                                <p className="text-gray-600">
                                    Conformité RGPD garantie. Vos données sont cryptées et sécurisées
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-cesizen-green py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Prêt à prendre soin de votre santé mentale ?
                        </h2>
                        <p className="text-white text-lg mb-8">
                            Rejoignez des milliers d'utilisateurs qui gèrent leur stress avec CesiZen
                        </p>
                        {!isAuthenticated && (
                            <Link href="/register" className="bg-white text-cesizen-green px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
                                Créer mon compte gratuitement
                            </Link>
                        )}
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div>
                                <div className="text-4xl font-bold text-cesizen-green mb-2">43</div>
                                <div className="text-gray-600">Événements de vie analysés</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-cesizen-green mb-2">100%</div>
                                <div className="text-gray-600">Gratuit et confidentiel</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-cesizen-green mb-2">24/7</div>
                                <div className="text-gray-600">Accessible à tout moment</div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
    );
};

export default Home;