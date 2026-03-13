import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { pageService } from '@/services/api';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'publie':
            return 'success';
        case 'archive':
            return 'secondary';
        case 'brouillon':
        default:
            return 'outline';
    }
};

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
};

const InformationIndex = () => {
    const [pages, setPages] = useState<PageInformation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        document.title = "Pages d'Information — CesiZen";
    }, []);

    useEffect(() => {
        const fetchPages = async () => {
            try {
                const response = await pageService.getAll({ statut: 'publie' });
                setPages(response.data.data ?? response.data);
            } catch (err) {
                setError('Impossible de charger les pages d\'information.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPages();
    }, []);

    if (loading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 text-center text-gray-500 mt-16">
                <p>Chargement des pages...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 text-center text-red-500 mt-16">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">Pages d'information</h1>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        Liste de toutes les pages d'information disponibles.
                    </p>
                </div>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pages.map((page) => (
                    <Link to={`/informations/${page.slug}`} key={page.id} className="block hover:scale-105 transition-transform duration-200">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="truncate">{page.titre}</CardTitle>
                                <CardDescription>{page.categorie.categorie}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col justify-between h-full">
                                <div className="flex-grow" />
                                <div className="mt-4 flex items-center justify-between">
                                    <Badge variant={getStatusVariant(page.statut)}>{page.statut}</Badge>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Mis à jour le {formatDate(page.updated_at)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
            {pages.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">Aucune page d'information trouvée.</p>
                </div>
            )}
        </div>
    );
};

export default InformationIndex;
