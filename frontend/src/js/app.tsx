import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import { initializeTheme } from './hooks/use-appearance';
import AppLayout from './layouts/app-layout';
import { route } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.{jsx,tsx}');
        let path = `./pages/${name}.jsx`;

        if (!pages[path]) {
            path = `./pages/${name}.tsx`;
        }

        const page = resolvePageComponent(path, pages);

        // @ts-expect-error
        page.then((module) => {
            // @ts-expect-error
            module.default.layout = module.default.layout || ((page) => <AppLayout>{page}</AppLayout>);
        });

        return page;
    },
    setup({ el, App, props }) {
        window.route = (name, params, absolute, config = props.initialPage.props.ziggy) => 
            route(name, params, absolute, config);

        const root = createRoot(el);

        root.render(
            <StrictMode>
                <AuthProvider>
                    <App {...props} />
                </AuthProvider>
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();