import React from 'react';
import { Link } from '@inertiajs/react';
import AppLogo from '@/components/app-logo';


// Définition des liens de navigation
const navLinks = [
    { href: route('admin.users.index'), label: 'Utilisateurs', icon: '👤' },
    { href: '#', label: 'Pages', icon: '📄' },
    { href: '#', label: 'Catégories', icon: '🏷️' },
    { href: '#', label: 'Diagnostiques', icon: '🩺' },
    { href: '/settings/profile', label: 'Paramètres', icon: '⚙️' }, // Lien existant
];

const NavLink = ({ href, label, icon }) => (
    <Link
        href={href}
        className="flex items-center px-4 py-2.5 text-green-100 hover:bg-cesizen-green hover:text-white rounded-md transition-colors duration-200"
    >
        <span className="w-6 mr-2 text-lg">{icon}</span>
        <span>{label}</span>
    </Link>
);

export const AdminSidebar = () => {
    return (
        <aside className="w-64 flex-shrink-0 bg-cesizen-green-dark text-white flex flex-col">
            {/* Header du panneau latéral */}
            <div className="h-16 flex items-center justify-center px-4 border-b border-cesizen-green">
                <Link href="/dashboard" className="flex items-center">
                    <AppLogo />
                    <span className="ml-3 text-xl font-semibold">Admin</span>
                </Link>
            </div>

            {/* Navigation principale */}
            <nav className="flex-grow px-4 py-6 space-y-1">
                {navLinks.map(link => (
                    <NavLink key={link.label} {...link} />
                ))}
            </nav>

            {/* Footer du panneau latéral */}
            <div className="px-4 py-4 border-t border-cesizen-green">
                {/* Vous pouvez ajouter des informations sur l'utilisateur ici plus tard */}
            </div>
        </aside>
    );
};