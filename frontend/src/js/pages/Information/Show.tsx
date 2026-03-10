import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { pageService } from '@/services/api';
import { Badge } from '@/components/ui/badge';

interface Categorie {
    id: number;
    categorie: string;
    created_at: string;
    updated_at: string;
}

interface PageInformation {
    id: number;
    titre: string;
    slug: string;
    description: string;
    statut: 'brouillon' | 'publie' | 'archive';
    categorie_information_id: number;
    administrateur_id: number;
    created_at: string;
    updated_at: string;
    categorie: Categorie;
}

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
};

const InformationShow = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [page, setPage] = useState<PageInformation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const response = await pageService.getBySlug(slug!);
                const data = response.data.page ?? response.data;
                setPage(data);
                document.title = `${data.titre} — CesiZen`;
            } catch (err: any) {
                if (err.response?.status === 404) {
                    navigate('/informations', { replace: true });
                } else {
                    setError('Impossible de charger cet article.');
                }
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchPage();
    }, [slug, navigate]);

    if (loading) {
        return (
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center text-gray-500 mt-16">
                <p>Chargement de l'article...</p>
            </div>
        );
    }

    if (error || !page) {
        return (
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center text-red-500 mt-16">
                <p>{error ?? 'Article introuvable.'}</p>
                <Link to="/informations" className="mt-4 inline-block text-cesizen-green underline">
                    Retour aux informations
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <article className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <header className="mb-8">
                    <div className="flex items-center justify-between">
                        <Badge variant="secondary">{page.categorie.categorie}</Badge>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Mis à jour le {formatDate(page.updated_at)}
                        </p>
                    </div>
                    <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        {page.titre}
                    </h1>
                </header>
                <div
                    className="prose dark:prose-invert lg:prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: page.description }}
                />
            </article>
            <div className="max-w-4xl mx-auto text-center mt-8">
                <Link
                    to="/informations"
                    className="inline-flex items-center justify-center rounded-md bg-cesizen-green px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-cesizen-green-dark focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                    Retour aux informations
                </Link>
            </div>
        </div>
    );
};

export default InformationShow;
