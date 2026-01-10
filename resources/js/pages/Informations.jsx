import React from 'react';
import { Head, Link } from '@inertiajs/react';

const ArticleCard = ({ article }) => {
    // Crée une version de la catégorie sécurisée pour les URLs
    const categorySlug = encodeURIComponent(article.categorie.categorie);

    return (
        <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{article.titre}</h3>
            <p className="text-gray-600 mb-4 flex-grow">{article.description}</p>
            <Link
                href={`/categories/${categorySlug}`}
                className="text-cesizen-green underline font-semibold mt-auto"
            >
                {article.categorie.categorie}
            </Link>
        </div>
    );
};

const Informations = ({ articles }) => {
    return (
        <>
            <Head title="Informations" />
            <div className="bg-gray-50 py-12 min-h-screen">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
                        Informations et Conseils
                    </h1>
                    <p className="text-lg text-center text-gray-600 mb-12">
                        Ressources pour cultiver votre bien-être mental et gérer le stress au quotidien.
                    </p>
                    {articles && articles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {articles.map((article) => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 mt-16">
                            <p>Il n'y a pas d'articles publiés pour le moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Informations;