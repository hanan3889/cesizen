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
    server: {
        historyApiFallback: true,  
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/js/setupTests.ts',
        testTimeout: 15000,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov', 'clover'],
            reportsDirectory: './coverage',
            include: ['src/js/**/*.{js,jsx,ts,tsx}'],
            exclude: [
                'src/js/**/*.test.{js,jsx,ts,tsx}',
                'src/js/setupTests.ts',
                'src/js/app.tsx',
                'src/js/routes/**',
            ],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src/js'),
        },
    },
});