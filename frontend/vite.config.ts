import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['src/css/app.css', 'src/js/app.tsx'],
            publicDirectory: '../backend/public',
            refresh: [
                '../backend/routes/**',
                '../backend/app/**',
                '../backend/resources/views/**',
            ],
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src/js'),
        },
    },
});
