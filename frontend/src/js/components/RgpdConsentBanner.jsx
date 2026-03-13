import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const CONSENT_KEY = 'cesizen_rgpd_consent';

const RgpdConsentBanner = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem(CONSENT_KEY)) {
            setVisible(true);
        }
    }, []);

    if (!visible) return null;

    const accept = () => {
        localStorage.setItem(CONSENT_KEY, 'accepted');
        setVisible(false);
    };

    const refuse = () => {
        localStorage.setItem(CONSENT_KEY, 'refused');
        setVisible(false);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 shadow-2xl">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-start gap-3 flex-1">
                    <Shield className="h-5 w-5 text-cesizen-green flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-white font-medium">Vos données et votre vie privée</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            CesiZen stocke uniquement les données nécessaires à son fonctionnement (compte, diagnostics).
                            Aucun cookie publicitaire ni traçage tiers.{' '}
                            <Link to="/privacy" className="text-cesizen-green hover:underline">
                                Politique de confidentialité
                            </Link>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        onClick={refuse}
                        className="px-4 py-1.5 text-xs font-medium text-gray-300 border border-gray-600 rounded-lg hover:border-gray-400 hover:text-white transition"
                    >
                        Refuser
                    </button>
                    <button
                        onClick={accept}
                        className="px-4 py-1.5 text-xs font-medium text-white bg-cesizen-green hover:bg-cesizen-green-dark rounded-lg transition"
                    >
                        Accepter
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RgpdConsentBanner;
