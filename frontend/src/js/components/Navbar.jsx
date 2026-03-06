import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AppLogo from './app-logo';

const Navbar = () => {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <AppLogo />
                    </Link>

                    {/* Navigation Desktop */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-gray-700 hover:text-cesizen-green transition">
                            Accueil
                        </Link>
                        <Link to="/informations" className="text-gray-700 hover:text-cesizen-green transition">
                            Informations
                        </Link>
                        
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="text-gray-700 hover:text-cesizen-green transition">
                                    Tableau de bord
                                </Link>
                                <Link to="/diagnostic" className="text-gray-700 hover:text-cesizen-green transition">
                                    Test de stress
                                </Link>
                                {isAdmin() && (
                                    <Link to="/admin" className="text-gray-700 hover:text-cesizen-green transition">
                                        Administration
                                    </Link>
                                )}
                                
                                <div className="flex items-center space-x-4">
                                    <span className="text-gray-700">
                                        Bonjour, <strong>{user.name}</strong>
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="btn-outline py-2"
                                    >
                                        Déconnexion
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-700 hover:text-cesizen-green transition">
                                    Connexion
                                </Link>
                                <Link to="/register" className="btn-primary py-2">
                                    Crée un compte
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Burger Menu Mobile */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Menu Mobile */}
                {isMenuOpen && (
                    <div className="md:hidden py-4">
                        <Link to="/" className="block py-2 text-gray-700 hover:text-cesizen-green">
                            Accueil
                        </Link>
                        <Link to="/informations" className="block py-2 text-gray-700 hover:text-cesizen-green">
                            Informations
                        </Link>
                        
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="block py-2 text-gray-700 hover:text-cesizen-green">
                                    Tableau de bord
                                </Link>
                                <Link to="/diagnostic" className="block py-2 text-gray-700 hover:text-cesizen-green">
                                    Test de stress
                                </Link>
                                {isAdmin() && (
                                    <Link to="/admin" className="block py-2 text-gray-700 hover:text-cesizen-green">
                                        Administration
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="btn-outline w-full mt-4"
                                >
                                    Déconnexion
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block py-2 text-gray-700 hover:text-cesizen-green">
                                    Connexion
                                </Link>
                                <Link to="/register" className="btn-primary w-full mt-4">
                                    Crée un compte
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;