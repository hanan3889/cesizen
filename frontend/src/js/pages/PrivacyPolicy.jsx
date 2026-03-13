import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';

const Section = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">{title}</h2>
        <div className="text-gray-600 space-y-3 text-sm leading-relaxed">{children}</div>
    </section>
);

const PrivacyPolicy = () => {
    useEffect(() => { document.title = 'Politique de confidentialité — CesiZen'; }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                    <div className="mb-8">
                        <Link to="/" className="text-sm text-cesizen-green hover:underline">← Retour à l'accueil</Link>
                        <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">Politique de confidentialité</h1>
                        <p className="text-sm text-gray-400">Dernière mise à jour : mars 2026 — Conforme au Règlement Général sur la Protection des Données (RGPD)</p>
                    </div>

                    <Section title="1. Responsable du traitement">
                        <p>
                            Pour toute question relative à vos données personnelles, vous pouvez contacter l'équipe projet à l'adresse :
                            <strong> bonjour@cesizen.fr</strong>
                        </p>
                    </Section>

                    <Section title="2. Données collectées">
                        <p>Lors de votre utilisation de CesiZen, nous collectons uniquement les données nécessaires au fonctionnement du service :</p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li><strong>Données d'inscription</strong> : nom complet, adresse e-mail, mot de passe (chiffré)</li>
                            <li><strong>Données de diagnostic</strong> : score de stress Holmes &amp; Rahe, niveau de stress, événements de vie sélectionnés, date du test</li>
                            <li><strong>Données de navigation</strong> : aucun cookie de traçage ni de publicité n'est utilisé</li>
                        </ul>
                        <p className="mt-2">Nous ne collectons pas de données sensibles au sens de l'article 9 du RGPD (santé, origine ethnique, opinions politiques, etc.).</p>
                    </Section>

                    <Section title="3. Finalités du traitement">
                        <p>Vos données sont utilisées exclusivement pour :</p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>La création et la gestion de votre compte utilisateur</li>
                            <li>L'enregistrement et l'affichage de votre historique de diagnostics de stress</li>
                            <li>L'authentification sécurisée via token</li>
                        </ul>
                        <p className="mt-2">Aucune donnée n'est transmise à des tiers, utilisée à des fins commerciales ou publicitaires.</p>
                    </Section>

                    <Section title="4. Base légale du traitement">
                        <p>Le traitement de vos données repose sur :</p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li><strong>Votre consentement explicite</strong> lors de la création de compte</li>
                            <li><strong>L'exécution du contrat</strong> (utilisation du service CesiZen)</li>
                        </ul>
                        <p className="mt-2">Vous pouvez retirer votre consentement à tout moment en supprimant votre compte.</p>
                    </Section>

                    <Section title="5. Durée de conservation">
                        <p>Vos données sont conservées <strong>tant que votre compte est actif</strong>. En cas de suppression de votre compte, toutes vos données personnelles et diagnostics sont définitivement supprimés de nos serveurs dans un délai de 30 jours.</p>
                    </Section>

                    <Section title="6. Vos droits (RGPD)">
                        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li><strong>Droit d'accès</strong> : consulter les données vous concernant</li>
                            <li><strong>Droit de rectification</strong> : modifier vos informations depuis votre espace personnel</li>
                            <li><strong>Droit à l'effacement</strong> : supprimer votre compte et toutes vos données</li>
                            <li><strong>Droit à la portabilité</strong> : exporter vos données au format JSON depuis votre espace personnel</li>
                            <li><strong>Droit d'opposition</strong> : vous opposer à certains traitements</li>
                        </ul>
                        <p className="mt-2">Pour exercer ces droits (sauf rectification et suppression disponibles directement dans l'application), contactez-nous à <strong>cesizen@projet-cesi.fr</strong>.</p>
                        <p className="mt-2">Vous disposez également du droit d'introduire une réclamation auprès de la <strong>CNIL</strong> (Commission Nationale de l'Informatique et des Libertés) — <a href="https://www.cnil.fr" className="text-cesizen-green hover:underline" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>.</p>
                    </Section>

                    <Section title="7. Sécurité des données">
                        <p>Nous mettons en œuvre les mesures techniques suivantes pour protéger vos données :</p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>Mots de passe hachés avec bcrypt</li>
                            <li>Authentification par token Sanctum (pas de session côté serveur)</li>
                            <li>Communications chiffrées via HTTPS</li>
                            <li>Aucun partage de données avec des services tiers d'analyse ou de publicité</li>
                        </ul>
                    </Section>

                    <Section title="8. Cookies">
                        <p>CesiZen n'utilise <strong>aucun cookie de traçage ou publicitaire</strong>. Seul le token d'authentification est stocké dans le <code>localStorage</code> de votre navigateur, uniquement pour maintenir votre session de connexion.</p>
                    </Section>

                    <div className="mt-10 pt-6 border-t border-gray-200 text-center">
                        <p className="text-sm text-gray-400 mb-4">Vous pouvez exercer vos droits directement depuis votre espace personnel.</p>
                        <Link to="/dashboard" className="inline-block bg-cesizen-green text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-cesizen-green-dark transition">
                            Accéder à mon espace
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
