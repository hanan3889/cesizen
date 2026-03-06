import React from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';

// Define the shape of the Categorie object
interface Categorie {
    id: number;
    categorie: string;
    created_at: string;
    updated_at: string;
}

// Define the shape of the PageInformation object
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

// Define the props for the page component
interface InformationShowProps {
    page: PageInformation;
}

const InformationShow = () => {
    const { page } = usePage<InformationShowProps>().props;

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    return (
        <>
            <Head title={page.titre} />
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
                        href="/informations"
                        className="inline-flex items-center justify-center rounded-md bg-cesizen-green px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-cesizen-green-dark focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        Retour aux informations
                    </Link>
                </div>
            </div>
        </>
    );
};

InformationShow.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;

export default InformationShow;
