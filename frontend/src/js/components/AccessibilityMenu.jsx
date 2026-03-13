import React, { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'cesizen-a11y';

const defaults = {
    largeText:      false,
    highContrast:   false,
    underlineLinks: false,
};

const applyToDOM = (settings) => {
    const html = document.documentElement;
    html.classList.toggle('a11y-large-text',      settings.largeText);
    html.classList.toggle('a11y-high-contrast',   settings.highContrast);
    html.classList.toggle('a11y-underline-links', settings.underlineLinks);
};

const loadSettings = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaults;
    } catch {
        return defaults;
    }
};

const AccessibilityMenu = () => {
    const [open, setOpen]       = useState(false);
    const [settings, setSettings] = useState(loadSettings);
    const panelRef              = useRef(null);
    const triggerRef            = useRef(null);

    // Applique les préférences au DOM dès le chargement et à chaque changement
    useEffect(() => {
        applyToDOM(settings);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }, [settings]);

    // Ferme le panneau au clic en dehors
    useEffect(() => {
        if (!open) return;
        const handleOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, [open]);

    // Ferme sur Échap et remet le focus sur le bouton déclencheur
    useEffect(() => {
        if (!open) return;
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                setOpen(false);
                triggerRef.current?.focus();
            }
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [open]);

    const toggle = (key) =>
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

    const reset = () => setSettings(defaults);

    const activeCount = Object.values(settings).filter(Boolean).length;

    return (
        <div ref={panelRef} className="a11y-wrap">
            {/* Bouton déclencheur */}
            <button
                ref={triggerRef}
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-haspopup="dialog"
                aria-label={`Options d'accessibilité${activeCount > 0 ? ` (${activeCount} actif${activeCount > 1 ? 's' : ''})` : ''}`}
                className={`a11y-trigger${activeCount > 0 ? ' a11y-trigger--active' : ''}`}
                title="Accessibilité visuelle"
            >
                {/* Icône personnage accessibilité */}
                <svg
                    aria-hidden="true"
                    focusable="false"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="4" r="1.5" fill="currentColor" stroke="none" />
                    <path d="M12 8v4" />
                    <path d="M8 12h8" />
                    <path d="M10 16l-2 4" />
                    <path d="M14 16l2 4" />
                </svg>
                <span className="sr-only">Accessibilité</span>
                {activeCount > 0 && (
                    <span aria-hidden="true" className="a11y-badge">{activeCount}</span>
                )}
            </button>

            {/* Panneau d'options */}
            {open && (
                <div
                    role="dialog"
                    aria-modal="false"
                    aria-label="Options d'accessibilité visuelle"
                    className="a11y-panel"
                >
                    <p className="a11y-panel-title" id="a11y-panel-heading">
                        Accessibilité visuelle
                    </p>

                    <ul className="a11y-options" aria-labelledby="a11y-panel-heading" role="list">

                        {/* Agrandir le texte */}
                        <li>
                            <label className="a11y-option">
                                <input
                                    type="checkbox"
                                    checked={settings.largeText}
                                    onChange={() => toggle('largeText')}
                                    className="a11y-checkbox"
                                    aria-describedby="desc-large-text"
                                />
                                <span className="a11y-option-label">
                                    <span className="a11y-option-icon" aria-hidden="true">A+</span>
                                    Agrandir le texte
                                </span>
                            </label>
                            <span id="desc-large-text" className="sr-only">
                                Augmente la taille de la police de 25 %
                            </span>
                        </li>

                        {/* Contraste élevé */}
                        <li>
                            <label className="a11y-option">
                                <input
                                    type="checkbox"
                                    checked={settings.highContrast}
                                    onChange={() => toggle('highContrast')}
                                    className="a11y-checkbox"
                                    aria-describedby="desc-contrast"
                                />
                                <span className="a11y-option-label">
                                    <span className="a11y-option-icon" aria-hidden="true">◑</span>
                                    Contraste élevé
                                </span>
                            </label>
                            <span id="desc-contrast" className="sr-only">
                                Passe l'interface en mode noir et blanc à fort contraste
                            </span>
                        </li>

                        {/* Souligner les liens */}
                        <li>
                            <label className="a11y-option">
                                <input
                                    type="checkbox"
                                    checked={settings.underlineLinks}
                                    onChange={() => toggle('underlineLinks')}
                                    className="a11y-checkbox"
                                    aria-describedby="desc-links"
                                />
                                <span className="a11y-option-label">
                                    <span className="a11y-option-icon" aria-hidden="true">U̲</span>
                                    Souligner les liens
                                </span>
                            </label>
                            <span id="desc-links" className="sr-only">
                                Ajoute un soulignement sur tous les liens de la page
                            </span>
                        </li>
                    </ul>

                    {/* Réinitialiser */}
                    <button
                        onClick={reset}
                        disabled={activeCount === 0}
                        className="a11y-reset"
                        aria-label="Réinitialiser toutes les options d'accessibilité"
                    >
                        Réinitialiser
                    </button>
                </div>
            )}
        </div>
    );
};

export default AccessibilityMenu;
