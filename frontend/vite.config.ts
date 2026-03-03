/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
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
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/js/setupTests.ts',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src/js'),
        },
    },
});
