import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pageService } from '../services/api';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const ArticleCard = ({ article }) => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{article.titre}</h3>
            <p className="text-gray-600 mb-4 flex-grow">{article.description}</p>
            <Link
                to={`/categories/${article.categorie.id}`}
                className="text-cesizen-green underline font-semibold mt-auto"
            >
                {article.categorie.categorie}
            </Link>
        </div>
    );
};

const Informations = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await pageService.getAll({ statut: 'publie' });
                setArticles(response.data.data);
            } catch (err) {
                setError('Impossible de charger les articles. Veuillez réessayer plus tard.');
                console.error("Erreur lors de la récupération des articles:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center text-gray-500 mt-16">
                    <p>Chargement des articles...</p>
                </div>
            );
        }

        if (error) {
            return (
                <Alert variant="destructive" className="max-w-lg mx-auto">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>
            );
        }

        if (articles.length > 0) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            );
        }

        return (
            <div className="text-center text-gray-500 mt-16">
                <p>Il n'y a pas d'articles publiés pour le moment.</p>
            </div>
        );
    };

    return (
        <>
            
            <div className="bg-gray-50 py-12 min-h-screen">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
                        Informations et Conseils
                    </h1>
                    <p className="text-lg text-center text-gray-600 mb-12">
                        Ressources pour cultiver votre bien-être mental et gérer le stress au quotidien.
                    </p>
                    {renderContent()}
                </div>
            </div>
        </>
    );
};

export default Informations;
