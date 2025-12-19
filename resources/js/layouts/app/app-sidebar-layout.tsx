import { AppFooter } from '@/components/app-footer';
import { AppHeader } from '@/components/app-header';
import { type PropsWithChildren } from 'react';

export default function AppMainLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <AppHeader />
            <main className="flex-1 container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </main>
            <AppFooter />
        </div>
    );
}
