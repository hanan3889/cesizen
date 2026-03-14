import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'cesizen-theme';

const getInitialTheme = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    // Respecte la préférence système
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyTheme = (theme) => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
};

const ThemeToggle = () => {
    const [theme, setTheme] = useState(() => {
        try { return getInitialTheme(); } catch { return 'light'; }
    });

    useEffect(() => {
        applyTheme(theme);
        localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggle}
            aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
            title={isDark ? 'Mode clair' : 'Mode sombre'}
            className="theme-toggle"
        >
            {isDark ? (
                /* Soleil */
                <svg aria-hidden="true" focusable="false" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1"  x2="12" y2="3"  />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64"  />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1"  y1="12" x2="3"  y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22" />
                </svg>
            ) : (
                /* Lune */
                <svg aria-hidden="true" focusable="false" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
                </svg>
            )}
        </button>
    );
};

export default ThemeToggle;
