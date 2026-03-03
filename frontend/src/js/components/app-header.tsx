import { Link } from '@inertiajs/react';
import AppLogo from '@/components/app-logo';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';

export function AppHeader() {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <header className="sticky top-0 z-30 w-full border-b bg-background/90 backdrop-blur-sm">
            <div className="container mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/">
                    <AppLogo />
                </Link>
                <nav className="flex items-center space-x-6">
                    <Link
                        href="/"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Accueil
                    </Link>
                    <Link
                        href="/informations"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Informations
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Tableau de bord
                            </Link>
                            <span className="text-sm font-medium text-muted-foreground">
                                Bonjour, {user?.name}
                            </span>
                            <Button
                                onClick={logout}
                                variant="outline"
                                size="sm"
                            >
                                Déconnexion
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Se connecter
                            </Link>
                            <Link
                                href="/register"
                                className="inline-flex h-9 items-center justify-center rounded-md bg-cesizen-green px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-cesizen-green-dark focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                Créer un compte
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
