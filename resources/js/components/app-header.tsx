import { Link } from '@inertiajs/react';
import { login, register } from '@/routes';
import AppLogo from '@/components/app-logo';

export function AppHeader() {
    return (
        <header className="sticky top-0 z-30 w-full border-b bg-background/90 backdrop-blur-sm">
            <div className="container mx-auto flex h-14 max-w-screen-xl items-center justify-end px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center space-x-6">
                    <Link
                        href="/"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Accueil
                    </Link>
                    <Link
                        href={login.url()}
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Se connecter
                    </Link>
                    <Link
                        href={register.url()}
                        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        Créer un compte
                    </Link>
                </nav>
            </div>
        </header>
    );
}
