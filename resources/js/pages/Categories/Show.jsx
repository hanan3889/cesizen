import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { categorieService } from '../../services/api';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const ArticleCard = ({ page, category }) => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{page.titre}</h3>
            <p className="text-gray-600 mb-4 flex-grow">{page.description}</p>
            <Link
                href={`/categories/${category.id}`}
                className="text-cesizen-green underline font-semibold mt-auto"
            >
                {category.categorie}
            </Link>
        </div>
    );
};

const ShowCategory = ({ categoryId }) => {
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await categorieService.getOne(categoryId);
                setCategory(response.data.categorie);
            } catch (err) {
                setError('Impossible de charger la catégorie. Veuillez réessayer plus tard.');
                console.error("Erreur lors de la récupération de la catégorie:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [categoryId]);

    const filteredArticles = category?.pages?.filter(page =>
        page.titre.toLowerCase().startsWith(searchTerm.toLowerCase())
    ) || [];

    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center text-gray-500 mt-16">
                    <p>Chargement de la catégorie...</p>
                </div>
            );
        }

        if (error) {
            return (
                <Alert variant="destructive" className="max-w-lg mx-auto">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            );
        }

        if (category) {
            return (
                <>
                    <div className="mb-10 max-w-lg mx-auto">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Rechercher par titre d'article..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-cesizen-green focus:border-transparent transition"
                        />
                    </div>

                    {filteredArticles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredArticles.map((page) => (
                                <ArticleCard key={page.id} page={page} category={category} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 mt-16">
                            <p>
                                {category.pages?.length > 0
                                    ? "Aucun article ne correspond à votre recherche."
                                    : "Il n'y a pas d'articles publiés dans cette catégorie pour le moment."}
                            </p>
                        </div>
                    )}
                </>
            );
        }

        return null; // Should not happen if error is handled
    };

    return (
        <>
            <Head title={category ? category.categorie : 'Catégorie'} />
            <div className="bg-gray-50 py-12 min-h-screen">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
                        Catégorie : {category ? category.categorie : '...'}
                    </h1>
                    <p className="text-lg text-center text-gray-600 mb-12">
                        {category ? `Articles et informations sur le thème "${category.categorie}".` : ''}
                    </p>
                    {renderContent()}
                </div>
            </div>
        </>
    );
};

export default ShowCategory;

