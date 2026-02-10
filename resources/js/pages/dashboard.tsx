import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { type PageProps } from '@/types';

const Dashboard = () => {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Dashboard" />
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Bonjour, {auth.user?.name ?? 'Admin'} !
                </h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                    Bienvenue sur votre tableau de bord CesiZen.
                </p>
                <p className="mt-2 text-gray-500">
                    Utilisez le menu de gauche pour naviguer entre les différentes sections de l'administration.
                </p>
            </div>
        </>
    );
};

// Assigne le layout d'administration à cette page
Dashboard.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default Dashboard;