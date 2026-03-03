import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { type User } from '@/types/user';
import { userService } from '@/services/api';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

// Helper pour formater la date
const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    } catch (e) {
        return dateString;
    }
};

const UsersIndex = () => {
    const [users, setUsers] = useState<{ data: User[]; links: any[] }>({ data: [], links: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async (url?: string) => {
        setLoading(true);
        try {
            // userService.getAll() prend un objet de filtres, mais pour la pagination,
            // l'URL complète est dans la réponse de l'API.
            // Nous devons extraire le numéro de page de l'URL.
            const page = url ? new URL(url).searchParams.get('page') : '1';
            const response = await userService.getAll({ page });
            setUsers(response.data);
        } catch (err) {
            setError('Impossible de charger les utilisateurs.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center py-10">
                    <p className="text-gray-500">Chargement des utilisateurs...</p>
                </div>
            );
        }

        if (error) {
            return (
                <Alert variant="destructive" className="my-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            );
        }

        if (users.data.length === 0) {
            return (
                <div className="text-center py-10">
                    <p className="text-gray-500">Aucun utilisateur trouvé.</p>
                </div>
            );
        }

        return (
            <>
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nom</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rôle</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Inscrit le</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {users.data.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            user.role === 'administrateur' ? 'bg-green-100 text-green-800' : 'bg-sky-100 text-sky-800'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDate(user.created_at)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {/* Les boutons d'action (modifier, etc.) viendront ici */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {users.links.length > 3 && (
                    <div className="mt-6 flex justify-end">
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            {users.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => link.url && fetchUsers(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                        link.active ? 'z-10 bg-cesizen-green border-cesizen-green-dark text-white' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                    } ${index === 0 ? 'rounded-l-md' : ''} ${index === users.links.length - 1 ? 'rounded-r-md' : ''}`}
                                    disabled={!link.url}
                                />
                            ))}
                        </nav>
                    </div>
                )}
            </>
        );
    };

    return (
        <>
            <Head title="Gestion des Utilisateurs" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                Gestion des Utilisateurs
            </h1>
            {renderContent()}
        </>
    );
};

// Assigne le layout d'administration à cette page
UsersIndex.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default UsersIndex;

