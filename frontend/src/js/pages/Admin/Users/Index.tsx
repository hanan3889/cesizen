import { AlertTriangle, KeyRound, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AdminLayout from '@/layouts/AdminLayout';
import { userService } from '@/services/api';
import { type User } from '@/types/user';

const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
        });
    } catch {
        return dateString;
    }
};

// Modale de confirmation générique
const ConfirmModal = ({
    open, title, message, confirmLabel, confirmClass, onConfirm, onCancel,
}: {
    open: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    confirmClass: string;
    onConfirm: () => void;
    onCancel: () => void;
}) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${confirmClass}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

const UsersIndex = () => {
    const [users, setUsers] = useState<{ data: User[]; links: any[] }>({ data: [], links: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // État de la modale de suppression
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });
    // État de la modale de reset
    const [resetModal, setResetModal] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });
    // États de chargement des actions
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        document.title = 'Gestion des Utilisateurs — CesiZen';
    }, []);

    const showFeedback = (type: 'success' | 'error', message: string) => {
        setFeedback({ type, message });
        setTimeout(() => setFeedback(null), 5000);
    };

    const fetchUsers = async (url?: string) => {
        setLoading(true);
        try {
            const page = url ? new URL(url).searchParams.get('page') : '1';
            const response = await userService.getAll({ page });
            setUsers(response.data.data);
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

    const handleDelete = async () => {
        if (!deleteModal.user) return;
        setActionLoading(true);
        try {
            await userService.delete(deleteModal.user.id);
            showFeedback('success', `L'utilisateur "${deleteModal.user.name}" a été supprimé.`);
            setDeleteModal({ open: false, user: null });
            fetchUsers();
        } catch (err) {
            showFeedback('error', 'Impossible de supprimer cet utilisateur.');
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!resetModal.user) return;
        setActionLoading(true);
        try {
            await userService.resetPassword(resetModal.user.id);
            showFeedback('success', `Email de réinitialisation envoyé à ${resetModal.user.email}.`);
            setResetModal({ open: false, user: null });
        } catch (err) {
            showFeedback('error', 'Impossible d\'envoyer l\'email de réinitialisation.');
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nom</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rôle</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Inscrit le</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {users.data.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            user.role === 'administrateur'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-sky-100 text-sky-800'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDate(user.created_at)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* Reset mot de passe */}
                                            <button
                                                onClick={() => setResetModal({ open: true, user })}
                                                title="Envoyer un email de réinitialisation"
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors"
                                            >
                                                <KeyRound className="h-3.5 w-3.5" />
                                                Réinit. MDP
                                            </button>
                                            {/* Supprimer */}
                                            <button
                                                onClick={() => setDeleteModal({ open: true, user })}
                                                title="Supprimer cet utilisateur"
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                Supprimer
                                            </button>
                                        </div>
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
                                    disabled={!link.url}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                        link.active
                                            ? 'z-10 bg-cesizen-green border-cesizen-green-dark text-white'
                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50'
                                    } ${index === 0 ? 'rounded-l-md' : ''} ${index === users.links.length - 1 ? 'rounded-r-md' : ''}`}
                                />
                            ))}
                        </nav>
                    </div>
                )}
            </>
        );
    };

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                    Gestion des Utilisateurs
                </h1>
            </div>

            {/* Feedback toast */}
            {feedback && (
                <div className={`mb-4 px-4 py-3 rounded-md text-sm font-medium ${
                    feedback.type === 'success'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                    {feedback.message}
                </div>
            )}

            {renderContent()}

            {/* Modale suppression */}
            <ConfirmModal
                open={deleteModal.open}
                title="Supprimer l'utilisateur"
                message={`Êtes-vous sûr de vouloir supprimer "${deleteModal.user?.name}" (${deleteModal.user?.email}) ? Cette action est irréversible.`}
                confirmLabel={actionLoading ? 'Suppression...' : 'Supprimer'}
                confirmClass="bg-red-600 hover:bg-red-700 disabled:opacity-50"
                onConfirm={handleDelete}
                onCancel={() => setDeleteModal({ open: false, user: null })}
            />

            {/* Modale reset mot de passe */}
            <ConfirmModal
                open={resetModal.open}
                title="Réinitialiser le mot de passe"
                message={`Un email de réinitialisation sera envoyé à "${resetModal.user?.email}". L'utilisateur devra choisir un nouveau mot de passe via le lien reçu.`}
                confirmLabel={actionLoading ? 'Envoi...' : 'Envoyer l\'email'}
                confirmClass="bg-amber-500 hover:bg-amber-600 disabled:opacity-50"
                onConfirm={handleResetPassword}
                onCancel={() => setResetModal({ open: false, user: null })}
            />
        </AdminLayout>
    );
};

export default UsersIndex;
